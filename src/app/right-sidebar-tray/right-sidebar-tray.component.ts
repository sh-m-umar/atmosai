import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import {BoardsComponent} from '../boards/boards.component';
import {CellClickedEvent, ColDef, GridApi, GridReadyEvent, IsRowSelectable, RowNode} from 'ag-grid-community';
import {LeadsCommonRendererComponent} from "../leads-common-renderer/leads-common-renderer.component";
import {ResizeEvent} from 'angular-resizable-element';
import {HttpService} from "../http.service";
import {CacheService} from "../cache.service";
import {LocalService} from "../local.service";
import {EditorModule} from '@tinymce/tinymce-angular';
import {content, IconCategory} from "@igniteui/material-icons-extended";
import values = IconCategory.values;
import * as moment from 'moment';
import {BoardService} from "../board.service";
import _ from 'lodash';
import * as ClassicEditor from 'src/app/right-sidebar-tray/ckeditor-build';
import { ActivatedRoute, Router } from '@angular/router';
import { TIME_ZONES } from '../constants/time-zones.const';

@Component({
    selector: 'app-right-sidebar-tray',
    templateUrl: './right-sidebar-tray.component.html',
    styleUrls: ['./right-sidebar-tray.component.scss']
})
export class RightSidebarTrayComponent implements OnInit {
    @Input() data: any;
    @Input() tabs: any;
    @Input() cols: any;
    @Input() type: any;
    @Input() tab: any;
    @Input() boardTypeForInvoiceForm = 'estimate';
    @Output() selectRowOnTrayOpen: EventEmitter<any> = new EventEmitter();
    @Output() archiveRows: EventEmitter<any> = new EventEmitter();
    @Output() deleteRows: EventEmitter<any> = new EventEmitter();
    @Output() exportRows: EventEmitter<any> = new EventEmitter();
    @ViewChild('customisedAddress') customisedAddress?: ElementRef;

    public ClassicEditor: any = ClassicEditor;
    isRealEstate = false;
    customizedAddress = false;
    copied = false;
    expandAll = false;
    customizedCopied = false;
    switchTOvideo = false;
    paymentMethod = true;
    public emailSettingsLoaded = true;
    public selectedSubBoard = 'activity';
    public subTabRight = 'to-customer';
    public splitRightSize = 30;
    public splitLeftSize = 70;
    public alreadySetSubEdit = '';
    public calendarCurrentView = 'Month';
    public timeZones = TIME_ZONES;
    guestsEmails: any = [];
    headerCollapsed = true;
    smsToggle = false;
    noteToggle = false;
    isNoteEdit = false;
    headerCollapsedBtn = 'up';
    finalStage: any = {};
    billingMap = false;
    shippingMap = false;
    isBillingEdit = false;
    isShippingEdit = false;
    isBankingEdit = false;
    isAdditionalEdit = false;
    act1 = true;
    act2 = true;
    sidbarCollapsed = false;
    public gridApi: any;
    public isHeaderEdit = false;
    public siEmailBody = false;
    public emailReplyIndex = -1;
    public showLoadSetting = false;
    public showLoadSettingBtnTxt = 'Reload connected accounts';
    public boardsComponent: any;
    public btnTxt = 'Submit';
    public leadsCommonRendererComponent: any;
    public newActivityType: string = 'email';
    public activeActivityTab: string = 'email';
    public smsTo: string = '';
    public smsContent: string = '';
    public anglePos: string = 'fa-angle-down';
    public acc = false;
    emailCollapsed1 = true;
    emailCollapsed2 = false;
    emailCollapsed3 = false;
    emailCollapsed4 = false;
    public bcc = false;
    public isEmail = false;
    public showSettingsType = '';
    public emailSettings: any = false;
    public tabLoaded = false;
    public activities: any = <any>[];
    public users: any = [];
    public showWidgets: string = 'crm';
    public fieldTypes = [
        {value: 'text', name: 'Text'},
        {value: 'date', name: 'Date'},
        {value: 'dateTime', name: 'Date & Time'},
        {value: 'number', name: 'Number'},
        {value: 'textarea', name: 'Textarea'},
        {value: 'choicesSingle', name: 'Choices (Single)'},
        {value: 'choicesMultiple', name: 'Choices (Multiple)'},
        {value: 'contactSingle', name: 'Contact (Single)'},
        {value: 'contactMultiple', name: 'Contact (Multiple)'},
        {value: 'userSingle', name: 'User (single)'},
        {value: 'userMultiple', name: 'User (Multiple)'},
        {value: 'hidden', name: 'Hidden (for api use only)'},
    ];
    public shortcode = '';
    public shortcodes = [
        'first_name',
        'full_name',
        'company_name',
        'phone_number',
        'email',
        'company_email',
        'company_url',
        'user_email',
        'user_full_name',
        'user_first_name',
        'user_company_name',
        'user_company_url',
    ];
    public updates: any = [];
    public emailSettingsEditorType = {one: 'simple', two: 'simple'};
    public touchpointModel: any = {};
    public singleForm: any = false;
    public allForms: any = false;
    public startDate = new Date();
    public emailData = {
        id: 0,
        activityId: 0,
        fromConfig: '',
        to: '',
        sender: '',
        toCc: '',
        toBcc: '',
        subject: '',
        templateType: '',
        template: '',
        content: '',
        file: '',
        ifNoReply: '',
        noReplyDate: '',
        remindMeFollowup: '',
        reminder: 0,
        reminderDate: '',
        reminderType: '',
        sequence: '',
        schedule: '',
        scheduleTime: '',
        scheduleTimezone: '',
        sendLater: false
    }

    public updatesData = {
        content: '',
        updateBy: ''
    }

    public defaultEmailData = {...this.emailData};
    public defaultUpdatesData = {...this.updatesData};

    public note = '';

    public defaultColDef = {
        resizable: true,
    };
    public defaultCols: ColDef[] = [
        {field: 'name'},
        {field: 'title'},
        {field: 'phone'},
        {field: 'email'},
        {field: 'industry'},
        {field: 'comment'},
    ];

    public rowData = [
        {name: 'Michael Phelps', title: 'abc', phone: '12342533543', email: 'mail@new.com', industry: 'Tech', comment: 'This is a comment'},
    ];
    // public trayWidth = 1100;
    // public trayMaxWidth = 1476;
    // public trayMinWidth = 500;
    public subscribers: any = [];

    // this property will be used to check if user is already in the subscribers
    public subscribersIds: any = [];

    public shardTouchpointFields: any[] = [
        {name: 'Tawassual Gohar', type: 'Number'},
        {name: 'Umar Draz', type: 'Text'},
        {name: 'Tim Moses', type: 'Number'},
    ];
    public editor: any = '';
    public html = '';
    public updateEditor = false;
    public isReply = false;
    public editSubBoardEntry: any = null;
    public connectedContacts: any = [];
    public formData: any = {};
    public addTask = false;
    public editTask = false;
    public isSearch = false;
    public addOpportunity = false;
    public addContact = false;
    public contactDetail = false;
    public isEditTouchpoint = false;
    public showLess = true;
    public overviewTouchpointEdit = false;
    public overviewItemExpanded = false;
    public currentTouchpoint: any;
    public touchpointActivityModel: any = {};
    public templateLoadingTxt = '';
    public subBoards: any[] = [];
    public updateText = '';
    public editUpdateId = 0;
    public emailSequence = false;
    public user = this.localStore.get('userData');
    guests: string[] = ['Tim (tim@mail.com)', 'Umar (umar.mail.com)', 'Tawassul (tge@mail.com)'];
    addGuest = false;
    addLocation = false;
    addDescription = false;
    isAddFields = false;
    filteredOptions: any = [];
    filteredPeople: any = [];
    public guestsArray: any = [];
    public entryHeader: any = [];
    public isRefreshing = false;

    public leadData: any = {};
    public tempData: any = {};

    public clickMore: any = {};
    public clickPreview: any = {};
    public clickImage: any = {};
    public clickMedia: any = {};

    public loadedEditor = true;

    public creatingTask: any = false;

    public viewFullText: number = 0;
    private editingNote: any = {};
    public editNote: string = '';
    public filterUser: string = '';
    public isAddingSubscriber: boolean = false;
    public subscriberOptions: any = [];
    public loadingSubscribers: boolean = true;

    public ckEditor: any = '';

    public activityLogUsers: any = [];
    public filteredActivityLogs: any = [];
    public activityLogUserFilter: any = {};

    public connectedEmails: any;
    isMobile = false;
    public emailPreference: any = {};
    public emailSignatureAttached: boolean = false;
    deviceService: any;

    constructor(public boardService: BoardService,
      boardsComponent: BoardsComponent,
      leadsCommonRendererComponent: LeadsCommonRendererComponent,
      private httpService: HttpService,
      private cache: CacheService,
      private localStore: LocalService,
      public router: Router,
      public route: ActivatedRoute,
      ) {
        this.boardsComponent = boardsComponent;
        this.leadsCommonRendererComponent = leadsCommonRendererComponent;
        this.route.params.subscribe((params: any) => {
          if(params && params['trayTab']) {
            setTimeout(() => {
              this.switchTab('updates');
            }, 100);
          }
        });
    }

    //set focus on customised address field when click for edit
    customisedAddressEdit(){
        this.customisedAddress?.nativeElement.focus();
    }


    /* new sidebar tray header collapse toggle */
    headerCollapseToggle() {
        this.headerCollapsed = !this.headerCollapsed;
        (this.headerCollapsed ? this.headerCollapsedBtn = 'up' : this.headerCollapsedBtn = 'down');
    }


    /**
     * Select shortcode from dropdown and
     * Copy to clipboard
     */
    selectShortcode() {
        if (this.shortcode === '') {
            return;
        }

        // copy string to clipboard
        navigator.clipboard.writeText(this.shortcode).then(() => {
            this.shortcode = '';
            alert('Copied to clipboard');
        });
    }

    /**
     * Process shortcodes in content
     * @param content
     */
    processShortcodes(content = '') {
        this.shortcodes.forEach((shortcode) => {
            content = content.replace(`[${shortcode}]`, this.getShortcodeValue(shortcode));
        });

        return content;
    }

    /**
     * Pick shortcode value and return
     *
     * @param shortcode
     */
    getShortcodeValue(shortcode = '') {
        let value = '';

        switch (shortcode) {
            case 'first_name':
                return this.data.row?.item.split(' ')[0];
            case 'full_name':
                return this.data.row?.item;
            case 'company_name':
                return this.data.row?.company;
            case 'phone_number':
                return this.data.row?.phone;
            case 'email':
                return this.data.row?.email;
            case 'company_email':
                return this.data.row?.company_email;
            case 'company_url':
                return this.data.row?.company_url;
            case 'user_email':
                return this.user?.user_email;
            case 'user_full_name':
                return this.user?.full_name;
            case 'user_first_name':
                return this.user?.fname;
            case 'user_company_name':
                return this.user?.company;
            case 'user_company_url':
                return this.user?.company_url;
        }

        return value;
    }

