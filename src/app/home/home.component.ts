import {Component, OnInit} from '@angular/core';
import {AgendaService, DayService, EventSettingsModel, MonthService, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import {HttpService} from '../http.service';
import {LocalService} from '../local.service';
import {Event, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {ModuleItemsService} from '../module-items.service';
import {CacheService} from '../cache.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import {lastValueFrom} from 'rxjs';
import {AuthService} from "../auth.service";
import {FavoritesService} from "../favorites.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    addGuest = false;
    isNewShowHelp = false;
    entriesNumber = 5;
    inboxEntriesLength = 5;
    topDealsEntriesLength = 5;
    recentBoardsLength = 5;
    entriesShowMoreText = 'Show More';
    public ScheduleData: object[] = [{
        Id: 1,
        Subject: 'Meeting',
        StartTime: new Date(2022, 11, 25, 10, 0),
        EndTime: new Date(2022, 11, 25, 12, 30)
    }];
    public eventSettings: EventSettingsModel = {
        dataSource: this.ScheduleData
    }
    public selectedDate: Date = new Date(2018, 1, 15);
    public guestsArray: any = [];
    addLocation = false;
    addDescription = false;
    isAddFields = false;
    isShowGetting = false;
    isShowWebinar = false;
    customEmail = false;
    emailAccountType = 'microsoft';
    payWith = 'atmos';
    public allBoards: any;
    public currentUser = this.localStore.get('userData');
    public users = [{photo: '', display_name: ''}];
    public greetings: string = '';
    public modules: any[] = [];
    public apps: any[] = [];
    public menuItems: any[] = [];
    public selectedModuleIndex = 0;
    public topDeals: any = {};
    public inbox: any[] = [];
    public isLoading = false;
    public showInviteBar = true;
    public inviteObject: any = {emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false};
    public showQuickSearchModal = false;
    public quickSearchText: string = '';
    public quickSearchResult: any = [];
    public recentBoards: any[] = [];
    public isChartLoading = true;
    public leadsBoard: any[] = [];
    public opportunityBoard: any[] = [];
    public palette: string[] = [];
    public titleStyle: Object = {};

    // trial remaining time properties
    public trialTotalSeconds: any = 0;
    public trialRemainingDays: any = 0;
    public trialRemainingHours: any = 0;
    public trialRemainingMinutes: any = 0;
    public trialRemainingSeconds: any = 0;

    public leadsDealChart: any = {
        title: 'New Leads / Closed Deals',
        tooltip: {},
        primaryXAxis: {},
        primaryYAxis: {},
        legendSettings: {},
        type: '',
        name: '',
        xName: '',
        yName: '',
        chartData: [],
        newLeads: {
            name: '',
        },
        closedDeals: {
            name: '',
        },
    }

    public contactSales: any = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        job_title: '',
        company_size: '',
        how_can_we_help: '',
    }
    public isContactSalesFormValid = false;
    private myObserver: any;

    showGetting(event: any) {
        (event == 'show' ? this.isShowGetting = true : this.isShowGetting = false);
    }

    showWebinar(event: any) {
        (event == 'show' ? this.isShowWebinar = true : this.isShowWebinar = false);
    }


    constructor(
        private httpService: HttpService,
        private localStore: LocalService,
        private router: Router,
        private moduleService: ModuleItemsService,
        public cache: CacheService,
        private auth: AuthService,
        public favorites: FavoritesService
    ) {
    }

    ngOnInit(): void {
        const onboarding = this.localStore.get('onboarding');
        if (onboarding) {
            this.router.navigate(['/get-started']);
            return;
        }

        this.getData();
        this.setData();
    }

    emailConnect(type: string = '') {
        (type == 'custom' ? this.customEmail = true : this.customEmail = false);
        this.emailAccountType = type;
    }

    paymentMethod(type: string = '') {
        this.payWith = type;
    }

    showAllEntries() {
        (this.entriesNumber == 5 ? this.entriesNumber = 10 : this.entriesNumber = 5);
        (this.entriesShowMoreText == 'Show More' ? this.entriesShowMoreText = 'Show Less' : this.entriesShowMoreText = 'Show More');
    }

    showMore() {
        this.recentBoardsLength = this.recentBoardsLength === 5 ? 10 : 5;
    }

    getData() {
        this.getHomeWidgets().then((res: any) => {
            // Load these data after getting home widgets data

        });
        setTimeout(() => {
            this.getUsers();
            this.getAllBoards();
            this.getMenuItems();
            this.getRecentBoards();
        }, 1000);
    }

    setData() {
        this.setSelectedModule();
        this.loadApps();
        this.setGreetings();
        this.setLeadsDealChart();
        this.setTrialInfo();

        // set counter interval
        this.trialRemainingCounter();

        // set favorites list
        this.favorites.setFavoritesList();
    }

    setLeadsDealChart() {
        this.leadsDealChart.primaryXAxis = {title: '', titleStyle: {color: 'var(--at-font-color)'}, valueType: 'Category', labelIntersectAction: 'Rotate45', labelStyle: {color: 'var(--at-font-color)'}};
        this.leadsDealChart.primaryYAxis = {title: '', titleStyle: {color: 'var(--at-font-color)'}, labelStyle: {color: 'var(--at-font-color)'}};
        this.leadsDealChart.tooltip = {enable: true}
        this.leadsDealChart.legendSettings = {visible: true, position: "Bottom", textStyle: {color: 'var(--at-font-color)'}};
        this.leadsDealChart.type = "Column"
        this.leadsDealChart.xName = 'date';
        this.leadsDealChart.newLeads.name = 'New Leads';
        this.leadsDealChart.closedDeals.name = 'Closed Deals';
        this.palette = ["purple", "green"];

    }

    async getHomeWidgets() {
        this.isLoading = true;
        const local = this.localStore.get('homeWidgetsData');
        if (local) {
            // Process home page data
            this.handleHomePageData(local);
        } else {
            this.httpService.getHomeWidgets().subscribe((data: any) => {
                // Store boards cache for activities/leads/opportunities
                this.cache.setBoardCache(data.activities.id, data.activities);
                this.cache.setBoardCache(data.leads.id, data.leads);
                this.cache.setBoardCache(data.opportunities.id, data.opportunities);
                this.localStore.set('homeWidgetsData', data);

                // Process home page data
                this.handleHomePageData(data);
            });
        }
    }

    /**
     * Process home page data
     *
     * @param homeWidgetsData
     */
    handleHomePageData(homeWidgetsData: any) {
        this.inbox = homeWidgetsData.unread_inbox;
        this.leadsBoard = homeWidgetsData.leads;
        this.opportunityBoard = homeWidgetsData.opportunities;
        this.topDeals = homeWidgetsData.top_deals;

        this.topDeals.entries.forEach((entry: any) => {
            const stageCol = this.topDeals.columns?.find((col: any) => col.key === 'stage');
            const stage = stageCol.statuses?.find((status: any) => status.id === entry.stage);
            entry.color = stage?.color || '#EDF1F7';
            entry.stageName = stage?.name || '';
        });

        this.isLoading = false;
        this.getBoardDataForChart();
    }

    getRecentBoards() {
        this.recentBoards = this.localStore.get('recentBoards') || [];
        // this.recentBoards.splice(4);
    }

    showNewHelp(event: any) {
        (event == 'show' ? this.isNewShowHelp = true : this.isNewShowHelp = false);
    }

    setGreetings() {
        var hour = new Date().getHours();
        this.greetings = "Good " + ((hour >= 6 && hour < 12) && "Morning" || hour < 18 && "Afternoon" || hour < 21 && "Evening" || "night");
    }

    getBoardDataForChart() {
        this.isChartLoading = true;
        const boardIDs = [1, 2];

        const result1 = this.processEntries(boardIDs[0]);
        const result2 = this.processEntries(boardIDs[1]);

        const processedChartData1 = Object.entries(result1).map((ele: any) => {
            return {date: ele[0], newLeads: ele[1].length}
        });
        const processedChartData2 = Object.entries(result2).map((ele: any) => {
            return {date: ele[0], closedDeals: ele[1].length}
        });

        const processedChartData3 = [...processedChartData1, ...processedChartData2];

        const merged: any = [];

        processedChartData3.forEach((item) => {
            if (item.date !== "undefined" && item.date) {
                const date = new Date(item.date);
                try {
                    if (moment(date.toISOString()).isSame(new Date(), 'month')) {
                        let existing = merged.filter((v: any, i: any) => {
                            return v.date == item.date;
                        });
                        if (existing.length) {
                            let existingIndex = merged.indexOf(existing[0]);
                            merged[existingIndex] = {...merged[existingIndex], ...item};
                        } else {
                            merged.push(item);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });

        this.addMissingMonthDates(processedChartData3);

        processedChartData3.sort((a: any, b: any) => {
            const aDate: any = new Date(a.date);
            const bDate: any = new Date(b.date);
            return aDate - bDate;
        }).forEach((data: any) => {
            try {
                const date = new Date(data.date);
                data.date = moment(date.toISOString()).format('MMM Do')
            } catch (e) {
            }
        });

        this.leadsDealChart.chartData = processedChartData3;
        this.isChartLoading = false;
    }

    addMissingMonthDates(array: any) {
        const dates = array.map((ele: any) => ele.date);

        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');
        const now = startOfMonth.clone();

        while (now.isSameOrBefore(endOfMonth)) {
            let date = now.format('MMM DD, YYYY');
            if (!dates.includes(date)) {
                array.push({date});
            }
            now.add(1, 'days');
        }
    }

    processEntries(boardId: number) {
        let boardData: any;

        if (boardId === 1) {
            boardData = this.leadsBoard;
        } else if (boardId === 2) {
            boardData = this.opportunityBoard;
        }

        let entries: any[] = [];
        if (boardId === 1) {
            boardData?.groups?.forEach((group: any) => {
                group.name !== 'Abandoned' && (entries = [...entries, ...group.entries]);
            });
        } else if (boardId === 2) {
            boardData?.groups?.forEach((group: any) => {
                group.name === 'Won' && (entries = [...entries, ...group.entries]);
            });
        }

        let processedEntries: any[] = [];

        if (boardId === 1) {
            processedEntries = entries?.map((entry: any) => {
              let d = new Date(entry.created?.date);
              let isValidDate = !isNaN(d.getTime());
              let date = isValidDate ? new Date(entry.created?.date) : new Date();
              return {id: entry.id, name: entry.item, created_at: date}
            });
        } else if (boardId === 2) {
            processedEntries = entries?.map((entry: any) => {
              let d = new Date(entry.created?.date);
              let isValidDate = !isNaN(d.getTime());
              let date = isValidDate ? new Date(entry.close_date) : new Date();
              return {id: entry.id, name: entry.item, created_at: date}
            });
        }

        const result = _(processedEntries)
            .groupBy(v => {
                try {
                    const date = new Date(v.created_at);
                    return moment(date.toISOString()).format('MMM DD, YYYY');
                } catch (e) {
                    return false;
                }
            })
            .mapValues(v => _.map(v, 'name'))
            .value();

        return result;
    }

    getBoardData(boardId: number) {
        const localBoard = this.cache.getBoardCache(boardId);

        if (localBoard) {
            return localBoard;
        } else {
            return lastValueFrom(this.httpService.getSingleBoard(boardId));
        }
    }

    getUsers() {
        const users = this.cache.getUsersCache();
        if (users) {
            this.users = users;
        } else {
            this.httpService.getUsers().subscribe((res: any) => {
                this.cache.setUsersCache(res);
                this.users = res;
            });
        }
    }

    /**
     * Load all boards data
     */
    getAllBoards() {
        this.cache.getAllBoards().then((boards) => {
            this.allBoards = boards;
            this.quickSearchResult = boards;
        });
    }

    setSelectedModule() {
        this.selectedModuleIndex = this.moduleService.getCurrentModuleIndex();
    }

    getInboxWidgetData() {
        const local = this.localStore.get('inboxItems');
        if (local) {
            this.inbox = local;
        } else {
            this.httpService.getInboxWidgetData(10).subscribe((res: any) => {
                this.localStore.set('inboxItems', res);
                this.inbox = res;
            });
        }
    }

    getTopDeals() {
        const local = this.localStore.get('topDeals');
        if (local) {
            this.topDeals = local;
        } else {
            this.httpService.getTopDeals(10).subscribe((res: any) => {
                res.entries.forEach((entry: any) => {
                    const stageCol = res.columns?.find((col: any) => col.key === 'stage');
                    const stage = stageCol.statuses?.find((status: any) => status.id === entry.stage);
                    entry.color = stage?.color || '#EDF1F7';
                    entry.stageName = stage?.name || '';
                });
                this.topDeals = res;
                this.localStore.set('topDeals', res);
            });
        }
    }

    getMenuItems(switchModule = false) {
        const local = this.localStore.get('menuItems');

        if (local) {
            this.menuItems = local[this.selectedModuleIndex].items;
            this.modules = local;
        } else {
            this.httpService.getMenuItems().subscribe((data: any) => {
                this.menuItems = data[0].items;
                this.modules = data;
            });
        }

        // load first menu item
        if (switchModule) {
            this.loadFirstItem();
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

    /**
     * Load first item in the menu
     */
    loadFirstItem() {
        if (this.menuItems.length > 0 && !['', '#'].includes(this.menuItems[0].link)) {
            this.router.navigate([this.menuItems[0].link]);
        }
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

        window.open(url, "_blank") || window.location.replace(url);
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

    toggleQuickSearchModal(state: boolean) {
        this.showQuickSearchModal = state;
    }

    onQuickSearch(board: any) {
        this.router.navigate([`/boards/${board.id}`]);
    }

    onQuickSearchTextChange() {
        if (this.quickSearchText) {
            this.quickSearchResult = this.allBoards.filter((board: any) => board.name.toLowerCase().includes(this.quickSearchText.toLowerCase()));
        } else {
            this.quickSearchResult = this.allBoards.slice();
        }
    }

    onRecentBoardClick(board: any) {
        this.router.navigate([board.path]);
    }

    getWordsInitials(string: string) {
        if (string === undefined) {
            return '';
        }

        const matches = string.match(/\b(\w)/g) || [];
        return matches.join('');
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

    setTrialInfo() {

        // get expiration date and time from userData
        const userData = this.auth.getUserData();

        const expirationDate = userData?.trial_dates?.trial_end_date;

        // check if trial date not found in the userData
        if (expirationDate == undefined || !expirationDate) {
            return;
        }

        // convert trial date to timestamp
        const expirationTime = (new Date(expirationDate)).getTime();

        // get current timestamp to compare with expiration timestamp
        const currentTime = (new Date()).getTime();

        // check if trial time ended
        if ((expirationTime - currentTime) < 1000) {
            this.trialTotalSeconds = 1;
            return;
        }

        // set remaining seconds
        this.trialTotalSeconds = (expirationTime - currentTime) / 1000;

        // set number of remaining days
        const days = this.trialTotalSeconds / (24 * 3600);
        this.trialRemainingDays = Math.floor(days);

        // set number of remaining hours
        const hoursSeconds = this.trialTotalSeconds % (24 * 3600);
        const hours = hoursSeconds / 3600;
        this.trialRemainingHours = Math.floor(hours);

        // set number of remaining minutes
        const minutesSeconds = hoursSeconds % 3600;
        const minutes = minutesSeconds / 60;
        this.trialRemainingMinutes = Math.floor(minutes);

        // set number of remaining seconds
        this.trialRemainingSeconds = minutesSeconds % 60;

    }

    // set interval to update the expiration time
    trialRemainingCounter() {
        setInterval(() => {
            this.trialTotalSeconds -= 60;
            this.setTrialInfo();
        }, 60000);
    }
}
