import {Component, ElementRef, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {HttpService} from "./http.service";
import {ActivatedRoute, ActivationEnd, Event, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {GlobalFunctionService} from "./global-function.service";
import {LocalService} from "./local.service";
import {ModuleItemsService} from "./module-items.service";
import {CacheService} from "./cache.service";
import {AuthService} from "./auth.service";
import {environment} from "../environments/environment";
import * as moment from 'moment';
import {FavoritesService} from "./favorites.service";
import {SettingsService} from './settings.service';
import * as ClassicEditor from 'src/app/right-sidebar-tray/ckeditor-build';
import {Subscription} from "rxjs";
import {adminMenus, colorVariables, templateFeatures} from "./templates";
import { OneSignal } from 'onesignal-ngx';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public socilStep = 0;
    mobileMenu = false;
    mobileMenuBtn = false;
    mobileAppsMenus = false;
    isActive = false;
    public inviteObject: any = {emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false};
    public step = 1;
    public contactSales: any = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        job_title: '',
        company_size: '',
        how_can_we_help: '',
    };
    public isContactSalesFormValid = false;
    public siteUrl = environment.siteUrl;
    show = false;
    isShowNotification = false;
    unreadNotificationCount: any = 0;
    isShowFavorites = false;
    isShowHelp = false;
    isNewShowHelp = false;
    title = 'CRM';
    sidebarCollapsed = true;
    btnAngle = 'left';
    isGlobalSearch = false
    openChildren = false;
    public menuLoaded = false;
    public menuItems: any[] = [];
    public modules: any[] = [];
    public selectedModuleIndex = 0;
    public boards = 0;
    public userData: any;
    public apps: any = [];
    public menuType = 'workspace';
    public filterViews: any = [];
    public allBoards: any = [];
    public boardForImportData: any = {};
    public selectBoardForImportData: boolean = false;
    public ClassicEditor: any = ClassicEditor;
    // left bar menu resorting please update database
    public theme = 'light';
    isBoardsPage = false;
    tab: any;
    public isLoggedIn = false;
    public boardIcons: any = [];
    public moduleIcons: any = [];
    public boardIds: any = {
        inbox: 0,
        activities: 0
    }
    adminMenus: any = adminMenus;
    colorVariables: any = colorVariables;
    public templateFeatures = templateFeatures;
    private isOnboarding = false;
    appViewData: any;
    private myObserver: Subscription;
    private favoritesList: any;

    public isMoveToFolder: boolean = false;
    public folderName: string = '';
    public folders: any[] = [];
    public isPushEnabled = false;
    public hideNotiBar:any = 1;

    constructor(private deviceService: DeviceDetectorService,private httpService: HttpService, private cache: CacheService, private localStore: LocalService, private moduleService: ModuleItemsService, private router: Router, private route: ActivatedRoute, public auth: AuthService, public favorites: FavoritesService, public settings: SettingsService, private oneSignal: OneSignal) {
        this.detectDevice();
        this.myObserver = router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show progress spinner or progress bar
            }

            if (event instanceof NavigationEnd) {
                // remove body background color on load
                document.body.style.backgroundColor = '';

                /**
                 * Do not add above this line of code in ngOnInit if that is only for logged-in user
                 *
                 * Add your code which requires only when user is logged-in
                 */
                if (this.auth.isLoggedIn()) {
                    // Force load menu data if loaded very first time of the instance onboarding
                    if (this.localStore.get('onboarding') === true) {
                        this.isOnboarding = true;
                        this.getMenuItems(false, true);
                    }

                    this.switchParamsModule();
                    this.setupAppAfterLogin();

                    setTimeout(() => {
                    this.getData();
                    }, 1000);
                    this.subscribeRouteChangeDetection();
                    (window.innerWidth < 1440 ? this.sidebarCollapsed = false : this.sidebarCollapsed = true);

                    setTimeout(() => {
                        // TODO: enable push notifications again when it is ready on production
                        //this.handlePushNotification();
                    }, 1000);
                }
            }

            if (event instanceof NavigationError) {
                // Hide progress spinner or progress bar
                // Present error to user
            }
        });
    }


    // decect current device
    detectDevice(type = this.deviceService.getDeviceInfo().deviceType){
        if(type == 'mobile'){
            this.mobileMenu = true;
            this.mobileMenuBtn = true;
        }
    }

    ltrim(str: any) {
        if (!str) return str;
        return str.replace(/^\s+/g, '');
    }

    ngOnInit() {

        // get branding data to set logo
        this.settings.getBrandingData();
        this.setData();
      }

      setData() {}

    ngOnDestroy() {
        this.myObserver.unsubscribe();
    }

    handlePushNotification() {
        // Remove first / from url this.siteUrl
        const pathUrl = this.siteUrl === '/' ? '' : 'app/';

        this.oneSignal.init({
            appId: environment.appId,
            safari_web_id: environment.safari_web_id,
            serviceWorkerParam: {
                scope: this.siteUrl + 'assets/onesignal/'
            },
            serviceWorkerPath: pathUrl + 'assets/onesignal/OneSignalSDKWorker.js',
            notifyButton: {
                // enable: this.userData?.is_super_admin,
                enable: false
            },
            allowLocalhostAsSecureOrigin: true
        }).then(() => {
            // onesignal ID for this user to send push notification from backend
            this.oneSignal.getUserId().then((userId) => {
                console.log('userId', userId);
            });

            this.oneSignal.isPushNotificationsEnabled().then((isEnabled) => {
                this.isPushEnabled = isEnabled;
            });

            this.hideNotiBar = this.localStore.get('hideNotiBar');
        }).catch((error) => {
            console.log(error);
        });

        const that = this;
        this.oneSignal.on('subscriptionChange', function (isSubscribed) {
            that.isPushEnabled = isSubscribed;
            console.log("The user's subscription state is now:", isSubscribed);
        });
    }

    switchParamsModule() {
        // get redirect_module params
        const moduleRequest = this.route.snapshot.queryParamMap.get('redirect_module');

        // Check if module switch is required
        if (moduleRequest === null) {
            return;
        }

        // Get modules
        this.modules = this.moduleService.getAllModules();

        let module = 'crm';
        let navigateTo = '';

        switch (moduleRequest) {
            case 'crm':
            case 'marketing':
                module = moduleRequest;
                break;
            case 'financial':
                module = 'financials';
                break;
            case 'crm-inbox':
                module = 'crm';
                navigateTo = 'boards/' + this.boardIds.inbox;
                this.selectMenuType('inbox');
                break;
            case 'agents':
                module = 'team management';
                break;
            case 'crm-calendar':
                module = 'crm';
                navigateTo = 'boards/' + this.boardIds.activities + '/main';
                break;
            case 'crm-favorite':
                module = 'crm';
                this.selectMenuType('favorites');
                break;
            case 'crm-homepage':
                module = 'crm';
                navigateTo = 'home';
        }

        // Find module index by name lowercase
        const index = this.modules.findIndex((item) => item?.title.toLowerCase() === module.toLowerCase());

        // Switch module and navigate to specific page
        if (index > -1) {
            this.selectedModuleIndex = index;
            this.moduleService.setModule(index);
            this.getMenuItems(navigateTo === '');

            // navigate to specific page
            if (navigateTo !== '') {
                this.router.navigate([navigateTo]);
            }
        }
    }

    getData() {
        this.getFilterViews();
        this.loadApps();
        // set logos from customization component
        this.settings.setData();
    }

    /**
     * Load all boards data
     */
    getAllBoards() {
        this.cache.getAllBoards().then((boards) => {
            this.allBoards = boards || [];

            // Get inbox/activities board Ids
            this.boardIds.inbox = this.allBoards.find((board: any) => board.type === 'inbox')?.id;
            this.boardIds.activities = this.allBoards.find((board: any) => board.type === 'activity')?.id;
        });
    }

    sortLeftSidebarMenus(event: CdkDragDrop<{ title: string; poster: string }[]>) {
        moveItemInArray(this.menuItems, event.previousIndex, event.currentIndex);
    }

    //select menu type in left menu
    selectMenuType(type: string) {
        this.menuType = type;
        this.showNotification('hide');
        this.showHelp('hide');

        // Redirect to workspace's first item
        if (type == 'workspace') {
            this.loadFirstItem();
        }
    }

    /**
     * load user data if not in local storage
     */
    getUserData() {
        // get user data
        const userData = this.auth.getUserData();
        if (!userData) {
            this.httpService.getUserData().subscribe((response: any) => {
                this.auth.setUserData(response);
                this.setupAppAfterLogin();
            });
        }
    }

    /**
     * Load apps from local storage or from server
     */
    loadApps(force = false) {
        const apps = this.localStore.get('addon_apps');
        if (apps && !force) {
            this.apps = apps;
        } else {
            this.httpService.getApps().subscribe((response: any) => {
                this.localStore.set('addon_apps', response);
                this.apps = response;
            });
        }
    }

    isOnTrail() {
      if(this.apps?.[0]?.on_trial) {
        return true;
      }
      return false;
    }

    /**
     * Open app view for single app
     *
     * @param app
     */
    appView(app: any) {
        this.appViewData = app;
    }

    setupAppAfterLogin() {
        const userData = this.auth.getUserData();

        if (!this.userData) {
            this.getUserData();
        }

        this.userData = userData ? userData : {photo: ''};

        // URL decode
        this.userData.photo = this.userData ? decodeURIComponent(this.userData?.photo) : '';
        this.loadDisplayMode();
        this.selectedModuleIndex = this.moduleService.getCurrentModuleIndex();
        if (!this.isOnboarding) {
            this.getMenuItems(false)
        }

        setTimeout(() => {
        this.getAllBoards();
        }, 100);

        this.isLoggedIn = true;
    }

    getFilterViews() {
        const query = '';
        // First check if already available in cache
        const local = this.localStore.get('filterViews');
        if (local.length) {
            this.filterViews = JSON.parse(local);
        } else {
            this.httpService.getFilterView(query).subscribe((res: any) => {
                this.filterViews = res;
                this.localStore.set('filterViews', JSON.stringify(this.filterViews));
            });
        }
    }

    onViewClick(view: any) {
        this.router.navigate([`/boards/${view.board_id}/filter/${view.id}`]);
    }

    switchModule(index = 0) {
        // Redirect CMS, Operations, and Commission to WP
        if ([1, 3, 4].includes(index)) {
            this.loadWpModules(index);
            return;
        }

        // Handle other modules
        this.selectedModuleIndex = index;
        this.moduleService.setModule(index);
        this.getMenuItems(true);
        this.selectMenuType('workspace');
    }

    onSaveContactSales() {
        const isFalsy = Object.values(this.contactSales).every(value => {
            if (!value) {
                alert('All fields are required.');
                return true;
            }
            return false;
        });

        if (!isFalsy) {
            let element: HTMLElement = document.getElementById('contactSalesFormCloseButton') as HTMLElement;
            element.click();
            this.httpService.saveContactSales(this.contactSales).subscribe();
            this.contactSales = {
                first_name: '',
                last_name: '',
                email: '',
                phone_number: '',
                job_title: '',
                company_size: '',
                how_can_we_help: '',
            }
        }
    }

    loadWpModules(index = -1) {
        let url = '';
        switch (index) {
            case 1:
                url = '/wp-admin/?change_product=1&product_select=themes.php';
                break;
            case 3:
                url = '/wp-admin/?change_product=1&product_select=admin.php%3Fpage%3Dwc-admin%26path%3D%2Fanalytics%2Foverview';
                break;
            case 4:
                url = '/wp-admin/?change_product=1&product_select=admin.php%3Fpage%3Dcalib_commissions';
                break;
        }

        // Open WP urls
        this.openWPlinks(url);
    }

    /**
     * Open WP links with login token
     *
     * @param url
     */
    openWPlinks(url: string) {
        // login token
        const userData = this.auth.getUserData();
        const loginToken = userData?.autologin_token;

        // Login to WP
        url = `/?atmos-login=1&token=${loginToken}&redirect_uri=${encodeURIComponent(url)}`;

        window.open(url, "_blank") || window.location.replace(url);
    }

    //third level submenu
    thirdLevelSubmenus(item: any) {

        this.router.navigate([item.link]);
        item.expanded = !item.expanded;

        this.modules[this.selectedModuleIndex].items = this.menuItems
        this.localStore.set('menuItems', this.modules);
    }

    /**
     * Open navigation link
     *
     * @param item
     * @param index
     */
    oneMenuLink(item: any, index: number = -1) {
        if (index > -1) {
            this.menuItems[index].expanded = !this.menuItems[index].expanded;

            // Keep the menu expanded on even reload, it will cache the the status
            this.modules[this.selectedModuleIndex].items = this.menuItems
            this.localStore.set('menuItems', this.modules);
        }

        // Just expand parent menu item is clicked in case of WP links
        if (item.submenus !== undefined && item.submenus.length > 0 && item.submenus[0].params !== '') {
            // const params = "{\"link_type\":\"wp\", \"link\":\"wp-admin/admin.php?page=nm_main\"}";
            try {
                const data = JSON.parse(item.submenus[0].params);
                if (data.link_type == 'wp') {
                    return;
                }
            } catch (e) {
            }

        }else{
            this.mobileAppsMenus = false;
        }

        // Open WP links
        if (item.params !== '') {
            // const params = "{\"link_type\":\"wp\", \"link\":\"wp-admin/admin.php?page=nm_main\"}";
            try {
                const data = JSON.parse(item.params);
                if (data.link_type == 'wp') {
                    this.openWPlinks(data.link);
                    return;
                }
            } catch (e) {
            }
        }

        // Navigate to the link in Angular
        if (item.link && item.link !== '#') {
            this.router.navigate([item.link]);
        }
    }

    /**
     * Get and build menu items
     *
     * @param switchModule
     * @param force
     */
    getMenuItems(switchModule = false, force = false) {
        this.menuLoaded = force;
        const local = force ? false : this.localStore.get('menuItems');

        if (local && !force) {
            this.menuItems = local[this.selectedModuleIndex].items;
            this.modules = local;
            this.menuLoaded = true;
            this.folders = this.menuItems?.filter((item: any) => { return item?.entity_type === 'folder' });
        } else {
            this.httpService.getMenuItems().subscribe((data: any) => {
                this.processMenuData(data, switchModule);
                this.menuItems = data[0].items;
                this.modules = data;
                this.menuLoaded = true;
                this.folders = this.menuItems?.filter((item: any) => { return item?.entity_type === 'folder' });
            });
        }

        // load first menu item
        if (switchModule) {
            this.loadFirstItem();
        }
        this.setMenueItemIcons();
    }

    setMenueItemIcons() {
        this.modules.forEach((module: any) => {
            this.moduleIcons.push({
                module: module.module,
                icon: module.icon,
                moduleTitle: module.title,
            });
            module.items?.forEach((item: any) => {
                this.boardIcons.push({
                    boardId: item.entity_id,
                    icon: item.icon,
                    boardTitle: item.title,
                });
            });
          });
    }

    setMenuItems() {
        const currentModuleIndex = this.moduleService.getCurrentModuleIndex();
        if (currentModuleIndex !== 0) {
            this.menuItems = this.moduleService.getModuleItems();
        } else {
            this.loadFirstItem();
        }
    }

    /**
     * Load first item in the menu
     */
    loadFirstItem() {
        if (this.menuItems.length > 0 && !['', '#'].includes(this.menuItems[0].link)) {
            this.router.navigate([this.menuItems[0].link]);
        }
    }

    processMenuData(data: any, loadFirstItem = true) {
        this.moduleService.processMenuData(data);
        if (loadFirstItem) {
            this.loadFirstItem();
        }
    }

    showNotification(event: any) {
        (event == 'show' ? this.isShowNotification = true : this.isShowNotification = false);
    }

    setUnreadNotificationCount(event: any) {
      this.unreadNotificationCount = event;
    }

    showFavorites(event: any) {
        (event == 'show' ? this.isShowFavorites = true : this.isShowFavorites = false);
    }

    showHelp(event: any) {
        (event == 'show' ? this.isShowHelp = true : this.isShowHelp = false);
    }

    showNewHelp(event: any) {
        (event == 'show' ? this.isNewShowHelp = true : this.isNewShowHelp = false);
    }

    navbarCollapsed() {
        (this.sidebarCollapsed ? this.sidebarCollapsed = false : this.sidebarCollapsed = true);
        (this.sidebarCollapsed ? this.btnAngle = 'left' : this.btnAngle = 'right');
    }

    globalSearch(event: any) {
        (event == 'show' ? this.isGlobalSearch = true : this.isGlobalSearch = false);
    }

    reloadApp() {
        window.location.replace(this.siteUrl);
    }

    /**
     * Switch theme
     *
     * @param theme
     */
    changeDisplayMode(theme = 'light') {
        this.localStore.set('theme', theme, false);
        this.loadDisplayMode();
    }

    /**
     * load select color scheme
     */
    loadDisplayMode() {
        this.theme = this.localStore.get('theme', false, 'light');
        const styleElem = document.getElementById('color-scheme-variables');
        const currentTheme = document.getElementsByTagName('body')[0];
        if (styleElem !== null) {
            styleElem.innerHTML = `:root {${this.colorVariables[this.theme]}}`;
            if (this.theme == 'light') {
                currentTheme?.classList.add('light');
            } else {
                currentTheme?.classList.remove('light');
            }
        }
    }

    /**
     * Create new menu set
     */
    createMenuSet(type = '', migration = false, reInstall = false) {
        if (type == '') {
            return;
        }

        // clear menu cache
        this.cache.reCacheMenu();

        const data = {
            action: type,
            module: this.modules[this.selectedModuleIndex].module,
        };

        if (migration) {
            // handle templates migration board

            const data = {
                template: type,
                module: this.modules[this.selectedModuleIndex].module,
            };

            this.httpService.boardsMigration(data).subscribe((res: any) => {
                this.processMenuData(res.app_menu);
                this.localStore.set('menuItems', res.app_menu);
                this.getMenuItems();
            });

            // click trigger to close button id
            document.getElementById('template-center-close-btn')?.click();
        } else {
            let data: any = {
                app_id: type,
                module: this.modules[this.selectedModuleIndex].module,
            };

            if (reInstall) {
                data['re-install'] = 'true';
            }

            this.httpService.addAppTemplate(data).subscribe((res: any) => {
                // this.menuItems = [];

                // check if res is Array
                if (Array.isArray(res)) {
                    this.processMenuData(res);
                    this.localStore.set('menuItems', res);
                    this.getMenuItems();

                    // Load apps again to update the app list
                    this.loadApps(true);

                    // setTimeout(() => {
                    //   if(type === 'iqes') {
                    //     document.getElementById('iqes')?.click();
                    //   } else if(type === 'campaigns') {
                    //     document.getElementById('campaigns')?.click();
                    //   }
                    // }, 500);
                }
            });

            // Close popups
            document.getElementById('modal-close-campaigns-detail')?.click();
            document.getElementById('modal-close-appointments-detail')?.click();
            document.getElementById('modal-close-iqe-detail')?.click();
            document.getElementById('modal-close-all-apps')?.click();
        }
    }

    /**
     * Delete menu item
     * @param id
     */
    deleteMenuItem(id: any) {
        this.modules[this.selectedModuleIndex].items = this.modules[this.selectedModuleIndex].items.filter((item: any) => item.id !== id);
        this.menuItems = this.modules[this.selectedModuleIndex].items;
        this.localStore.set('menuItems', this.modules);
        this.folders = this.menuItems?.filter((item: any) => { return item?.entity_type === 'folder' });

        this.httpService.deleteMenu(id).subscribe((res: any) => {
            if (res.deleted == true) {
              this.getMenuItems(true, true);
                // this.modules[this.selectedModuleIndex].items = this.modules[this.selectedModuleIndex].items.filter((item: any) => item.id !== id);
                // this.menuItems = this.modules[this.selectedModuleIndex].items;
                // this.localStore.set('menuItems', this.modules);
            }
        });
    }

    logout() {
        this.auth.logout();
    }

    subscribeRouteChangeDetection() {
        this.setRecentBoardsInLocalStorage();
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                const isBoardRoute = event.url.split('/')[1] === 'boards';

                if (isBoardRoute) {
                    const data = {
                        name: '',
                        path: event.url,
                        date: '',
                        icon: '',
                        id: '',
                    }

                    const boardId = event.url.split('/')[2];
                    const board = this.allBoards.find((board: any) => {
                        return board.id === boardId;
                    });
                    board && (data.name = board.name);

                    const boardIcon = this.boardIcons.find((boardIcon: any) => {
                        return boardIcon.boardId === boardId
                    });
                    data.icon = boardIcon?.icon;

                    data.date = moment().format('MMM Do');

                    data.id = boardId;

                    if (data.name && data.path) {
                        this.setRecentBoards(data);
                    }
                }
            }
        });
    }

    setRecentBoardsInLocalStorage() {
        let storedRecentBoards = this.localStore.get('recentBoards') || [];
        if (!storedRecentBoards.length) {
            storedRecentBoards = [
                {
                    "id": 1,
                    "name": "Leads",
                    "path": "/boards/1/main",
                    "date": moment().format('MMM Do'),
                    "icon": "fa-magnet",
                },
                {
                    "id": 2,
                    "name": "Opportunities",
                    "path": "/boards/2/main",
                    "date": moment().format('MMM Do'),
                    "icon": "fa-briefcase",
                },
                {
                    "id": 3,
                    "name": "Contacts",
                    "path": "/boards/3/main",
                    "date": moment().format('MMM Do'),
                    "icon": "fa-address-book",
                },
                {
                    "id": 4,
                    "name": "Accounts",
                    "path": "/boards/4/main",
                    "date": moment().format('MMM Do'),
                    "icon": "fa-building",
                },
                {
                    "id": 5,
                    "name": "Activities",
                    "path": "/boards/" + this.boardIds.activities + "/main",
                    "date": moment().format('MMM Do'),
                    "icon": "fa-tasks",
                }
            ];
        }
        this.localStore.set('recentBoards', storedRecentBoards);
    }

    setRecentBoards(data: any) {
        let storedRecentBoards = this.localStore.get('recentBoards') || [];

        (storedRecentBoards.length === 10) && storedRecentBoards.splice(-5, 1);
        storedRecentBoards.forEach((board: any, i: number) => {
            if (board.path === data.path) {
                storedRecentBoards.splice(i, 1);
            }
        });
        storedRecentBoards.unshift(data);
        this.localStore.set('recentBoards', storedRecentBoards);
    }

    onChangeInviteModules(event: any, product: any) {
        if (event.target.checked) {
            this.inviteObject.products.push(product.module);
        } else {
            const index = this.inviteObject.products.indexOf(product.module);
            this.inviteObject.products.splice(index, 1);
        }
    }

    toggleInviteModel(state: Boolean) {
        this.inviteObject.showModal = state;
        console.log(this.inviteObject.showModal, state);
        !state && (this.inviteObject = {emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false});
    }

    onInviteSend() {
        if (!this.inviteObject.emails.length) {
            alert('Add email(s) to send invite(s).');
            return;
        }
        if (!this.inviteObject.products.length) {
            alert('Add product(s) to send invite(s).');
            return;
        }

        this.inviteObject.isLoading = true;

        const data: any = {
            emails: this.inviteObject.emails.join(','),
            products: this.inviteObject.products.join(','),
            user_kind: this.inviteObject.user_kind,
        }
        this.httpService.sendInvite(data).subscribe((res: any) => {
            // const invitations = {
            //   sent: response?.filter((invite: any) => invite.status === true).map((invite: any) => invite.email).join(', '),
            //   notSent: response?.filter((invite: any) => invite.status === true).map((invite: any) => invite.email).join(', '),
            // }
            alert(`Invite sent to user(s).`);
            this.inviteObject.isLoading = false;
            this.toggleInviteModel(false);
        });
    }

    setFavoritesIcon(item: any) {
      if(item?.entity_type === "board") {
        let icon = this.boardIcons?.find((icon: any) => {
          return icon.boardId === item.entity_id;
        })?.icon;
        return icon || 'fa-sidebar';
      }
      return 'fa-sidebar';
    }

    createMenuFolder(menuItem: any) {
      let data: any = {
        title: this.folderName,
        entity_type: 'folder',
        module: this.modules[this.selectedModuleIndex].module,
      }

      this.httpService.createMenuFolder(data).subscribe((res: any) => {
        this.modules[this.selectedModuleIndex].items.splice(this.modules[this.selectedModuleIndex].items.length-1, 0, res);
        this.folderName = '';
        this.isMoveToFolder = false;

        this.moveMenuToFolder('folder', menuItem, res);
      });
    }

    moveMenuToFolder(type: string, menuItem: any, folder: any) {
      const data: any = {};

      if(type === 'mod') {
        data.module = folder.module;
      } else if(type === 'folder') {
        data.parent_id = folder.id;
      }

      this.httpService.moveMenuToFolder(menuItem.id, data).subscribe((res: any) => {
        if(type === 'mod') {
          if(menuItem.parent_id == '0') {
            this.modules[this.selectedModuleIndex].items = this.modules[this.selectedModuleIndex]?.items?.filter((item: any) => { return item.id !== menuItem.id });
            this.menuItems = this.modules[this.selectedModuleIndex].items;
          }

          if(Number(menuItem.parent_id) > 0) {
            this.modules[this.selectedModuleIndex]?.items?.forEach((item: any) => {
              if(item.id === menuItem.parent_id) {
                item.submenus = item.submenus.filter((menu: any) => { return menu.parent_id !== menuItem.parent_id });
              }
            });
          }

          this.modules.forEach((module: any) => {
            if(folder.module === module.module) {
              res.parent_id = '0';
              module.items.splice(module.items.length-1, 0, res);
            }
          });

        } else if(type === 'folder') {
          if(menuItem.parent_id == '0') {
            this.modules[this.selectedModuleIndex].items = this.modules[this.selectedModuleIndex]?.items?.filter((item: any) => { return item.id !== menuItem.id });
            this.menuItems = this.modules[this.selectedModuleIndex].items;
          }

          this.modules[this.selectedModuleIndex]?.items?.forEach((item: any) => {
            if(Number(menuItem.parent_id) > 0) {
              if(item.id === menuItem.parent_id) {
                item.submenus = item.submenus.filter((menu: any) => { return menu.parent_id !== menuItem.parent_id });
              }
            }
            if(item.id === res.parent_id) {
              !item.hasOwnProperty('submenus') && (item.submenus = []);
              item.submenus.push(res);
            }
          });

        }
        this.menuItems = this.modules[this.selectedModuleIndex].items;
        this.localStore.set('menuItems', this.modules);
      });
    }

    /**
     * Navigate in new tab
     */
    openInNewTab(item: any) {
        const win = window.open(this.siteUrl + item.link, '_blank');
        win?.focus();
    }

    renameMenuItem(item: any, index = -1, subIndex = -1) {
        if (subIndex > -1) {
            this.menuItems[index].submenus[subIndex].edit = true;
        } else {
            this.menuItems[index].edit = true;
        }
    }

    updateRenameMenuItem(item: any, index = -1, subIndex = -1) {
        if (subIndex > -1) {
            this.menuItems[index].submenus[subIndex].edit = false;
        } else {
            this.menuItems[index].edit = false;
        }

        this.httpService.updateMenuTitle(item.id, item.title.trim()).subscribe((res: any) => {
            // Update menu items in cache
            this.modules[this.selectedModuleIndex].items = this.menuItems
            this.localStore.set('menuItems', this.modules);
        });
    }

    archiveMenuItem(item: any, index = -1, subIndex = -1) {
        if (!confirm(`Are you sure you want to ${item.title} this board?`)) {
            return;
        }

        // Use try catch to avoid error when item.link is board ID is not available
        try {
            // item.link = boards/54/main, get 54
            const boardId = item.link.split('/')[1];

            if (subIndex > -1) {
                this.menuItems[index].submenus.splice(subIndex, 1);
            } else {
                this.menuItems.splice(index, 1);
            }

            this.modules[this.selectedModuleIndex].items = this.menuItems;
            this.localStore.set('menuItems', this.modules);

            const data = {
                action: 'archive',
                id: boardId,
            }

            this.httpService.postBoardsBulk(data).subscribe((res: any) => {
            });
        } catch (e) {

        }
    }

    saveBoardAsTemplate(item:any) {
        if (!confirm(`Are you sure you want to save ${item.title} as template?`)) {
            return;
        }

        try {
            // item.link = boards/54/main, get 54
            const boardId = item.link.split('/')[1];

            const data = {
                action: 'save-as-template',
                id: boardId,
            }

            this.httpService.postBoardsBulk(data).subscribe((res: any) => {
                // Reload board data again.
                this.cache.reCacheBoardData(boardId);
            });
        } catch (e) {

        }
    }

    onClickfavoriteItem(item: any) {
      this.router.navigate([this.siteUrl + item?.url]);
    }

    onImportDataBoardSelect(board: any) {
      if(board?.id) {
        this.selectBoardForImportData = false;
        this.router.navigate([`boards/${board?.id}/main`], {queryParams: {import: 'leads'}});
      }
    }

    onClickEmailSettings() {
      this.router.navigate(['get-started'], {queryParams: {tab: 'connect-email'}});
    }

    closeNotificationBar() {
        this.hideNotiBar = 1;
        this.localStore.set('hideNotiBar', 1);
    }

    /**
     * Subscribe to push notifications
     */
    subscribePushNotifications() {
        this.oneSignal.setSubscription(true).then(() => {
            this.isPushEnabled = true;
        });
    }
}