    /**
     * Get email Ids list from boards for dropdown suggestions
     */
    buildGuestEmailsList() {
        this.guestsEmails = [];

        this.cache.getAllBoards().then((boards) => {
            // Get board ID for leads, contacts and accounts
            const leadsBoardId = boards.find((board: any) => board.type === 'lead')?.id;
            const contactsBoardId = boards.find((board: any) => board.type === 'contact')?.id;
            const accountsBoardId = boards.find((board: any) => board.type === 'account')?.id;

            const boardIds = [leadsBoardId, contactsBoardId, accountsBoardId]; // leads, contacts, accounts

            for (let i = 0; i < boardIds.length; i++) {
                if (boardIds[i] === undefined) {
                    continue;
                }

                const localBoard = this.localStore.get('board_' + boardIds[i]);

                if (localBoard) {
                    this.addGuestEmailsFromBoard(localBoard);
                } else {
                    this.httpService.getSingleBoard(boardIds[i]).subscribe((data: any) => {
                        this.localStore.set('board_' + boardIds[i], data);
                        this.addGuestEmailsFromBoard(data);
                    });
                }
            }
        });
    }

    /**
     * Open email form box and add email address in to input field
     * @param emailAddress
     */
    openEmailWithSender(emailAddress: '') {
        // open overview tab
        this.tab = 'overview';

        // open email form box
        this.openNewActivity('email');
        // Add email address in to input field
        this.emailData.to = emailAddress;
    }

    /**
     * Open SMS form box and add phone number in to input field
     * @param phoneNumber
     */
    openSMSWithSender(phoneNumber: '') {
        // open overview tab
        this.tab = 'overview';

        // open email form box
        this.openNewActivity('sms');

        // Add email address in to input field
        this.smsTo = phoneNumber;
    }

    /**
     * Make list of emails from board and attach suggested list
     * @param board
     */
    addGuestEmailsFromBoard(board: any) {
        for (let i = 0; i < board?.groups?.length; i++) {
            for (let j = 0; j < board.groups[i].entries.length; j++) {
                if (board.groups[i].entries[j].email !== undefined && board.groups[i].entries[j].email !== '') {
                    this.guestsEmails.push(board.groups[i].entries[j].email.split(',')[0]);
                }
            }
        }
    }

    /**
     * Switch popup tray tabs
     *
     * @param tab
     * @param title
     */
    switchTab(tab: string, title: string = '') {
        this.tab = tab;
        this.tabLoaded = false;
        this.newActivityType = 'email';

        this.adjustSplitSize();

        switch (tab) {
            case 'touchpoints':
                this.getAllForms();
                break;
            case 'activity-log':
                this.getActivityLog();
                break;
            case 'quotes-invoices':
                this.getProducts();
                this.getServices();
                break;
        }
    }

    adjustSplitSize() {
        this.splitRightSize = this.tab === 'notifications' ? 36 : 30;
        this.splitLeftSize = 100 - this.splitRightSize;
    }

    /**
     * Get all activity log
     */
    getActivityLog() {
        if (this.data.activityLog === undefined) {
            this.data.activityLog = [];
            this.loadActivityLog();
        } else {
            this.tabLoaded = true;
        }
    }

    /**
     * Get products row after finding the product board
     */
    async getProducts() {
        const boards = await this.cache.getAllBoards();
        const productBoardId = boards.find((board: any) => board.type === 'product')?.id;
        if(!_.isUndefined(productBoardId)) {
            this.boardService.getBoardRowsByBoardId(productBoardId)
                .then(products => {
                    this.data.products = products;
                })
        }
    }

    /**
     * Get services row after finding the product board
     */
    async getServices() {
        const boards = await this.cache.getAllBoards();
        const serviceBoardId = boards.find((board: any) => board.type === 'service')?.id;
        if(!_.isUndefined(serviceBoardId)) {
            this.boardService.getBoardRowsByBoardId(serviceBoardId)
                .then(services => {
                    this.data.services = services;
                })
        }
    }

    onEmailActionChange(event:any){
        if(event.target.value == "email_sequence"){
            this.emailSequence = true;
        }else{
            this.emailSequence = false;
        }
    }

    /**
     * Get email settings
     */
    getEmailSettings(forceLoad = false) {
        this.emailSettings = false;

        // Using try, sometimes it was showing unnecessary errors
        try {
            const localSettings = this.localStore.get('emailSettings');
            if (localSettings && !forceLoad) {
                this.emailSettings = localSettings;
                this.attachEmailSignature();
                this.showLoadSetting = false;
                this.showLoadSettingBtnTxt = 'Reload connected accounts';
            } else {
                this.httpService.getCrmSettings().subscribe((res: any) => {
                    this.emailSettings = res;
                    this.localStore.set('emailSettings', res);
                    this.attachEmailSignature();
                    this.showLoadSetting = false;
                    this.showLoadSettingBtnTxt = 'Reload connected accounts';
                });
            }
        } catch (e) {
        }

        this.emailSettingsLoaded = true;

        return true;
    }

    /**
     * Attach email signature
     */
    attachEmailSignature() {
      if( this.emailSettings.email_signature && !this.emailSignatureAttached ) {
        this.emailSignatureAttached = true;
        this.emailData.content += '<br /><div style="margin-top:50px;">' + this.emailSettings.email_signature + '</div>';
      }
    }

    /**
     * Delete connected account
     *
     * @param account
     */
    deleteConnectedAccount(account: string = '') {
        // Delete array item by search
        this.emailSettings.connected_accounts = this.emailSettings.connected_accounts.filter((item: any) => {
            return item.type !== account;
        });

        this.updateEmailSettings('delete_settings', account + '_account_connection');
    }

    /**
     * Update email settings
     *
     * @param type
     */
    updateEmailSettings(type = '', args: any = null) {
        if (type === '') {
            return;
        }

        let data = {};

        switch (type) {
            case 'delete_settings':
                data = {action: 'delete_settings', key: args};
                break;
            case 'signature':
                data = {action: 'update_email_signature', user_signature: this.emailSettings.email_signature, global_signature: this.emailSettings.global_email_signature};
                break;
            default:
                data = {action: 'update_usermeta', key: type, content: this.emailSettings[type]};
        }

        this.httpService.updateCrmSettings(data).subscribe((res: any) => {
            if (res.data !== undefined) {
                this.emailSettings = res.data;
                this.localStore.set('emailSettings', this.emailSettings);
            }
        });
    }

    /**
     * Select email template to load in editor
     */
    selectEmailTemplate() {
        this.templateLoadingTxt = 'Loading template...';
        const local = this.localStore.get(`emailTemplate_${this.emailData.templateType}_${this.emailData.template}`);

        // Check if already available in local storage
        if (local) {
            this.emailData.subject = local.subject;
            this.emailData.content = local.body;
            this.attachEmailSignature();
            this.templateLoadingTxt = '';
        } else {
            // Get it from server
            const args = `email_template&type=${this.emailData.templateType}&id=${this.emailData.template}`;
            this.httpService.getCrmSettings(args).subscribe((res: any) => {
                this.emailData.subject = res.subject;
                this.emailData.content = res.body;
                this.attachEmailSignature();
                this.localStore.set(`emailTemplate_${this.emailData.templateType}_${this.emailData.template}`, res);
                this.templateLoadingTxt = '';
            });
        }
    }

    getEmailTemplateList(templates = []) {
        if (templates === undefined || this.emailData.templateType === undefined || this.emailData.templateType === '') {
            return [];
        }

        // filter email templates by type
        return <any>templates.filter((template: any) => {
            return template.type === this.emailData.templateType;
        });
    }

    /**
     * Load fresh activities
     */
    loadActivityLog(loader = false) {
        if (loader) {
            this.tabLoaded = false;
        }

        this.httpService.getEntryActivityLogs(this.data.id).subscribe((response: any) => {
            this.data.activityLog = response;
            this.filteredActivityLogs = response || [];
            this.localStore.set('entry_' + this.data.id, this.data);
            this.tabLoaded = true;
            this.setActivityLogs();
        });
    }

    /**
     * Get field name by value
     *
     * @param value
     */
    getFieldNameByValue(value: string) {
        // find the field name by value
        const field = this.fieldTypes.find((item: any) => item.value == value);
        return field !== undefined ? field.name : '';
    }

    /**
     * Build sub board array
     */
    getSubBoardsArray() {
        this.subBoards = [];

        // Re-arrange the array
        if (this.data.sub_boards !== undefined) {
            // Do not have activity in activity board
            if (this.data.board.type !== 'activity') {
                this.subBoards.push(this.data.sub_boards[2]); // activities/tasks
            }

            // Do not have opportunities in opportunities board
            if (this.data.board.type !== 'opportunity') {
                this.subBoards.push(this.data.sub_boards[0]); // opportunities
            }

            // Do not have contacts in contact board
            if (this.data.board.type !== 'contact') {
                this.subBoards.push(this.data.sub_boards[1]); // contacts
            }
        }

        // Keep open new form if no data in it
        // this.alreadySetSubEdit = '';
        // if (this.data.sub_boards !== undefined ) {
            switch (this.selectedSubBoard) {
                case 'activity':
                    if (this.data.sub_boards != undefined && this.data.sub_boards[2].entries.length === 0 && this.alreadySetSubEdit !== this.selectedSubBoard) {
                        this.editSubBoardEntryItem(true, this.selectedSubBoard);
                        this.alreadySetSubEdit = this.selectedSubBoard;
                    }
                    break;
                case 'opportunity':
                    if (this.data.sub_boards !== undefined && this.data.sub_boards[0].entries.length === 0 && this.alreadySetSubEdit !== this.selectedSubBoard) {
                        this.editSubBoardEntryItem(true, this.selectedSubBoard);
                        this.alreadySetSubEdit = this.selectedSubBoard;
                    }
                    break;
                case 'contact':
                    if (this.data.sub_boards[1].entries.length === 0 && this.alreadySetSubEdit !== this.selectedSubBoard) {
                        this.editSubBoardEntryItem(true, this.selectedSubBoard);
                        this.alreadySetSubEdit = this.selectedSubBoard;
                    }
                    break;
                default:
                    this.alreadySetSubEdit = '';
            }
        // }

        return this.subBoards;
    }

    editTaskFunc(event: any) {
        (event == 'show' ? this.editTask = true : this.editTask = false);
    }

    /**
     * Edit/create sub board entry
     *
     * @param show
     * @param type
     * @param entryIndex
     */
    editSubBoardEntryItem(show = true, type = 'activity', entryIndex = -1) {
        this.buildGuestEmailsList();
        if (show) {
            this.editSubBoardEntry = {item: {item:''}, type: type};

            // Set default values for the form
            switch (type) {
                case 'activity':
                    this.editSubBoardEntry.item.activity_type = '';
                    this.editSubBoardEntry.item.location = this.data?.row?.location;
                    this.editSubBoardEntry.item.video_call = '';
                    this.editSubBoardEntry.item.owner_status = '';
                    this.editSubBoardEntry.item.owner = this.user.ID;
                    this.editSubBoardEntry.item.guests = '';
                    this.editSubBoardEntry.item.deal_lead_project = this.data.title;
                    this.editSubBoardEntry.item.organization = this.data?.row?.company;
                    this.guestsArray = [];
                    break;
                case 'opportunity':
                    this.boardService.getBoardRowsByBoardId(3).then((res: any) => {
                        this.connectedContacts = res;
                        this.editSubBoardEntry.item.company = this.data?.row?.company;
                        this.editSubBoardEntry.item.owner = this.user.ID;

                        // Set lead as contact as we are going to move this lead into contacts board
                        if (this.data.board.type === 'lead') {
                            this.editSubBoardEntry.item.contacts = this.data.id;
                        }
                    });
                    break;
                case 'contact':
                        this.editSubBoardEntry.item.company = this.data?.row?.company;
                    break;
            }

            if (entryIndex >= 0) {
                const subBoard = this.data.sub_boards.find((subBoard: any) => subBoard.type === type);
                this.editSubBoardEntry.item = {...subBoard.entries[entryIndex]};
                this.guestsArray = this.processTagsReverse(this.editSubBoardEntry.item.guests);
            }

            if (type === 'opportunity' && this.editSubBoardEntry.item.confidence === undefined) {
                this.editSubBoardEntry.item.confidence = 50;
            }
        } else {
            this.editSubBoardEntry = null;
        }
    }

    buildDefaultDataActivityForm() {
        this.buildGuestEmailsList();
        if (this.formData.activity_type === undefined) {
            this.formData.activity_type = '';
            this.formData.location = '';
            this.formData.video_call = '';
            this.formData.owner_status = '';
            this.formData.owner = '';
            this.formData.guests = '';
            this.guestsArray = [];
        }
        return true;
    }

    getEntryHeaderObject(type = 'item') {
        const headerArray = this.getEntryHeaderArray();
        return headerArray.find((item: any) => item.type === type);
    }

    // Build entry header object
    getEntryHeaderArray(reversed = false) {
        if (this.data.entryHeader === undefined) {
            return [];
        }

        if (this.data.entryHeader.length > 0 && !reversed) {
            return this.data.entryHeader;
        }

        this.data.entryHeader = [];

        if (!reversed) {
            this.formData = {};
        }

        // expected field/headerName values
        const expectedFields = ['item', 'description', 'company', 'website'];

        for (let i = 0; i < this.cols.length; i++) {
            if (this.cols[i].field !== undefined && this.cols[i].headerName !== undefined && (expectedFields.includes(this.cols[i].field.trim().toLowerCase()) || expectedFields.includes(this.cols[i].headerName.trim().toLowerCase()))) {
                let type = '';

                for (let j = 0; j < expectedFields.length; j++) {
                    if (expectedFields[j] === this.cols[i].field.trim().toLowerCase() || expectedFields[j] === this.cols[i].headerName.trim().toLowerCase()) {
                        type = expectedFields[j];
                        break;
                    }
                }

                if (reversed) {
                    if (this.formData === undefined) {
                        continue;
                    }
                    this.data.row[this.cols[i].field] = this.formData[this.cols[i].field];
                } else {
                    if (this.data.row === undefined) {
                        continue;
                    }
                    this.formData[this.cols[i].field] = this.data.row[this.cols[i].field];
                    this.data.entryHeader.push({field: this.cols[i].field, headerName: this.cols[i].headerName, type: type, value: this.data.row[this.cols[i].field]});
                }
            }
        }

        return this.data.entryHeader;
    }

    /**
     * Reply email from inbox page
     * @param iActivity
     * @param iConv
     */
    replyEmailNav(iActivity = 0, iConv = 0) {
        try {
            // Get inbox item ID from description
            const description = JSON.parse(this.data.activities[iActivity].description);
            if (description['inbox-entry-id'] !== undefined) {
                this.boardsComponent.router.navigate(['/boards/32/main'], {queryParams: {entryId: description['inbox-entry-id'], convIndex: iConv}});
            }
        } catch (e) {
            console.log(e);
        }
    }

    updateEntryHeader() {
        this.getEntryHeaderArray(true);
        this.isHeaderEdit = false;
        this.formData = {id: this.data.id, action: 'add-full-entry', board_id: this.data.board.id, ...this.formData};
        this.httpService.bulkActionsRows(this.formData).subscribe((res: any) => {
            this.localStore.set('entry_' + this.data.id, this.data);
            this.boardsComponent.getBoardData(true);
            this.formData = {};
        });

    }

    deleteItemSubBoard(iBoard = -1) {
        const itemId = this.editSubBoardEntry.item.id;
        if (itemId !== undefined && itemId > 0 && iBoard >= 0) {
            const subBoardIndex = this.data.sub_boards.findIndex((subBoard: any) => subBoard.type === this.editSubBoardEntry.type);

            this.data.sub_boards[subBoardIndex].entries = this.data.sub_boards[subBoardIndex].entries.filter((item: any) => {
                return item.id !== itemId;
            });

            // clear entry detail cache
            this.cache.reCacheEntryData(this.data.id, false);

            // clear sub board cache
            this.cache.reCacheBoardData(this.data.sub_boards[subBoardIndex].id, false);

            this.httpService.deleteRow(itemId).subscribe((response: any) => {
            });
        }

        this.editSubBoardEntryItem(false);
    }

    /**
     * Edit activity
     * @param index
     */
    editActivity(index = -1) {
        if (index < 0) {
            return;
        }

        let type = '';
        switch (this.data.activities[index].type) {
            case 'email':
            case 'email_schedule':
            case 'email_draft':
                type = 'email';
                this.setEmailDataActivity(this.data.activities[index]);
                break;
        }

        this.data.loaded = false;
        this.openNewActivity(type, false);
        const that = this;
        setTimeout(() => {
            that.data.loaded = true;
        }, 1);

        // Scroll to top to see the editor window
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    /**
     * Set email data for activity edit form
     * @param data
     */
    setEmailDataActivity(data: any) {
        const emailData = data.email;
        this.emailData = {
            id: emailData.id,
            activityId: data.id,
            fromConfig: '',
            to: emailData.to,
            sender: emailData.from,
            toCc: emailData.e_cc,
            toBcc: emailData.e_bcc,
            subject: emailData.subject,
            templateType: '',
            template: emailData.email_template_id,
            content: emailData.body,
            file: '',
            ifNoReply: emailData.reminder,
            noReplyDate: '',
            remindMeFollowup: '',
            reminder: 0,
            reminderDate: '',
            reminderType: '',
            sequence: '',
            schedule: '',
            scheduleTime: '',
            scheduleTimezone: '',
            sendLater: false
        }
    }

    /**
     * Add new sub item, activity/opportunity/contact
     */
    createNewSubItem(board: any = false) {
        if (!board) {
            return;
        }

        let rowData: any = {
            action: 'add-related-entry',
            board_type: board.type,
            item: this.editSubBoardEntry.item.item,
            related_to: this.data.id,
        };

        switch (board.type) {
            case 'activity':
                this.editSubBoardEntry.item.guests = this.processTags(this.guestsArray);
                break;
            case 'contact':
                break;
            case 'opportunity':
        }

        rowData = {...rowData, ...this.editSubBoardEntry.item};

        let stageWon = false;

        // check if this is opportunity and status is won, then move to specific group
        if (board.type === 'opportunity') {
            // Find the stage column name value
            const stages = this.getSubBoardColumnStatus(this.data.sub_boards[0]?.columns, 'stage');

            // Find stage name of selected stage ID
            const stageName = stages.find((stage: any) => stage.id === this.editSubBoardEntry.item.stage)?.name;

            // If stage name is won, then move to won group, make it lowercase and trim spaces
            if (stageName?.toLowerCase().trim() === 'won') {
                rowData.group_name = 'Won';
                stageWon = true;
            }
        }

        const subBoardIndex = this.data.sub_boards.findIndex((subBoard: any) => subBoard.type === this.editSubBoardEntry.type);

        // Reset entry data cache
        this.cache.reCacheEntryData(this.data.id, false);

        // clear sub board cache
        this.cache.reCacheBoardData(this.data.sub_boards[subBoardIndex].id, false);

        // Hide editor
        this.editSubBoardEntry = null;

        const date = new Date();
        const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        rowData.created = {
            fname: 'John', // TODO: Get dynamic user later
            lname: 'Doe', // TODO: Get dynamic user later
            date: months[date.getMonth() - 1] + ' ' + date.getDate() + ', ' + date.getFullYear(),
            time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        };

        // Add new record to entries
        this.data.sub_boards[subBoardIndex].entries.splice(0, 0, rowData);

        this.httpService.bulkActionsRows(rowData).subscribe((res: any) => {
            this.data.sub_boards = res?.data?.tabs[0]?.data?.sub_boards;
            this.localStore.set('entry_' + this.data.id, this.data);

            // If board type is activity, reload activities calendar
            if (board.type === 'activity') {
                this.creatingTask = true;
                setTimeout(() => {
                    this.creatingTask = false;
                }, 100);
            }

            // If new opportunity and board is lead
            if (board.type === 'opportunity' && this.data.board.type === 'lead' && res?.data?.overviews[0]?.entries?.length) {
                // move lead to contacts
                this.moveLeadsToContact(res?.data?.overviews[0]?.entries[0], stageWon);
            }
        });
    }

    /**
     * Move lead to contacts board
     *
     * @param data
     * @param stageWon
     */
    moveLeadsToContact(data: any, stageWon = false){
        let map:any = {};
        map[this.data.id] = {
            deals: data.id,
            title: this.data?.row?.title,
            phone: this.data?.row?.phone,
            email: this.data?.row?.email,
            company: this.data?.row?.company,
            deal_value: data?.deal_value,
            location: data?.location,
        };

        // Get contacts board id
        const contactBoardId = this.boardsComponent.allBoards.find((board: any) => board.type === 'contact')?.id;

        // Clear lead cache
        this.cache.reCacheBoardData(this.data.board.id, false);

        // Re-build lead board data
        this.boardsComponent.getBoardData(true);

        // Clear contact cache
        this.cache.reCacheBoardData(contactBoardId, false);

        const rowData = {
            action: 'move',
            where: 'board',
            group_id: 0,
            board_id: contactBoardId,
            ids: this.data.id,
            map: JSON.stringify(map)
        };

        this.httpService.bulkActionsRows(rowData).subscribe((res: any) => {
            // Create account if stage is won
            if (stageWon) {
                this.createAccount(res, data);
            }

            this.cache.reCacheBoardData(res.board_id, false);
        });
    }

    /**
     * Create account based on contact and opportunity
     *
     * @param contactRow
     * @param opportunityRow
     */
    createAccount(contactRow: any, opportunityRow:any ) {
        // Create new account from the contact and opportunity row data
        const rowData = {
            action: 'add-full-entry',
            board_type: 'account',
            item: opportunityRow?.company || contactRow?.item,
            contacts: contactRow?.ids,
            deals: opportunityRow?.id,
            account_value: opportunityRow?.deal_value,
            email: contactRow?.email,
            phone: contactRow?.phone,
            billing_address: contactRow?.location,
            comments: contactRow?.comments,
        }

        // Create new account based on the contact and opportunity row data
        this.httpService.bulkActionsRows(rowData).subscribe((res: any) => {
            this.cache.reCacheBoardData(res.board_id, false);

            /**
             * Update the account id in the opportunity row
             */
            const oppRowData = {
                board_id: opportunityRow?.board_id,
                entry_id: opportunityRow?.id,
                key: 'accounts',
                content: '' + res.id
            };

            this.cache.reCacheBoardData(opportunityRow?.board_id, false);
            this.boardsComponent.updateRowInDB(oppRowData, opportunityRow?.board_id);

            /**
             * Update contact row with account id
             */
            const contactRowData = {
                board_id: contactRow?.board_id,
                entry_id: contactRow?.ids,
                key: 'accounts',
                content: '' + res.id
            };

            this.cache.reCacheBoardData(contactRow?.board_id, false);
            this.boardsComponent.updateRowInDB(contactRowData, contactRow?.board_id);
        });
    }

    processTags(tags: any) {
        if (typeof tags === 'object' && tags.length > 0) {
            return;
        }

        let tagList: any = [];
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].value !== undefined) {
                tagList.push(tags[i].value);
            }
        }

        return tagList.join(',');
    }

    processTagsReverse(tagsString: string) {
        if (tagsString === undefined || tagsString === '') {
            return;
        }

        const tagList = tagsString.split(',');
        let tags = [];
        for (let i = 0; i < tagList.length; i++) {
            tags.push({value: tagList[i], display: tagList[i]});
        }

        return tags;
    }

    /**
     * Add new board item
     */
    createNewRow() {
        // Validation
        if (this.formData.item === undefined || this.formData.item.trim() == '') {
            alert('Please enter activity title.');
            return;
        }

        this.btnTxt = 'Please wait..';

        this.formData.guests = this.processTags(this.guestsArray);

        const data = {
            action: 'add-full-entry',
            board_id: this.data.boardId,
            ...this.formData
        };

        let localBoard = this.cache.getBoardCache(this.data.boardId);

        // Clear board cache
        this.cache.reCacheBoardData(this.data.boardId, false);

        this.httpService.bulkActionsRows(data).subscribe(res => {
            if (localBoard) {
                // find group index by id
                const groupIndex = localBoard.groups.findIndex((group: any) => group.id === res.group_id);
                if (groupIndex >= 0) {
                    // add new row
                    localBoard.groups[groupIndex].entries.push(res);
                    this.cache.setBoardCache(this.data.boardId, localBoard);
                    this.boardsComponent.getBoardData();
                }
            } else {
                this.cache.reCacheBoardData(this.data.boardId, true);
            }
            this.formData = {};
            this.btnTxt = 'Submit';
        });
    }

    /**
     * Delete activity
     *
     * @param id
     */
    deleteActivity(id = 0) {
        if (id > 0) {
            this.data.activities = this.data.activities.filter((activity: any) => activity.id !== id);
            this.localStore.set('entry_' + this.data.id, this.data);
        }
        this.httpService.deleteActivity(id).subscribe((res: any) => {
        });
    }

    /**
     * Get tabs data from tabs array
     * @param tabSlug
     */
    getTabsData(tabSlug = 'overview') {
        let array: any = <any>[];
        if (this.data[tabSlug] === undefined) {
            return array;
        }

        return array;
    }

    console(data: any) {
        console.log(data);
    }

    /**
     * Get sub board column status options
     *
     * @param columns
     * @param key
     * @param from
     */
    getSubBoardColumnStatus(columns: any, key = 'stage', from = 'statuses') {
        let options = [];

        // find column with key
        let column = columns.find((column: any) => column?.key === key || column?.field === key);

        switch (from) {
            case 'statuses':
                options = column[from] !== undefined ? column[from] : column.cellRendererParams[from];
                break;
            case 'settings':
                try {
                    options = column[from] !== undefined ? JSON.parse(column[from]) : JSON.parse(column.cellRendererParams[from]);
                } catch (e) {
                }
        }

        return options;
    }

    showHideTouchpoints(show = true, item: any = false) {
        this.singleForm = item;
        this.isEditTouchpoint = show;
    }

    // touch point edit mode
    expandCollapseOverviewItems(show = true) {
        this.overviewItemExpanded = show;
    }

    // show touchpoint card text full and less
    touchpointCollapsedText() {
        this.showLess = !this.showLess;
    }

    /**
     * Create new touch-point form
     */
    saveNewTouchpoint() {
        // Reset touchpoint cache
        this.cache.reCacheTouchpointsData(true);
        this.singleForm = false;
        const data = {name: this.touchpointModel.name, type: 'form', shared: 0, restrict: this.touchpointModel.restrict, hide: this.touchpointModel.hide};
        this.touchpointModel = {};
        this.httpService.createForm(data).subscribe((res: any) => {
            this.singleForm = res;
            this.allForms.push(res);
        });

        this.isEditTouchpoint = true;
    }

    /**
     * Delete form
     *
     * @param id
     */
    deleteForm(id: any) {
        this.cache.reCacheTouchpointsData(false);
        this.allForms = this.allForms.filter((form: any) => form.id !== id);
        this.httpService.deleteForm(id).subscribe((res: any) => {
        });
    }

    /**
     * Delete form
     *
     * @param id
     */
    deleteFormField(id: any) {
        this.cache.reCacheTouchpointsData(false);
        this.singleForm.fields = this.singleForm.fields.filter((field: any) => field.id !== id);
        this.httpService.deleteFormField(id).subscribe((res: any) => {
        });
    }

    /**
     * Edit touchpoint field
     *
     * @param index
     */
    editTouchPointField(index = -1) {
        this.touchpointModel = this.singleForm.fields[index];
        this.touchpointModel.name = this.getFormFieldsByKey(this.touchpointModel.settings, 'name');
        this.touchpointModel.type = this.getFormFieldsByKey(this.touchpointModel.settings, 'type');
        this.touchpointModel.description = this.getFormFieldsByKey(this.touchpointModel.settings, 'description');
        this.touchpointModel.choices = this.getFormFieldsByKey(this.touchpointModel.settings, 'choices');
        this.touchpointModel.share = this.getFormFieldsByKey(this.touchpointModel.settings, 'share');
    }

    /**
     * Create new form field
     */
    createNewFormField() {
        const settings = JSON.stringify({
            name: this.touchpointModel.name,
            type: this.touchpointModel.type,
            description: this.touchpointModel.description,
            choices: this.touchpointModel.choices,
            share: this.touchpointModel.share,
        });

        // Clear cache for touchpoints
        this.cache.reCacheTouchpointsData(false);

        // Get Id if this is edit
        const id = this.touchpointModel.id !== undefined && this.touchpointModel.id > 0 ? this.touchpointModel.id : 0;
        let lastIndex = -1;

        const fieldData = {form_id: this.singleForm.id, id: id, order: 0, settings: settings, shared: this.touchpointModel.share, user_id: 1};

        // Add new record to fields
        if (id !== 0) {
            lastIndex = this.singleForm.fields.findIndex((field: any) => field.id === id);
            this.singleForm.fields[lastIndex] = fieldData;
        } else {
            this.singleForm.fields.push(fieldData);
            lastIndex = this.singleForm.fields.length - 1;
        }

        // Reset form model
        this.touchpointModel = {};

        // Set data for API request
        const data = {id: id, form_id: this.singleForm.id, shared: this.touchpointModel.share, user_id: 1, order: 1, settings: settings};
        this.httpService.createFormField(data).subscribe((res: any) => {
            // Update field received from server.
            this.singleForm.fields.splice(lastIndex, res);
        });
    }

    /**
     * Get form field by key
     *
     * @param settings
     * @param key
     */
    getFormFieldsByKey(settings = '', key = '') {
        const settingsObj = JSON.parse(settings);
        return settingsObj[key];
    }

    /**
     * Select touch point to show form in overview activities tab
     *
     * @param index
     */
    selectTouchpoint(index: any) {
        this.currentTouchpoint = this.allForms[index];
        this.touchpointActivityModel = {};
        this.newActivityType = 'touchpoint';
    }

    /**
     * Create touchpoint activity
     */
    createTouchpointActivity() {
        // Add new activity
        this.addActivity('touchpoint', 'John', 'Doe', 'created', 'just now', JSON.stringify({form: this.currentTouchpoint, data: this.touchpointActivityModel}));

        // Reset touchpoint activity model
        this.touchpointActivityModel = {};

        // Hide box
        this.hideTouchpointBox();
    }

    /**
     * Hide touchpoint activity form from overview
     */
    hideTouchpointBox() {
        this.newActivityType = '';
        this.touchpointActivityModel = {};
    }

    getTouchpointFieldsView(field: any, activity: any) {
        let value = '';

        if (activity.description !== undefined && field.id !== undefined) {
            const data = this.getFormFieldsByKey(activity.description, 'data');

            if (data['field_' + field.id] !== undefined) {
                return data['field_' + field.id];
            }
        }

        return value;
    }

    getTouchpointFieldsViewArray(activity: any) {
        let fields = [];

        if (activity.description !== undefined) {
            const form = this.getFormFieldsByKey(activity.description, 'form');

            if (form.fields !== undefined) {
                fields = form.fields;
            }
        }

        return fields;
    }

    /**
     * Get all forms for touchpoints
     */
    getAllForms() {
        // Get local checked data if available
        const localTouchpoints = this.localStore.get('touchpoints');
        this.newActivityType = 'touchpoints';
        this.openNewActivity('touchpoints');
        this.filterActivities('touchpoint');

        // Attach local stored data if available
        if (localTouchpoints) {
            this.allForms = localTouchpoints;
            this.tabLoaded = true;
        } else {
            this.httpService.getForms().subscribe((res: any) => {
                this.localStore.set('touchpoints', res);
                this.allForms = res;
                this.tabLoaded = true;
            });
        }
    }

    /**
     * Add new choice for touchpoint form field
     * @param choice
     */
    addNewChoice(choice = '') {
        // Do not add choice if it is empty
        if (choice == '') {
            return;
        }

        // Check if choices is undefined
        if (this.touchpointModel.choices == undefined) {
            this.touchpointModel.choices = [];
        }

        // Check if choice already exists
        if (this.touchpointModel.choices.indexOf(choice) == -1) {
            this.touchpointModel.choices.push(choice);
        }

        this.touchpointModel.choice = '';
    }

    addTaskFunc(event: any) {
        (event == 'show' ? this.addTask = true : this.addTask = false);
    }

    addOpporFunc(event: any) {
        (event == 'show' ? this.addOpportunity = true : this.addOpportunity = false);
    }

    addContactFunc(event: any) {
        (event == 'show' ? this.addContact = true : this.addContact = false);
    }

    addContactDetail(event: any) {
        (event == 'show' ? this.contactDetail = true : this.contactDetail = false);
    }

    isSearchFunc(event: any) {
        (event == 'show' ? this.isSearch = true : this.isSearch = false);
    }

    onResizeEnd(event: ResizeEvent): void {
        if (event.rectangle.width) {

            this.data.trayWidth = (event.rectangle.width >= this.data.trayMaxWidth) ? this.data.trayMaxWidth : event.rectangle.width;
            this.data.trayWidth = (this.data.trayWidth <= this.data.trayMinWidth) ? this.data.trayMinWidth : this.data.trayWidth;

        }
    }

    showBody(index: any) {
        const showBody = document.getElementById('body-' + index);
        const arrowPos = document.getElementById('emailBodyToggler-' + index);
        if (arrowPos?.classList.contains('fa-angle-down')) {
            this.anglePos = 'fa-angle-up';
        } else {
            this.anglePos = 'fa-angle-down';
        }
        showBody?.classList.toggle("d-none");
    }

    updateReply() {
        this.isReply = true;

                // initialize ckeditor for updates
        // check if editor exists
        setTimeout(() => {

          ClassicEditor.create( document.querySelector("#custom_editor_reply"),
          {
              toolbar:{
                  items:["heading","|","bold","italic","|","undo","redo"]
              },
              mention:{
                  feeds:[{
                      marker:"@",
                      feed: this.getTagUsers()
                  }]
              },
              height: '200px'
              }
              ).then( ( editor: any ) => {
                  this.ckEditor = editor;
                  this.ckEditor.setData( '' );
              } )
              .catch( ( error: any ) => {
                  console.error( 'There was a problem initializing the reply editor.', error );
              } );
      }, 1);
    }

    reply(parent_id: string) {
        this.isReply = false;
        const mentions = this.getMentionedUsers(this.ckEditor.getData());
        const data = {
          parent_id,
          entry_id: this.data.id,
          content: this.ckEditor.getData(),
          mentions,
        }

        const date = new Date();
        const tempReply = {
            "entry_id": this.data.id,
            "type": null,
            "content": this.ckEditor.getData(),
            "user_id": this.user.ID.toString(),
            "parent_id": parent_id,
            "pinned": "0",
            "date": "2022-11-25 19:00:33",
            "total_likes": "0",
            "likes_users": [],
            "created": {
                "fname": "",
                "lname": "",
                "date": date.toLocaleDateString('en-us', {year: "numeric", month: "short", day: "numeric"}),
                "time": date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
            }
        }
        const index = this.updates.map((u: any) => u.id).indexOf(parent_id);
        this.updates[index].replies.unshift(tempReply);
        this.updateText = '';

        this.httpService.addUpdates(data).subscribe((res) => {
            this.getUpdates();
        });
    }

    placeUpdate() {
        this.updateEditor = false;

        const mentions = this.getMentionedUsers(this.ckEditor.getData());
        const data = {
          entry_id: this.data.id,
          content: this.ckEditor.getData(),
          mentions,
        }

        const date = new Date();
        const tempUpdate = {
            "entry_id": this.data.id,
            "type": null,
            "content": this.ckEditor.getData(),
            "user_id": this.user.ID.toString(),
            "parent_id": "0",
            "pinned": "0",
            "date": "2022-11-25 19:00:33",
            "replies": [],
            "total_likes": "0",
            "likes_users": [],
            "created": {
                "fname": "",
                "lname": "",
                "date": date.toLocaleDateString('en-us', {year: "numeric", month: "short", day: "numeric"}),
                "time": date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
            }
        }
        this.updates.unshift(tempUpdate);
        this.updateText = '';

        this.httpService.addUpdates(data).subscribe((res) => {
            this.getUpdates();
        });
    }

    getMentionedUsers(data: any) {
      let mentions: any[] = data.match(/@([\w\s()]*)/g) || [];
      let unqMentions = _.uniq(mentions);

      return unqMentions?.map((mention: any) => {
        if(mention.split('@')[1]) {
          let user = this.users?.find((user: any) => user.display_name === mention.split('@')[1]);
          return {
            type: 'User',
            id: user?.ID
          }
        } else { return {} }
      })?.filter((ele: any) => !!ele.id);
    }

    getUpdates() {
        this.httpService.getListOfUpdates(this.data.id).subscribe((res: any) => {
            this.updates = res;
        });
    }

    showUpdateEditor() {
        this.updateEditor = true;

        // initialize ckeditor for updates
        // check if editor exists
        setTimeout(() => {

            ClassicEditor.create( document.querySelector("#custom_editor"),
            {
                toolbar:{
                    items:["heading","|","bold","italic","|","undo","redo"]
                },
                mention:{
                    feeds:[{
                        marker:"@",
                        feed: this.getTagUsers()
                    }]
                },
                height: '200px'
                }
                ).then( ( editor: any ) => {
                    this.ckEditor = editor;
                    this.ckEditor.setData( '' );
                } )
                .catch( ( error: any ) => {
                    console.error( 'There was a problem initializing the editor.', error );
                } );
        }, 1);
    }

    getTagUsers() {
        const users = this.users.map( ( user: any ) => { return { id: '@' + user.display_name, userId: user.ID, name: user.display_name }; } );
        return users;
    }

    onClickMention() {

        // check if editor exists
        if( this.ckEditor ) {
            this.ckEditor.model.change( ( writer: any ) => {
                this.ckEditor.model.insertContent( writer.createText( '@' ) );
            } );
        }
    }

    getpostingDate(data: any) {
        const today = new Date();
        const date = new Date(data.date);
        if (date.toDateString() === today.toDateString()) {
            return data.time;
        }
        return data.date;
    }

    deleteUpdate(update_id: number) {
        const data = {
            action: 'delete',
            update_id,
        }
        this.updates = this.updates.filter((update: any) => {
            return update.id != update_id;
        });
        this.httpService.updateBulk(data).subscribe((res: any) => {
            this.updates = this.updates.filter((ele: any) => {
                return ele.id != update_id
            });
        });
    }

    onEditUpdate(update: any) {
        this.editUpdateId = update.id
        this.updateEditor = false;
        this.updateText = update.content;
    }

    editUpdate(update_id: number) {
        const data = {
            entry_id: this.data.id,
            content: this.updateText,
            pinned: '0',
        }
        this.updateText = '';
        this.editUpdateId = 0;
        this.httpService.addUpdates(data).subscribe((res) => {
            this.updates = this.updates.map((ele: any) => {
                if (ele.id === update_id) {
                    ele.content = res.content;
                }
                return ele;
            });
        });
    }

    onLikeUpdate(update_id: number, parent_id?: number) {
        const data = {
            action: 'toggle_like',
            update_id,
            parent_id,
        }

        if (!parent_id) {
            for (let update of this.updates) {
                if (update.id === update_id) {
                    if (!update.likes_users.includes(this.user.ID.toString())) {
                        update.likes_users.push(this.user.ID.toString());
                    } else {
                        update.likes_users.splice(update.likes_users.indexOf(this.user.ID.toString()), 1);
                    }
                    break;
                }
            }
        } else {
            for (let update of this.updates) {
                if (update.id === parent_id) {
                    for (let reply of update.replies) {
                        if (reply.id === update_id) {
                            if (!reply.likes_users.includes(this.user.ID.toString())) {
                                reply.likes_users.push(this.user.ID.toString());
                            } else {
                                reply.likes_users.splice(reply.likes_users.indexOf(this.user.ID.toString()), 1);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        this.httpService.updateBulk(data).subscribe(() => {
        });
    }

    getUsername(user_id: string) {
        const user = this.users.filter((user: any) => {
            return user.ID === user_id
        });
        return user[0]?.display_name || '';
    }

    /**
     * Show/hide settings
     *
     * @param event
     * @param type
     *
     */
    showSettings(event = 'show', type = 'email') {
      this.tab = event === 'show'? 'settings': 'overview';
      this.showSettingsType = event == 'show' ? type : '';

      if (type == 'email') {
          this.getEmailSettings();
      }
    }

    ngOnInit(): void {
        this.moveTinyMceButtons();
    }

    moveTinyMceButtons(){
        const previewBtn = document.querySelector('[title="Preview"]');
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.editor = '';

        // Load other data only when the main data is loaded
        if (this.data.loaded) {
            this.getUpdates();
            this.getUsers();
            this.setData();
            this.setActivityLogs();
            this.getSubscribers();
            this.getProducts();
            this.getServices();
            this.getUserConnectedEmails();
            this.adjustSplitSize();
            this.getEmailPreference();
        }
    }

    ngOnDestroy(): void {
        // this.editor.destroy();
        this.data = {};
    }

    setData() {
      if (this.type !== 'entry-detail') {
          return;
      }
      this.setLocation();
      this.setContact();
      this.setDeal();
      this.setActivities();
      this.setEmail();
      this.getEmailSettings();
      this.setSelectAsRowOnBoard();
    }

    setSelectAsRowOnBoard(select = true) {
      let groupId = this.data?.row?.group_id;
      let rowId = this.data?.row?.id;
      if(groupId && rowId) {
        this.selectRowOnTrayOpen.emit({groupId, rowId, select});
      }
    }

    archiveRow() {
      this.archiveRows.emit();
    }

    deleteRow() {
      this.deleteRows.emit();
    }

    exportRow() {
      this.exportRows.emit();
    }

    copyItemLink() {
      if(this.data?.board?.id && this.tab && this.data?.row?.id) {
        let url: string = `boards/${this.data?.board?.id}/${this.tab}/${this.data?.row?.id}`;
        navigator.clipboard.writeText(url).then(() => {});
      }
    }

    setEmail() {
      this.emailData.to = this.data.row.email? this.data.row.email.split(',')[0]: '';
      this.smsTo = this.data.row?.phone;
    }

    setLocation() {
        let locationCol = this.cols.find((col: any) => {
            return col.cellRendererParams.typeCol === "location"
        });
        if (locationCol) {
            this.leadData.location = [];
            this.leadData.location[0] = locationCol.field;
            this.leadData.location[1] = this.data.row[locationCol.field];
            if (this.leadData.location) {
                locationCol = this.cols.find((col: any) => {
                    return col.cellRendererParams.typeCol === "location" && col.headerName.toLowerCase().includes('billing')
                });
                this.leadData.billing = [];
                this.leadData.billing[0] = locationCol ? locationCol.field : this.leadData.location[0];
                this.leadData.billing[1] = locationCol ? this.data.row[locationCol.field] : this.leadData.location[1];
                locationCol = this.cols.find((col: any) => {
                    return col.cellRendererParams.typeCol === "location" && col.headerName.toLowerCase().includes('shipping')
                });
                this.leadData.shipping = [];
                this.leadData.shipping[0] = locationCol ? locationCol.field : this.leadData.location[0];
                this.leadData.shipping[1] = locationCol ? this.data.row[locationCol.field] : this.leadData.location[1];
            }
        }
    }

    setNewLocation(event: any, field: string) {
        if (event.formatted_address) {
            this.tempData = {[field]: event.formatted_address};
        }
    }

    setContact() {
        if (this.data?.row?.contacts) {
            let contactBoard = this.cache.getBoardCache(5);

            const contact = contactBoard?.groups?.find((group: any) => {
                return group?.entries?.find((entry: any) => {
                    return entry.id === this.data?.row?.contacts
                });
            });
            this.leadData.contact = contact?.entries[0];
        }
    }

    setDeal() {
      let opportunityBoard = this.cache.getBoardCache(2);

      const statuses = opportunityBoard?.columns?.find((col: any) => {
        return col.type === 'status' && col.key === 'stage'
      })?.statuses;
      statuses?.length && (this.leadData.statuses = statuses);

      if (this.data?.row?.deals) {
        opportunityBoard?.groups?.forEach((group: any) => {
            group?.entries?.forEach((entry: any) => {
                entry.id === this.data?.row?.deals && (this.leadData.deal = entry);
            });
        });
      }

      if(this.data.row.board_id === '2') {
        this.leadData.deal = { stage: this.data?.row?.stage };
      }

      if (statuses !== undefined && statuses.length > 0) {
          statuses.forEach((status: any) => {
              if (status?.id === this.leadData?.deal?.stage && ['Won', 'Lost', 'Abandoned'].includes(status.name)) {
                  this.finalStage = {name: status.name, color: status.color};
              }
          });
      }

    }

    setActivitiesMonths() {
        this.leadData.months = {
            last: moment(new Date(), 'YYYY/MM/DD').subtract(1, 'months').format('MMMM YY'),
            current: moment(new Date(), 'YYYY/MM/DD').format('MMMM YY'),
        }
    }

    setActivities() {
      this.setActivitiesMonths();
      this.filterActivities(this.newActivityType);
    }

    filterActivities(filter: string) {
      const activities = this.data?.activities?.map((e: any)=>{ return {...e}});
      if(activities) {
        if(!filter) {
          this.leadData.activities = [...activities];
          return;
        }
        this.leadData.activities = activities?.map( (ele: any) => {
          ele.activities = ele?.activities?.filter( (activity: any) => {
            if(filter === 'email') {
              return ['email', 'email_schedule'].includes(activity.type);
            } else{
              return activity.type === filter;
            }
          }).map( (activity: any) => {
            if(activity.description && ['email', 'email_schedule', 'touchpoint'].includes(activity.type)) {
              activity.description = this.isJsonObject(activity.description)? JSON.parse(activity.description): activity.description;
            }
            return activity;
          });
          return ele;
        });
      }
    }

    isJsonObject(strData: any) {
      try {
          JSON.parse(strData);
      } catch (e) {
          return false;
      }
      return true;
    }

    updateLocation(field: string) {
        this.data.row[field] = this.tempData[field];
        this.setLocation();
        this.updateData(this.tempData);
    }

    updateAdditionalInfo() {
        this.data.row.annual_revenue = this.tempData.annual_revenue || this.data.row.annual_revenue;
        this.data.row.industry = this.tempData.industry || this.data.row.industry;
        this.data.row.no_employees = this.tempData.no_employees || this.data.row.no_employees;
        this.updateData(this.tempData);
    }

    updateBankingInfo() {
        this.data.row.booking_name = this.tempData.booking_name || this.data.row.booking_name;
        this.data.row.routing = this.tempData.routing || this.data.row.routing;
        this.data.row.account_no = this.tempData.account_no || this.data.row.account_no;
        this.updateData(this.tempData);
    }

    updateData(data: any) {
        for (var propName in data) {
            if (data[propName] === null || data[propName] === undefined) {
                delete data[propName];
            }
        }
        const formData = {id: this.data.id, item: this.data.title, action: 'add-full-entry', board_id: this.data.board.id, ...data};
        this.httpService.bulkActionsRows(formData).subscribe((res: any) => {
            this.localStore.set('entry_' + this.data.id, this.data);
            this.boardsComponent.getBoardData(true);
            this.tempData = {};
        });
    }

    getEntryActivities() {
        this.httpService.getEntryActivities(this.data.id).subscribe((entry: any) => {
            this.data.activities = entry.activities;
            this.filterActivities(this.newActivityType);
            this.localStore.set('entry_' + this.data.id, entry);
        });
    }

    onDealLeadChange() {
        const deal_lead_project = this.editSubBoardEntry.item.deal_lead_project;
        if (deal_lead_project) {
            const queryParams = `?search=${deal_lead_project}&board_types=lead,opportunity,contact`
            this.httpService.searchEntries(queryParams).subscribe((res: any) => {
                this.filteredOptions = res;
            });
        }
    }

    onPeopleChange() {
        const entrySearchPeople = this.editSubBoardEntry.item.people;
        if (entrySearchPeople) {
            const queryParams = `?search=${entrySearchPeople}&board_types=contact`
            this.httpService.searchEntries(queryParams).subscribe((res: any) => {
                this.filteredPeople = res;
            });
        }
    }

    onPeopleSelect(value: any) {
        this.editSubBoardEntry.item.organization = value.company || '';
        // value.organization && (
        //   this.editSubBoardEntry.item.organization = value.organization
        // )
    }

    /**
     * Get address from location field
     * @param event
     */
    getAddress(event: any) {
        if (event.formatted_address != undefined) {
            if (this.editSubBoardEntry !== null) {
                this.editSubBoardEntry.item.location = event.formatted_address;
            } else {
                this.formData.location = event.formatted_address;
            }
        }
    }

    getUsers() {
        const users = this.cache.getUsersCache();
        if (users) {
            this.users = users;
        } else {
            this.httpService.getUsers().subscribe((res) => {
                this.cache.setUsersCache(res);
                this.users = res;
            });
        }
    }

    /**
     * Fire when AG grid is ready
     *
     * @param params
     */
    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
    }

    openNewActivity(type = '', reset = true) {
        this.filterActivities(type);
        this.newActivityType = type;
        this.activeActivityTab = type;

        if (type == 'email') {

            // Reset email form for new emails
            if (reset) {
                this.resetEmailForm();
            }

            this.getEmailSettings();
        }
    }

    createUpdates() {
        if (this.updatesData.content == '') {
            return;
        }

        // this.updates.push({id: '1', createdBy: 'Tawassul', time: 'Just now', content: this.updatesData.content});
        this.updatesData = {...this.defaultUpdatesData};
    }

    getReverstArray(array: any) {
        return array.reverse();
    }

    hideDetailPopup() {
      this.setSelectAsRowOnBoard(false);
        this.boardsComponent.showDetailPopup(false, false);
    }

    setBoardTypeForInvoiceForm(type: string) {
      this.boardTypeForInvoiceForm = type;
    }

    selectBoardTypeForInvoiceForm(event: any) {
      const type: string = event.target.value;
      this.setBoardTypeForInvoiceForm(type);
    }

    /**
     * Add new activity
     *
     * @param type
     * @param fname
     * @param lname
     * @param creationType
     * @param time
     * @param content
     */
    addActivity(type = 'email', fname = '', lname = '', creationType = '', time = 'just now', content = '') {
        // this.data.activities[0].activities.unshift({created: {fname: fname, lname: lname, date: '', time: time}, date: '', entry_id: this.data.id, type_id: '', user_id: 1, id: 0, type: type, description: content});

        // Reset entry data cache
        this.cache.reCacheEntryData(this.data.id, false);

        // Add activity in database
        const data = {entry_id: this.data.id, type: type, description: content};

        // Do not create activity for SMS/Email in database manually
        if (['sms', 'email'].includes(type)) {
            return;
        }
        this.httpService.createActivity(data).subscribe((res: any) => {
            if (res.id !== undefined) {
                this.data.activities[0].activities.unshift(res);
                this.filterActivities(type);
            }
        });
    }

    /**
     * Send email
     *
     * @param action
     * @param replyIndex
     */
    sendEmail(action = 'send_email') {
        // Add some validation checks
        if (this.emailData.to == '') {
            alert('Please enter email address.');
            return;
        }

        if (this.emailData.subject == '') {
            alert('Please enter email subject.');
            return;
        }

        this.emailReplyIndex = -1;
        this.newActivityType = '';

        const data: any = new FormData();

        const subject = this.processShortcodes(this.emailData.subject);
        const content = this.processShortcodes(this.emailData.content);

        const d = new Date(this.emailData.schedule);
        const scheduleDate = moment(d).format('MM-DD-YYYY');

        data.append('action', action);
        data.append('email_id', this.emailData.id);
        data.append('activity_id', this.emailData.activityId);
        data.append('entry_id', this.data.id);
        data.append('recipients', this.emailData.to);
        data.append('subject', subject);
        data.append('sender', this.emailData.sender);
        data.append('body', content);
        data.append('cc', this.emailData.toCc);
        data.append('bcc', this.emailData.toBcc);
        data.append('email_template', this.emailData.template);
        data.append('attachments', this.emailData.file);
        data.append('reminder', this.emailData.reminder);
        data.append('reminder_date', this.emailData.reminderDate);
        data.append('reminder_type', this.emailData.reminderType);
        data.append('email_sequence', this.emailData.sequence);
        data.append('schedule', scheduleDate);
        data.append('schedule_time', this.emailData.scheduleTime);
        data.append('schedule_timezone', this.emailData.scheduleTimezone);

        if (this.data.board.type == 'inbox' && this.emailReplyIndex >= 0) {
            data.append('foreign_history_id', this.data.inbox.conversations[this.emailReplyIndex].foreign_history_id);
            data.append('foreign_message_id', this.data.inbox.conversations[this.emailReplyIndex].foreign_message_id);
            data.append('foreign_thread_id', this.data.inbox.conversations[this.emailReplyIndex].foreign_thread_id);
        }

        let index = 0;

        if (this.emailData.id > 0 && this.emailData.activityId > 0) {
            index = this.data.activities.findIndex((activity: any) => activity.id == this.emailData.activityId);
        }

        // add data to activity/conversation
        if (this.data.board.type == 'inbox') {
            this.data.inbox.conversations.splice(0, 0, {
                from: this.emailData.sender,
                to: this.emailData.to,
                updated_at: 'Just now',
                body: this.emailData.content,
            });
        } else {
            // this.data.activities[0].activities.unshift({created: {fname: '', lname: '', date: '', time: 'Just now'}, date: '', entry_id: this.data.id, type_id: '', user_id: 1, id: 0, type: 'email', description: this.emailData.content, email: {subject: subject, from: this.emailData.sender, to: this.emailData.to, cc: this.emailData.toCc, status: 'pending', bcc: this.emailData.toBcc, body: content}});
        }

        if (this.data.activities !== undefined && this.data.activities.length > 0) {
            this.data.activities[0].activities.unshift(
                {
                    created: {
                        fname: this.user.first_name,
                        lname: this.user.last_name,
                        date: new Date(),
                        time: 'Just now'
                    },
                    date: new Date(),
                    entry_id: this.data.id,
                    type_id: 0,
                    user_id: this.user.ID,
                    id: 0,
                    type: 'email',
                    description: '',
                    email: {
                        id: 0,
                        subject: subject,
                        from: this.emailData.sender,
                        to: this.emailData.to,
                        cc: this.emailData.toCc,
                        status: 'pending',
                        bcc: this.emailData.toBcc,
                        body: content
                    }
                }
            );
        }

        if (this.data.activities !== undefined && this.data.activities.length > 0) {
            this.filterActivities('email');
        }

        this.resetEmailForm();
        this.hideEmail();

        this.httpService.bulkActionsActivities(data).subscribe((res: any) => {
            if (this.data.activities !== undefined && this.data.activities.length > 0) {
                this.data.activities[0].activities.splice(0, 1, res);
                this.filterActivities('email');
            }
            this.localStore.set('entry_' + this.data.id, this.data);
        });
    }

    setEmailSender(event: any) {
      this.emailData.sender = event;
    }

    resetEmailForm() {
        this.emailData = {...this.defaultEmailData};
        this.emailData.to = this.data.row.email? this.data.row.email.split(',')[0]: '';
    }

    /**
     * Send email later with schedule
     */
    sendEmailLater() {
        this.sendEmail('email_schedule');
    }

    /**
     * Connect accounts with Google/Microsoft
     * @param type
     */
    connectAccount(type = 'google') {
        this.showLoadSetting = true;
        this.showLoadSettingBtnTxt = 'Getting connect accounts...';
        if(this.connectedEmails[type]?.connect_url) {
          const myWindow:any = window.open(this.connectedEmails[type]?.connect_url, '', 'width=700,height=800');

          const that = this;
          const timer = setInterval(function() {
              if(myWindow.closed) {
                  clearInterval(timer);
                  that.getEmailSettings(true);
              }
          }, 1000);
        }
    }

    getUserConnectedEmails() {
      const queryParam = '?tab=connect_email';
      this.httpService.getUserInfo(queryParam).subscribe((res: any) => {
        this.connectedEmails = res;
      });
    }

    processAttachment(input: any) {
        this.emailData.file = input.srcElement.files[0];
    }

    /**
     * Sort sub-boards array
     */
    subBoardSort(array: any) {
        return array.reverse();
    }

    consoleLog() {
        console.log('this.data', this.data);
        console.log('this.tabs', this.tabs);
        console.log('this.type', this.type);
        console.log('this.tab', this.tab);
        console.log('this.cols', this.cols);
    }

    hideSmsBox() {
        this.newActivityType = '';
        this.smsTo = '';
        this.smsContent = '';
    }

    hideNoteBox() {
        this.newActivityType = '';
        this.note = '';
        this.isNoteEdit = false;
    }

    createNote() {
        this.addActivity('note', 'John', 'Doe', 'Created note', 'just now', this.note);
        this.note = '';
        this.hideNoteBox();
    }

    ccShowHide() {
        this.acc = !this.acc;
    }

    bccShowHide() {
        this.bcc = !this.bcc;
    }

    hideEmail() {
        this.newActivityType = '';
    }

    addNewContact() {
        this.rowData.push({name: 'Michael Phelps', title: 'abc', phone: '12342533543', email: 'mail@new.com', industry: 'Tech', comment: 'This is a comment'});
        this.gridApi.setRowData(this.rowData);
    }

    sendSms(activityItem: any = false, index = 0, i = 0) {
        // Set default data
        let data = {action: 'send_sms', to: this.smsTo, body: this.smsContent, entry_id: this.data.id};

        // Handle existing threads for new replies
        if (activityItem) {
            data.body = activityItem.bodyReply;
            data.to = activityItem.type_id;

            if (data.body.trim() == '') {
                alert('Please enter message body.');
                return;
            }

            this.data.activities[index].activities[i].bodyReply = '';

            // add new sms reply to the tread
            this.data.activities[index].activities[i].sms
                .splice(
                    0,
                    0, {
                        user: {first_name: this.user.first_name, last_name: '', date: '', time: 'Just now', avatar: './assets/img/profile-dummy.jpeg'},
                        from: 'me',
                        to: data.to,
                        body: data.body,
                        date: new Date(),
                        type: 'outgoing'
                    }
                );
        } else {

            // Handle for new SMS threads
            this.data.activities[index].activities.unshift(
                {
                    date: new Date(),
                    entry_id: this.data.id,
                    type_id: this.smsTo,
                    user_id: this.user.ID,
                    id: 0,
                    type: 'sms',
                    description: this.smsContent,
                    bodyReply: '',
                    sms: [{
                        user: {first_name: this.user.first_name, last_name: '', date: '', time: 'Just now', avatar: './assets/img/profile-dummy.jpeg'},
                        from: 'me',
                        to: this.smsTo,
                        body: this.smsContent,
                        date: new Date(),
                        type: 'outgoing'
                    }]
                }
            );
        }

        // Set filter for SMS
        this.filterActivities(this.newActivityType);
        this.smsTo = this.smsContent = '';

        this.httpService.bulkActionsActivities(data).subscribe((response: any) => {
            if (activityItem) {
                this.data.activities[index].activities[i] = response;
            } else {
                this.data.activities[index].activities.splice(0, 1, response);
            }

            this.filterActivities(this.newActivityType);
        });
    }

    showConversation(monthIndex = 0, activityIndex = 0, convIndex = 0, type = 'activity') {
        if (type == 'activity') {
            this.data.activities[monthIndex].activities[activityIndex].email.conversations[convIndex].show = !this.data.activities[monthIndex].activities[activityIndex].email.conversations[convIndex].show;
        } else {
            this.data.inbox.conversations[convIndex].show = !this.data.inbox.conversations[convIndex].show;
        }
    }

    replyEmail(convIndex = -1) {
        if (convIndex < 0) {
            return;
        }

        this.emailReplyIndex = convIndex;
        this.emailData.to = this.data.inbox.conversations[convIndex].from;
        this.emailData.subject = 'Re: ' + this.data.inbox.subject;
        this.emailData.content = `<br><br><div class="atmos_quote">${this.data.inbox.conversations[convIndex].body}</div>"`;

        return false;
    }

    /**
     * Show limited text characters
     *
     * @param text
     * @param length
     */
    excerpt(text: string, length = 70) {
        if (text === undefined) {
            return '';
        }

        // remove html tags
        text.replace(/(<([^>]+)>)/gi, "");

        if (text.length > 70) {
            text = text.substring(0, 70) + "...";
        }

        return text;
    }

    onAddWidget(widget: string) {
        this.showWidgets = widget;
    }

    // toggle snooze for tasks
    onToggleSnooze(entry: any) {
        const data = {
            entry_id: entry.id,
            key: 'is_snoozed',
            content: entry.is_snoozed === 'no' ? 'yes' : 'no',
        };
        this.httpService.updateRowMeta(data).subscribe();
        const index = this.data.sub_boards.map((e: any) => e.type).indexOf('activity');
        index && this.data.sub_boards[index].entries.forEach((entry: any) => {
            if (entry.id === data.entry_id) {
                entry[data.key] = data.content;
            }
        });
    }

    // toggle complete status for tasks
    onToggleComplete(entry: any) {
        const data = {
            entry_id: entry.id,
            key: 'is_completed',
            content: entry.is_completed === 'no' ? 'yes' : 'no',
        };
        this.httpService.updateRowMeta(data).subscribe();
        const index = this.data.sub_boards.map((e: any) => e.type).indexOf('activity');
        index && this.data.sub_boards[index].entries.forEach((entry: any) => {
            if (entry.id === data.entry_id) {
                entry[data.key] = data.content;
            }
        });
    }

    // add subscriber
    addSubscriber(userID: any) {
       let data = {
        user_id: userID,
        type: '',
        entity_type: 'entry',
        entity_id: this.data.id
       }

       // set loader
       this.isAddingSubscriber = true;

       this.httpService.addSubscriber(data).subscribe((res: any) => {
            if(res) {
                this.subscribers = res;

                // reset input field
                this.filterUser = '';

                // remove loader
                this.isAddingSubscriber = false;

                // reset subscriber ids
                this.subscribersIds = [];

                // add subscribers ids
                for (let key in this.subscribers) {
                    this.subscribersIds.push( this.subscribers[ key ].user_id );
                }
            }
        });
    }

    // get subscribers
    getSubscribers() {

      if(this.data.id) {
        const data = {
            entity_type: 'entry',
            entity_id: this.data.id
           }
        this.httpService.getSubscribers(data).subscribe((res: any) => {
            if(res) {
                this.subscribers = res;

                // remove loader
                this.loadingSubscribers = false;

                // reset subscriber ids
                this.subscribersIds = [];

                // add subscribers ids
                for (let key in this.subscribers) {
                    this.subscribersIds.push( this.subscribers[ key ].user_id );
                }
            }
        });
      }
    }

    setSubscriberAsOwner(userId: any, type = '', index: number) {
      let count = 0;
      this.subscribers.forEach((ele: any) => {
        ele?.type === 'owner' && count++;
      });

      if(userId && (type === 'owner' || (type === '' && count > 1))) {
        const data = {
          entity_type: 'entry',
          entity_id: this.data.id,
          type,
          user_id: userId,
        }

        this.subscribers[index].type = type;

        this.httpService.addNotificationSubscriber(data).subscribe((res: any) => {
          this.subscribers = res;
        });
      }
    }

    // convert subscriber short name
    getShortName(subscriber: any) {
        if( subscriber == undefined || !subscriber ) {
            return '';
        }
        if( !isNaN( subscriber ) ) {
            const user = this.users?.filter( ( userObj: any ) => {
                return userObj.ID == subscriber;
              } );
            return user[0]?.fname?.substring(0, 1) + user[0]?.lname?.substring(0, 1);
        } else {
            return subscriber?.user?.fname?.substring(0, 1) + subscriber?.user?.lname?.substring(0, 1);
        }
    }

    // delete subscriber
    deleteSubscriber(subscriberID: any) {

        // remove subscriber from
        const subscribers = this.subscribers;
        this.subscribers = subscribers.filter( ( subscriber: any ) => {
            return subscriber.id != subscriberID;
        } );

        this.httpService.deleteSubscriber(subscriberID).subscribe((res: any) => {
            if(res) {
                this.subscribers = res.subscribers;

                // reset subscriber ids
                this.subscribersIds = [];

                // add subscribers ids
                for (let key in this.subscribers) {
                    this.subscribersIds.push( this.subscribers[ key ].user_id );
                }
            }
        });
    }

    // return filtered users to subscribers selection
    updateSubscriberOptions() {
        this.subscriberOptions = this.users.filter( ( user: any ) => {
            if( this.subscribersIds.includes( user.ID ) ) {
                return false;
            }

            const searchTerm = this.filterUser.toLowerCase();

            // filter by search input
            if( searchTerm
                && user.display_name.toLowerCase().indexOf( searchTerm ) < 0
                && user.full_name.toLowerCase().indexOf( searchTerm ) < 0
                && user.fname.toLowerCase().indexOf( searchTerm ) < 0
                && user.lname.toLowerCase().indexOf( searchTerm ) < 0
                && user.user_email.toLowerCase().indexOf( searchTerm ) < 0
            ) {
                return false;
            }

            return true;
        } );
    }

    // trigger email media buttons
    triggerMedia( type: any ) {

        // select the more options button
        this.clickMore = document.querySelector("[title='More...'");

        switch ( type ) {

            // click preview button for email body
            case 'preview':
                this.clickPreview = document.querySelector("[title='Preview']");
                if( !this.clickPreview ) {
                    this.clickMore.click();
                    setTimeout( () =>{
                        this.clickPreview = document.querySelector("[title='Preview']");
                        this.clickPreview?.click();
                        this.clickMore?.click();
                    }, 10 );
                } else {
                    this.clickPreview?.click();
                }
            break;

            case 'image':
                this.clickImage = document.querySelector("[title='Insert/edit image']");
                if( !this.clickImage ) {
                    this.clickMore.click();
                    setTimeout( () =>{
                        this.clickImage = document.querySelector("[title='Insert/edit image']");
                        this.clickImage?.click();
                        this.clickMore?.click();
                    }, 10 );
                } else {
                    this.clickImage?.click();
                }
            break;

            case 'media':
                this.clickMedia = document.querySelector("[title='Insert/edit media']");
                if( !this.clickMedia ) {
                    this.clickMore.click();
                    setTimeout( () =>{
                        this.clickMedia = document.querySelector("[title='Insert/edit media']");
                        this.clickMedia?.click();
                        this.clickMore?.click();
                    }, 10 );
                } else {
                    this.clickMedia?.click();
                }
            break;
        }
    }

    // generate company website
    companyWebsite( type: any ) {
        let website = this.data?.row?.website;
        if( website != undefined && website ) {
            website = website.split( ',' );
            if( type == 'link' ) {
                return website[0];
            }
            if( type == 'anchor' ) {
                return ( website.length > 1 ) ? website[1] : website[0];
            }
        }
    }

    // list paragraph words
    limitWords( text = '', id: number = 0, words: number = 12 ) {

        // check if current note set to full view
        if( this.viewFullText == id ) {
            return text;
        }

        // check if text is missing
        if( !text ) {
            return '';
        }

        // convert paragraph to words array
        let wordsArray = text.split( ' ' );

        // check if paragraph is small enough
        if( wordsArray.length <= words ) {
            return text;
        }

        // get limited word from the words array
        wordsArray = wordsArray.slice( 0, ( words -1 ) );

        // convert words array to sentence
        text = wordsArray.join( ' ' ) + '...';

        return text;
    }

    // check if text is less
    getLessMoreTitle( text = '', id: number = 0, words: number = 12 ) {
        // check if current note set to full view
        if( this.viewFullText == id ) {
            return 'Show less';
        }

        // check if text is missing
        if( !text ) {
            return '';
        }

        // convert paragraph to words array
        let wordsArray = text.split( ' ' );

        // check if paragraph is small enough
        if( wordsArray.length <= words ) {
            return '';
        }

        return 'Show more';
    }

    // put user note in edit mode
    editUserNote( note: any ) {

        // check if note is present
        if( note ) {
            this.editingNote = note;
            this.isNoteEdit = true;
            this.editNote = this.editingNote.description;
        }
    }

    // update user note after editing
    updateNote() {

        // hide editing box after updating the note
        this.hideNoteBox();

        // update note in local store
        this.updateNoteLocal();
    }

    // delete user note
    deleteUserNote( id = 0 ) {

        // check if id is present
        if( id > 0 ) {

            // check if the note is in editing mode
            if( this.isNoteEdit && this.editingNote.id == id ) {

                // hide editing box
                this.hideNoteBox();
            }

            // delete user note
            this.deleteActivityLocal( id );

            // delete from the database
            this.httpService.deleteActivity( id ).subscribe( ( res: any ) => {} );
        }
    }

    // console log any thing using this function
    consoleLogItem( data: any ) {
        console.log( 'Log by function:', data );
    }

    // delete activity from local store
    deleteActivityLocal( id = 0 ) {

        let deleted = false;

        // find activity path
        for( let group = 0; group < this.data.activities.length; group++ ) {
            for( let rowKey = 0; rowKey < this.data.activities[group].activities.length; rowKey++ ) {
                if( this.data.activities[group].activities[rowKey].id == id ) {
                    // delete the activity
                    delete this.data.activities[group].activities[rowKey];
                    this.data.activities[group].activities = this.data.activities[group].activities.filter( ( activity: any ) => { return true; } );
                    deleted = true;
                    break;
                }
            }

            // if already deleted break the loop
            if( deleted ) {
                break;
            }
        }

        // update the data in local store
        this.localStore.set('entry_' + this.data.id, this.data);
    }

    // update activity in local store
    updateNoteLocal() {
        const id = this.editingNote.id;
        const text = this.editNote;

        let updated = false;

        // find activity path
        for( let group = 0; group < this.data.activities.length; group++ ) {
            for( let rowKey = 0; rowKey < this.data.activities[group].activities.length; rowKey++ ) {
                if( this.data.activities[group].activities[rowKey].id == id ) {

                    // update the activity
                    this.data.activities[group].activities[rowKey].description = text;
                    updated = true;
                    break;
                }
            }

            // if already updated break the loop
            if( updated ) {
                break;
            }
        }

        // update the data in local store
        this.localStore.set('entry_' + this.data.id, this.data);
    }

    onReady( editor: any ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        editor.execute( 'mention', { marker: '@', mention: '@John' } );
    }

  /**
  * upload file for editor
  */
  fileUpload( input: any ) {
    const files = input.srcElement.files;
    if (files.length) {
        let formData: any = new FormData();
        formData.append('action', 'upload');
        formData.append('type', 'file');
        formData.append('content', files[0]);

        this.httpService.uploadFile('crm-settings', formData).subscribe(( res: any ) => {

            if (res.status) {
                const url = res.data.url;
                const name = res.data.title;
                let fileHtml = '';
                if( this.isImage( url ) ) {
                    fileHtml = '<img src="' + url + '" alt="' + name + '" width="' + res.data.media_details.width + '" height="' + res.data.media_details.height + '">';
                } else {
                    fileHtml = '<a href="' + url + '">' + name + '</a>';
                }

                // add file or image to the editor
                this.ckEditor.setData(
                    this.ckEditor.getData() + fileHtml
                );

                // reset input field
                //input.target.value = '';
            }
        });
    }
  }

    // check if url is an image
    isImage( url = '' ) {
        return( url.match(/\.(jpeg|jpg|gif|png)$/) != null );
    }

    setActivityLogs() {
      this.setActivityLogUsers();
      this.filteredActivityLogs = this.data?.activityLog || [];
    }

    setActivityLogUsers() {
      const users = this.data?.activityLog?.map((activityLog: any) => {
        return {
          id: activityLog?.user_id,
          fName: activityLog?.created?.fname,
          lName: activityLog?.created?.lname,
        }
      });

      this.activityLogUsers = _.uniqBy(users, 'id')?.map((activityLogUser: any) => {
        let user = this.users.find((user: any) => {
          return user.ID === activityLogUser.id
        });
        activityLogUser.display_name = user?.display_name;
        return activityLogUser;
      });
    }


    filterActivityLogs(user: any) {
      if(this.activityLogUserFilter.id === user.id) {
        this.activityLogUserFilter = {};
        this.filteredActivityLogs = this.data?.activityLog || [];
      } else {
        this.activityLogUserFilter = user;
        const activityLogs = this.data?.activityLog && JSON.parse(JSON.stringify(this.data?.activityLog));
        this.filteredActivityLogs = activityLogs.filter((activityLog: any) => { return activityLog.user_id === user.id}) || [];
      }
    }

    updateEmailPreference(type = '') {
      let data = {
        type,
        entity_type: 'entry_email_pref',
        entity_id: this.data.id
      }

      this.httpService.addSubscriber(data).subscribe((res: any) => {
        if(res) {
          this.emailPreference = res?.[0];
        }
      });
    }

    // get email preference
    getEmailPreference() {
      if(this.data.id) {
        const data = {
          entity_type: 'entry_email_pref',
          entity_id: this.data.id
        }
        this.httpService.getSubscribers(data).subscribe((res: any) => {
          if(res) {
            this.emailPreference = res?.[0];
          }
        });
      }
    }

    openNotificationSettings() {
      this.router.navigate(['/my-profile'], {queryParams:{tab: 'notifications'}})
    }
  }
