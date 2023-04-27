import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {BoardsComponent} from '../boards/boards.component';
import {GlobalFunctionService} from '../global-function.service';
import {PopupsComponent} from '../popups/popups.component';
import {DateRange} from 'igniteui-angular';
import {HttpService} from '../http.service';
import * as moment from 'moment';
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-leads-common-renderer',
    templateUrl: './leads-common-renderer.component.html',
    styleUrls: ['./leads-common-renderer.component.scss']
})
export class LeadsCommonRendererComponent implements ICellRendererAngularComp {
    @ViewChild('pickerFrom') pickerFrom: any;
    @ViewChild('pickerTo') pickerTo: any;
    public dateRange: DateRange = {start: new Date(), end: new Date()};
    // public dateRange: DateRange = {start: new Date(), end: new Date()};
    // public dateRange: DateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() -7)) };
    public cellValue!: any;
    public siteUrl = environment.siteUrl;
    public voted = false;
    public cellData: any = '';
    public boardsComponent: any;
    public popupComponent: any;
    public editMode: boolean = false;
    public currentCell: string = '';
    public statusEdit = false;
    public newLabelHtml: boolean = false;
    public movedToContact: boolean = false;
    public commonInputItems: any = ['title', 'phone', 'text', 'address', 'city', 'state', 'zip', 'country', 'description', 'company'];
    public isSummaryRow = false;
    public isNewLead = false;
    public typeCol = 'text';
    public startDate = new Date();
    public showPalletPop = false;
    public rowIndex: any;
    public params: any;
    public suggestedItemsSearch: string = '';
    public dataEmail = '';
    public dataEmailName = '';
    public myDatePickerTo: any;
    public myDatePickerFrom: any;
    public groupIndex: any = 1;
    public gridApi: any;
    public placeHolderTxt = '+ Add new item';
    public parentIndex = 0;
    public groupId: any = 0;
    public rowId: any = 0;
    public showCopied = false;
    public editLabel = false;
    public colId = 0;
    public settings: any;
    public statuses: any = [];
    public selectedDate = '-';
    public totalDaysSelected = 0;
    public setMilestone = false;
    public progressPercentage = 0;
    public date = new Date();
    public temp: any;
    public entries: any = [];
    public linkAddress: string = '';
    public linkText: string = '';
    public colorPicker: string = '';
    public hour = '12:00';
    public isHourChanged = false;
    public products: any = [];
    public isMirror = false;

    public countryCodes = [{"country": "Afghanistan", "code": "93", "iso": "AF"},
        {"country": "Albania", "code": "355", "iso": "AL"},
        {"country": "Algeria", "code": "213", "iso": "DZ"},
        {"country": "American Samoa", "code": "1-684", "iso": "AS"},
        {"country": "Andorra", "code": "376", "iso": "AD"},
        {"country": "Angola", "code": "244", "iso": "AO"},
        {"country": "Anguilla", "code": "1-264", "iso": "AI"},
        {"country": "Antarctica", "code": "672", "iso": "AQ"},
        {"country": "Antigua and Barbuda", "code": "1-268", "iso": "AG"},
        {"country": "Argentina", "code": "54", "iso": "AR"},
        {"country": "Armenia", "code": "374", "iso": "AM"},
        {"country": "Aruba", "code": "297", "iso": "AW"},
        {"country": "Australia", "code": "61", "iso": "AU"},
        {"country": "Austria", "code": "43", "iso": "AT"},
        {"country": "Azerbaijan", "code": "994", "iso": "AZ"},
        {"country": "Bahamas", "code": "1-242", "iso": "BS"},
        {"country": "Bahrain", "code": "973", "iso": "BH"},
        {"country": "Bangladesh", "code": "880", "iso": "BD"},
        {"country": "Barbados", "code": "1-246", "iso": "BB"},
        {"country": "Belarus", "code": "375", "iso": "BY"},
        {"country": "Belgium", "code": "32", "iso": "BE"},
        {"country": "Belize", "code": "501", "iso": "BZ"},
        {"country": "Benin", "code": "229", "iso": "BJ"},
        {"country": "Bermuda", "code": "1-441", "iso": "BM"},
        {"country": "Bhutan", "code": "975", "iso": "BT"},
        {"country": "Bolivia", "code": "591", "iso": "BO"},
        {"country": "Bosnia and Herzegovina", "code": "387", "iso": "BA"},
        {"country": "Botswana", "code": "267", "iso": "BW"},
        {"country": "Brazil", "code": "55", "iso": "BR"},
        {"country": "British Indian Ocean Territory", "code": "246", "iso": "IO"},
        {"country": "British Virgin Islands", "code": "1-284", "iso": "VG"},
        {"country": "Brunei", "code": "673", "iso": "BN"},
        {"country": "Bulgaria", "code": "359", "iso": "BG"},
        {"country": "Burkina Faso", "code": "226", "iso": "BF"},
        {"country": "Burundi", "code": "257", "iso": "BI"},
        {"country": "Cambodia", "code": "855", "iso": "KH"},
        {"country": "Cameroon", "code": "237", "iso": "CM"},
        {"country": "Canada", "code": "1", "iso": "CA"},
        {"country": "Cape Verde", "code": "238", "iso": "CV"},
        {"country": "Cayman Islands", "code": "1-345", "iso": "KY"},
        {"country": "Central African Republic", "code": "236", "iso": "CF"},
        {"country": "Chad", "code": "235", "iso": "TD"},
        {"country": "Chile", "code": "56", "iso": "CL"},
        {"country": "China", "code": "86", "iso": "CN"},
        {"country": "Christmas Island", "code": "61", "iso": "CX"},
        {"country": "Cocos Islands", "code": "61", "iso": "CC"},
        {"country": "Colombia", "code": "57", "iso": "CO"},
        {"country": "Comoros", "code": "269", "iso": "KM"},
        {"country": "Cook Islands", "code": "682", "iso": "CK"},
        {"country": "Costa Rica", "code": "506", "iso": "CR"},
        {"country": "Croatia", "code": "385", "iso": "HR"},
        {"country": "Cuba", "code": "53", "iso": "CU"},
        {"country": "Curacao", "code": "599", "iso": "CW"},
        {"country": "Cyprus", "code": "357", "iso": "CY"},
        {"country": "Czech Republic", "code": "420", "iso": "CZ"},
        {"country": "Democratic Republic of the Congo", "code": "243", "iso": "CD"},
        {"country": "Denmark", "code": "45", "iso": "DK"},
        {"country": "Djibouti", "code": "253", "iso": "DJ"},
        {"country": "Dominica", "code": "1-767", "iso": "DM"},
        {"country": "Dominican Republic", "code": "1-809, 1-829, 1-849", "iso": "DO"},
        {"country": "East Timor", "code": "670", "iso": "TL"},
        {"country": "Ecuador", "code": "593", "iso": "EC"},
        {"country": "Egypt", "code": "20", "iso": "EG"},
        {"country": "El Salvador", "code": "503", "iso": "SV"},
        {"country": "Equatorial Guinea", "code": "240", "iso": "GQ"},
        {"country": "Eritrea", "code": "291", "iso": "ER"},
        {"country": "Estonia", "code": "372", "iso": "EE"},
        {"country": "Ethiopia", "code": "251", "iso": "ET"},
        {"country": "Falkland Islands", "code": "500", "iso": "FK"},
        {"country": "Faroe Islands", "code": "298", "iso": "FO"},
        {"country": "Fiji", "code": "679", "iso": "FJ"},
        {"country": "Finland", "code": "358", "iso": "FI"},
        {"country": "France", "code": "33", "iso": "FR"},
        {"country": "French Polynesia", "code": "689", "iso": "PF"},
        {"country": "Gabon", "code": "241", "iso": "GA"},
        {"country": "Gambia", "code": "220", "iso": "GM"},
        {"country": "Georgia", "code": "995", "iso": "GE"},
        {"country": "Germany", "code": "49", "iso": "DE"},
        {"country": "Ghana", "code": "233", "iso": "GH"},
        {"country": "Gibraltar", "code": "350", "iso": "GI"},
        {"country": "Greece", "code": "30", "iso": "GR"},
        {"country": "Greenland", "code": "299", "iso": "GL"},
        {"country": "Grenada", "code": "1-473", "iso": "GD"},
        {"country": "Guam", "code": "1-671", "iso": "GU"},
        {"country": "Guatemala", "code": "502", "iso": "GT"},
        {"country": "Guernsey", "code": "44-1481", "iso": "GG"},
        {"country": "Guinea", "code": "224", "iso": "GN"},
        {"country": "Guinea-Bissau", "code": "245", "iso": "GW"},
        {"country": "Guyana", "code": "592", "iso": "GY"},
        {"country": "Haiti", "code": "509", "iso": "HT"},
        {"country": "Honduras", "code": "504", "iso": "HN"},
        {"country": "Hong Kong", "code": "852", "iso": "HK"},
        {"country": "Hungary", "code": "36", "iso": "HU"},
        {"country": "Iceland", "code": "354", "iso": "IS"},
        {"country": "India", "code": "91", "iso": "IN"},
        {"country": "Indonesia", "code": "62", "iso": "ID"},
        {"country": "Iran", "code": "98", "iso": "IR"},
        {"country": "Iraq", "code": "964", "iso": "IQ"},
        {"country": "Ireland", "code": "353", "iso": "IE"},
        {"country": "Isle of Man", "code": "44-1624", "iso": "IM"},
        {"country": "Israel", "code": "972", "iso": "IL"},
        {"country": "Italy", "code": "39", "iso": "IT"},
        {"country": "Ivory Coast", "code": "225", "iso": "CI"},
        {"country": "Jamaica", "code": "1-876", "iso": "JM"},
        {"country": "Japan", "code": "81", "iso": "JP"},
        {"country": "Jersey", "code": "44-1534", "iso": "JE"},
        {"country": "Jordan", "code": "962", "iso": "JO"},
        {"country": "Kazakhstan", "code": "7", "iso": "KZ"},
        {"country": "Kenya", "code": "254", "iso": "KE"},
        {"country": "Kiribati", "code": "686", "iso": "KI"},
        {"country": "Kosovo", "code": "383", "iso": "XK"},
        {"country": "Kuwait", "code": "965", "iso": "KW"},
        {"country": "Kyrgyzstan", "code": "996", "iso": "KG"},
        {"country": "Laos", "code": "856", "iso": "LA"},
        {"country": "Latvia", "code": "371", "iso": "LV"},
        {"country": "Lebanon", "code": "961", "iso": "LB"},
        {"country": "Lesotho", "code": "266", "iso": "LS"},
        {"country": "Liberia", "code": "231", "iso": "LR"},
        {"country": "Libya", "code": "218", "iso": "LY"},
        {"country": "Liechtenstein", "code": "423", "iso": "LI"},
        {"country": "Lithuania", "code": "370", "iso": "LT"},
        {"country": "Luxembourg", "code": "352", "iso": "LU"},
        {"country": "Macao", "code": "853", "iso": "MO"},
        {"country": "Macedonia", "code": "389", "iso": "MK"},
        {"country": "Madagascar", "code": "261", "iso": "MG"},
        {"country": "Malawi", "code": "265", "iso": "MW"},
        {"country": "Malaysia", "code": "60", "iso": "MY"},
        {"country": "Maldives", "code": "960", "iso": "MV"},
        {"country": "Mali", "code": "223", "iso": "ML"},
        {"country": "Malta", "code": "356", "iso": "MT"},
        {"country": "Marshall Islands", "code": "692", "iso": "MH"},
        {"country": "Mauritania", "code": "222", "iso": "MR"},
        {"country": "Mauritius", "code": "230", "iso": "MU"},
        {"country": "Mayotte", "code": "262", "iso": "YT"},
        {"country": "Mexico", "code": "52", "iso": "MX"},
        {"country": "Micronesia", "code": "691", "iso": "FM"},
        {"country": "Moldova", "code": "373", "iso": "MD"},
        {"country": "Monaco", "code": "377", "iso": "MC"},
        {"country": "Mongolia", "code": "976", "iso": "MN"},
        {"country": "Montenegro", "code": "382", "iso": "ME"},
        {"country": "Montserrat", "code": "1-664", "iso": "MS"},
        {"country": "Morocco", "code": "212", "iso": "MA"},
        {"country": "Mozambique", "code": "258", "iso": "MZ"},
        {"country": "Myanmar", "code": "95", "iso": "MM"},
        {"country": "Namibia", "code": "264", "iso": "NA"},
        {"country": "Nauru", "code": "674", "iso": "NR"},
        {"country": "Nepal", "code": "977", "iso": "NP"},
        {"country": "Netherlands", "code": "31", "iso": "NL"},
        {"country": "Netherlands Antilles", "code": "599", "iso": "AN"},
        {"country": "New Caledonia", "code": "687", "iso": "NC"},
        {"country": "New Zealand", "code": "64", "iso": "NZ"},
        {"country": "Nicaragua", "code": "505", "iso": "NI"},
        {"country": "Niger", "code": "227", "iso": "NE"},
        {"country": "Nigeria", "code": "234", "iso": "NG"},
        {"country": "Niue", "code": "683", "iso": "NU"},
        {"country": "North Korea", "code": "850", "iso": "KP"},
        {"country": "Northern Mariana Islands", "code": "1-670", "iso": "MP"},
        {"country": "Norway", "code": "47", "iso": "NO"},
        {"country": "Oman", "code": "968", "iso": "OM"},
        {"country": "Pakistan", "code": "92", "iso": "PK"},
        {"country": "Palau", "code": "680", "iso": "PW"},
        {"country": "Palestine", "code": "970", "iso": "PS"},
        {"country": "Panama", "code": "507", "iso": "PA"},
        {"country": "Papua New Guinea", "code": "675", "iso": "PG"},
        {"country": "Paraguay", "code": "595", "iso": "PY"},
        {"country": "Peru", "code": "51", "iso": "PE"},
        {"country": "Philippines", "code": "63", "iso": "PH"},
        {"country": "Pitcairn", "code": "64", "iso": "PN"},
        {"country": "Poland", "code": "48", "iso": "PL"},
        {"country": "Portugal", "code": "351", "iso": "PT"},
        {"country": "Puerto Rico", "code": "1-787, 1-939", "iso": "PR"},
        {"country": "Qatar", "code": "974", "iso": "QA"},
        {"country": "Republic of the Congo", "code": "242", "iso": "CG"},
        {"country": "Reunion", "code": "262", "iso": "RE"},
        {"country": "Romania", "code": "40", "iso": "RO"},
        {"country": "Russia", "code": "7", "iso": "RU"},
        {"country": "Rwanda", "code": "250", "iso": "RW"},
        {"country": "Saint Barthelemy", "code": "590", "iso": "BL"},
        {"country": "Saint Helena", "code": "290", "iso": "SH"},
        {"country": "Saint Kitts and Nevis", "code": "1-869", "iso": "KN"},
        {"country": "Saint Lucia", "code": "1-758", "iso": "LC"},
        {"country": "Saint Martin", "code": "590", "iso": "MF"},
        {"country": "Saint Pierre and Miquelon", "code": "508", "iso": "PM"},
        {"country": "Saint Vincent and the Grenadines", "code": "1-784", "iso": "VC"},
        {"country": "Samoa", "code": "685", "iso": "WS"},
        {"country": "San Marino", "code": "378", "iso": "SM"},
        {"country": "Sao Tome and Principe", "code": "239", "iso": "ST"},
        {"country": "Saudi Arabia", "code": "966", "iso": "SA"},
        {"country": "Senegal", "code": "221", "iso": "SN"},
        {"country": "Serbia", "code": "381", "iso": "RS"},
        {"country": "Seychelles", "code": "248", "iso": "SC"},
        {"country": "Sierra Leone", "code": "232", "iso": "SL"},
        {"country": "Singapore", "code": "65", "iso": "SG"},
        {"country": "Sint Maarten", "code": "1-721", "iso": "SX"},
        {"country": "Slovakia", "code": "421", "iso": "SK"},
        {"country": "Slovenia", "code": "386", "iso": "SI"},
        {"country": "Solomon Islands", "code": "677", "iso": "SB"},
        {"country": "Somalia", "code": "252", "iso": "SO"},
        {"country": "South Africa", "code": "27", "iso": "ZA"},
        {"country": "South Korea", "code": "82", "iso": "KR"},
        {"country": "South Sudan", "code": "211", "iso": "SS"},
        {"country": "Spain", "code": "34", "iso": "ES"},
        {"country": "Sri Lanka", "code": "94", "iso": "LK"},
        {"country": "Sudan", "code": "249", "iso": "SD"},
        {"country": "Suriname", "code": "597", "iso": "SR"},
        {"country": "Svalbard and Jan Mayen", "code": "47", "iso": "SJ"},
        {"country": "Swaziland", "code": "268", "iso": "SZ"},
        {"country": "Sweden", "code": "46", "iso": "SE"},
        {"country": "Switzerland", "code": "41", "iso": "CH"},
        {"country": "Syria", "code": "963", "iso": "SY"},
        {"country": "Taiwan", "code": "886", "iso": "TW"},
        {"country": "Tajikistan", "code": "992", "iso": "TJ"},
        {"country": "Tanzania", "code": "255", "iso": "TZ"},
        {"country": "Thailand", "code": "66", "iso": "TH"},
        {"country": "Togo", "code": "228", "iso": "TG"},
        {"country": "Tokelau", "code": "690", "iso": "TK"},
        {"country": "Tonga", "code": "676", "iso": "TO"},
        {"country": "Trinidad and Tobago", "code": "1-868", "iso": "TT"},
        {"country": "Tunisia", "code": "216", "iso": "TN"},
        {"country": "Turkey", "code": "90", "iso": "TR"},
        {"country": "Turkmenistan", "code": "993", "iso": "TM"},
        {"country": "Turks and Caicos Islands", "code": "1-649", "iso": "TC"},
        {"country": "Tuvalu", "code": "688", "iso": "TV"},
        {"country": "U.S. Virgin Islands", "code": "1-340", "iso": "VI"},
        {"country": "Uganda", "code": "256", "iso": "UG"},
        {"country": "Ukraine", "code": "380", "iso": "UA"},
        {"country": "United Arab Emirates", "code": "971", "iso": "AE"},
        {"country": "United Kingdom", "code": "44", "iso": "GB"},
        {"country": "United States", "code": "1", "iso": "US"},
        {"country": "Uruguay", "code": "598", "iso": "UY"},
        {"country": "Uzbekistan", "code": "998", "iso": "UZ"},
        {"country": "Vanuatu", "code": "678", "iso": "VU"},
        {"country": "Vatican", "code": "379", "iso": "VA"},
        {"country": "Venezuela", "code": "58", "iso": "VE"},
        {"country": "Vietnam", "code": "84", "iso": "VN"},
        {"country": "Wallis and Futuna", "code": "681", "iso": "WF"},
        {"country": "Western Sahara", "code": "212", "iso": "EH"},
        {"country": "Yemen", "code": "967", "iso": "YE"},
        {"country": "Zambia", "code": "260", "iso": "ZM"},
        {"country": "Zimbabwe", "code": "263", "iso": "ZW"}];
    subPopupType: any;
    public selectedPeople: any = {}
    private boardId: any;

    public numberColSettings = {
      unit: '',
      direction: '',
    }

    public phoneColSettings: any = {
      flag: '',
    };

    public voteColSettings: any = {
      barColor: '#FDAB3D',
    };

    public worldClockColSettings: any = {
      format:'12h',
      UtcOffset:'hide',
      startHours: '',
      endHours: '',
    };
    public worldClockCellValue: any = {
      time: '',
      name: '',
      isDayTime: false,
    };

    public colorPickerValue: string = '';

    constructor(boardsComponent: BoardsComponent, public globalFunctions: GlobalFunctionService, public popup: PopupsComponent, private httpService: HttpService) {
        this.boardsComponent = boardsComponent;
        this.popupComponent = popup;
        // this.dateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() +1)) };
    }




    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.currentCell = params.colDef?.field != undefined ? params.colDef?.field : '';
        this.typeCol = params.colDef?.cellRendererParams?.typeCol;
        this.colId = params.colDef?.cellRendererParams?.id;
        this.cellValue = this.getValueToDisplay(params);
        this.settings = params.colDef?.cellRendererParams.settings != undefined ? params.colDef?.cellRendererParams.settings : [];

        if (this.cellValue === undefined) {
            this.cellValue = '';
        }

        if (this.typeCol == 'status') {
            this.statuses = params.colDef?.cellRendererParams.statuses != undefined ? params.colDef?.cellRendererParams.statuses : [];
        }

        // Handle mirror columns
        this.fakeMirrorCol();

        try {
            this.settings = typeof this.settings == 'string' ? JSON.parse(this.settings) : this.settings;
        } catch (error) {
        }

        if (this.typeCol == 'date-range') {
            try {
                const value = typeof this.cellValue == 'string' ? JSON.parse(this.cellValue) : this.cellValue;
                this.dateRange = value.dateRange;
                this.setMilestone = value.setMilestone;
                this.setStartEndDate(this.dateRange);
            } catch (error) {
            }
        }

        if (this.typeCol == 'connect-boards') {
            this.getConnectedBoardEntries();
        }

        if (this.typeCol == 'numbers') {
          this.numberColSettings = params.colDef?.cellRendererParams.settings? JSON.parse(params.colDef?.cellRendererParams.settings) : { unit: '', direction: '' };
        }

        if (this.typeCol == 'vote') {
          this.voteColSettings = params.colDef?.cellRendererParams?.settings?.length? JSON.parse(params.colDef?.cellRendererParams?.settings)?.[0] : { barColor: '#FDAB3D' };
        }

        if (this.typeCol == 'phone') {
          this.phoneColSettings = params.colDef?.cellRendererParams.settings? JSON.parse(params.colDef?.cellRendererParams.settings) : { flag: '' };
        }

        if (this.typeCol == 'world-clock') {
          if(!(typeof params.colDef?.cellRendererParams.settings === 'object' && params.colDef?.cellRendererParams.settings !== null)) {
            this.worldClockColSettings = params.colDef?.cellRendererParams.settings? JSON.parse(params.colDef?.cellRendererParams.settings) : { format:'12h', UtcOffset:'hide', startHours: '', endHours: '' };
            this.setWorldClockCellValue();
          } else {
            this.worldClockColSettings = { format:'12h', UtcOffset:'hide', startHours: '', endHours: '' };
          }
        }

        if (this.typeCol == 'color-picker') {
          if(params.colDef?.cellRendererParams.settings && typeof params.colDef?.cellRendererParams.settings !== 'object') {
            let setting = JSON.parse(params.colDef?.cellRendererParams.settings);
            this.colorPickerValue = setting?.format === 'rgb'? this.hexToRgb(this.cellValue) : this.cellValue;
          } else {
            this.colorPickerValue = this.cellValue;
          }
        }

        if (this.typeCol == 'products') {
            this.setProducts();
        }

        if (this.typeCol == 'date') {
            if (this.cellValue) {
                this.myDatePickerFrom = this.cellValue;
            }
        }

        this.rowIndex = params.node.rowIndex;
        this.gridApi = params.api;

        if (this.typeCol == 'email') {
            this.cellValue = this.cellValue == undefined ? '' : this.cellValue;
            this.dataEmail = this.getEmailId();
            this.dataEmailName = this.getEmailName();
        }

        if (this.typeCol == 'link') {
            this.cellValue = this.cellValue || '';
            this.linkAddress = this.getLinkAddressOrText('link');
            this.linkText = this.getLinkAddressOrText('text');
        }

        if (this.typeCol == 'hour') {
            this.hour = this.cellValue || '12:00';
        }

        this.parentIndex = this.isSubItems() ? this.params.data.parentIndex : 0;

        this.getGroupId(this.params.eGridCell);

        if (this.isSubItems()) {
            this.placeHolderTxt = '+ Add new item'
        }
    }

    /**
     *  Fake mirror column to change its type
     */
    fakeMirrorCol() {
        if (this.typeCol !== 'mirror') {
            return;
        }

        this.isMirror = true;

        // Get fresh settings from board
        const settings = this.getSettings();

        // Check possible validation scenarios
        if (settings.column === undefined || settings.column.key === undefined || settings.connectedBoard === undefined || settings.boardColumn === undefined || settings.boardColumn === '') {
            return;
        }

        // this.settings = mirrorCol.settings != undefined ? mirrorCol.settings : [];
        this.typeCol = settings.column?.type;
        this.settings = settings.column?.settings;
        this.statuses = settings.column?.statuses != undefined ? settings.column?.statuses : [];
        this.currentCell = settings.column?.key != undefined ? settings.column?.key : '';

        const item = this.boardsComponent.getConnectedItemsById(settings.connectedBoard, this.params.data[settings.boardColumn]);
        if (item === undefined || item === false){

            // Try again after 1 second
            setTimeout(() => {
                this.fakeMirrorCol();
            }, 1000);
        }

        this.cellValue = item?.[settings.column?.key];
        this.rowId = item?.id;
        this.groupId = item?.group_id;
        this.boardId = settings.connectedBoard;
    }

    /**
     * Get mirror value based on its connected board and selected row
     */
    getMirrorValue() {
        const settings = this.getSettings();

        // Check possible validation scenarios
        if (settings.column === undefined || settings.column.key === undefined || settings.connectedBoard === undefined || settings.boardColumn === undefined || settings.boardColumn === '') {
            return;
        }

        // get value from connected board
        if (this.params.data[settings.boardColumn] === undefined || this.params.data[settings.boardColumn] === '') {
            return;
        }

        // Get connected board entry
        return this.boardsComponent.getConnectedItemsById(settings.connectedBoard, this.params.data[settings.boardColumn], settings.column.key);
    }

    getSettings() {
        // get settings from boards component column
        const column = this.boardsComponent.columns.find((col: any) => col.cellRendererParams.id == this.colId);

        if (column) {
            this.settings = column.cellRendererParams.settings;
        }

        try {
            this.settings = typeof this.settings == 'string' ? JSON.parse(this.settings) : this.settings;
        } catch (error) {
        }

        return this.settings;
    }

    // Get forecast value
    getForecastValue() {
        const dealValue = this.params?.data?.deal_value;
        const confidence = this.params?.data?.confidence;
        return parseFloat((dealValue * (confidence / 100)).toFixed(2)) || 0;
    }

    // get user name from id
    getUsername(user_id: string) {
        const user = this.boardsComponent.users.filter((user: any) => {
            return user.ID === user_id
        });
        return user[0]?.display_name || '';
    }

    // Get deal length value
    getDealLengthValue() {
        if (this.params?.data?.created?.date && this.params?.data?.close_date) {
            const createdDate = new Date(this.params?.data?.created?.date);
            const closeDate = new Date(this.params?.data?.close_date);
            const timeDifference = closeDate.getTime() - createdDate.getTime();
            const days = Math.round(timeDifference / (1000 * 3600 * 24));
            return days + ' Days';
        }
        return 'N/A'
    }

    // Get total price for invoice
    getTotalPrice() {
        const subTotal = parseFloat(this.params?.data?.subtotal) || 0;
        const discount = parseFloat(this.params?.data?.discount) || 0;
        const tax = parseFloat(this.params?.data?.tax) || 0;
        return subTotal - discount + tax;
    }

    // to open the date range popup for timeline column
    openDaterangePicker() {
        const eleId = 'daterangepicker-' + this.currentCell + '-' + this.rowId;
        const dateElm = document.getElementById(eleId);

        if (dateElm != null) {
            const dateInput = dateElm.querySelector('input');
            dateInput?.click();
        }
    }

    /**
     * Generate the entries from entry ids stored in cell value
     */
    getConnectedBoardEntries() {
        // Reset first to avoid duplicate entries
        this.entries = [];
        if (this.cellValue === undefined || this.cellValue === '') {
            return this.entries;
        }

        // Make number this.cellValue to string
        if (this.cellValue === null){
            this.cellValue = '';
        }

        this.cellValue = this.cellValue.toString();
        const entriesIds = this.cellValue.split(',');

        const connectedBoardId = this.getConnectedBoardId();

        for (let i = 0; i < entriesIds.length; i++) {
            const item = this.boardsComponent.getConnectedItemsById(connectedBoardId, entriesIds[i], 'item');
            if (item === undefined || item === false){

                // Try again after 1 second
                setTimeout(() => {
                    this.getConnectedBoardEntries();
                }, 1000);
            }
            this.entries.push(item);
        }

        /**
         * Load mirror value
         */

        // Get mirror columns
        // const mirrorCols = this.boardsComponent.columns.filter((col: any) => {
        //     if(col.cellRendererParams.typeCol === 'mirror'){
        //         try {
        //             col.cellRendererParams.settings = typeof col.cellRendererParams.settings == 'string' ? JSON.parse(col.cellRendererParams.settings) : col.cellRendererParams.settings;
        //         } catch (error) {
        //         }
        //
        //         console.log('settings', col.cellRendererParams.settings);
        //
        //         return connectedBoardId == col.cellRendererParams.settings?.connectedBoard;
        //     }
        //
        //     return false;
        // });
        //
        // for (let i = 0; i < mirrorCols.length; i++) {
        //     this.boardsComponent
        //         .getConnectedItemsById(connectedBoardId, entriesIds[0], mirrorCols[i]?.cellRendererParams?.settings?.column?.key)
        //         .then((item: any) => {
        //             // console.log('col cal', this.params.data, item, mirrorCols[i]?.cellRendererParams.settings?.column?.key);
        //
        //             this.params.data[mirrorCols[i].field] = item;
        //
        //             console.log('after', this.params.data[mirrorCols[i].field]);
        //
        //             //this.gridApi.updateRowData({add: [this.params.data[mirrorCols[i]]], addIndex: 0});
        //
        //             console.log('index', this.params.rowIndex);
        //
        //             // Get current row index
        //             // const rowIndex = this.boardsComponent.gridApi[0].getDisplayedRowAtIndex(this.params.rowIndex).rowIndex;
        //
        //             // this.gridApi.updateRowData({remove: [this.params.data]});
        //             this.boardsComponent.gridApi[0].updateRowData({update: [this.params.data]});
        //
        //             // const params = {
        //             //     force: true,
        //             //     suppressFlash: true,
        //             // };
        //             // this.gridApi.refreshCells(params);
        //         });
        // }

        // console.log('mirrorCols', mirrorCols);
    }

    getConnectedBoardId() {
        // const settings = this.that.settings;
        const settings = this.getSettings();
        if (settings.boards !== undefined && settings.boards.length > 0) {
            return settings.boards[0];
        }

        return 0;
    }

    /**
     * Get child rows count
     */
    getChildCount() {
        const subItems = this.params.data.subItems != undefined ? this.params.data.subItems : [];
        if (subItems.length > 0 && subItems[subItems.length - 1].item == '##add-new##') {
            return subItems.length - 1;
        }
        return subItems.length;
    }

    /**
     * Get address from location field
     * @param event
     */
    getAddress(event: any) {
        if (event.formatted_address != undefined) {
            this.cellValue = event.formatted_address;
            this.updateCell();
        }
    }

    /**
     * Format phone number
     *
     * @param rawNum
     */
    formatPhone(rawNum: any) {

        let countryCode: any = '';

        // Get country code out of the phone number first
        if (rawNum.charAt(0) == '+') {
            countryCode = this.getCountryImg(true);
            if (countryCode != '') {
                rawNum = rawNum.replace('+' + countryCode, '');
            }
        }

        // Remove first zero if it's there
        if (rawNum.charAt(0) == '0') {
            rawNum = rawNum.replace('0', '');
        }

        let newStr = "";
        let i = 0;

        // Add spaces after every 3rd number
        for (; i < Math.floor(rawNum.length / 3) - 1; i++) {
            newStr = newStr + rawNum.substr(i * 3, 3) + "-";
        }

        // Attach country code if there otherwise add zero in start of the number
        if (countryCode != '') {
            newStr = '+' + countryCode + ' ' + newStr;
        } else {
            newStr = '0' + '' + newStr;
        }

        // Finally return the number
        return newStr + rawNum.substr(i * 3);
    }

    /**
     * Get column drop down
     */
    getDropDown(all = false) {
        if (this.typeCol == 'dropdown') {
            let list = [...this.settings];

            if (!all) {
                // Search list
                if (this.suggestedItemsSearch !== '') {
                    list = list.filter((item: any) => item.toLowerCase().startsWith(this.suggestedItemsSearch.toLowerCase()));
                }

                // if already in array, then filter the array
                if (this.getSelectedItemsArray().length > 0) {
                    list = list.filter((item: any) => !this.getSelectedItemsArray().includes(item));
                }
            }

            return list;
        }

        return [];
    }

    /**
     * Check if matched with any item in drop down array list
     *
     * @param strItem
     */
    matchedDropDown(strItem: string = '') {
        if (strItem == '') {
            return false;
        }

        return this.getDropDown(true).filter((item: any) => item.toLowerCase().trim() == strItem.toLowerCase().trim()).length > 0;
    }

    /**
     * Create new drop down Item
     */
    createNewDropDownItem() {
        if (this.suggestedItemsSearch == '') {
            return;
        }

        if (this.matchedDropDown(this.suggestedItemsSearch)) {
            return;
        }

        if (this.settings == undefined || this.settings == '') {
            this.settings = [];
        }

        this.settings.push(this.suggestedItemsSearch);
        this.selectDropdown(this.suggestedItemsSearch);
        this.suggestedItemsSearch = '';
        this.saveSettings();
    }

    /**
     * Save column settings
     */
    saveSettings() {
        const dropDownOptions = this.settings == null ? [] : this.settings;
        let columns = this.isSubItems() ? this.boardsComponent.subColumns : this.boardsComponent.columns;
        const colIndex = columns.findIndex((col: any) => col.field == this.currentCell);
        columns[colIndex].cellRendererParams.settings = dropDownOptions;
        this.boardsComponent.setColSettings(this.colId, dropDownOptions, this.isSubItems());
        this.editLabel = false;
    }

    /**
     * Select drop down
     *
     * @param item
     */
    selectDropdown(item: string = '') {
        if (this.cellValue === undefined) {
            this.cellValue = '';
        }

        let selectedArr = this.cellValue.split(',');

        if (!selectedArr.includes(item)) {
            if (selectedArr.length == 1 && selectedArr[0] == '') {
                selectedArr[0] = item;
            } else {
                // If multiple selection is not allowed (currently forcefully disabled)
                selectedArr = [];
                selectedArr.push(item);
            }
        } else {
            selectedArr = selectedArr.filter((val: any) => val != item);
        }

        this.seItemsFromArr(selectedArr);
    }

    getLog() {
        console.log('log', this.getSettings());
    }

    getGroupId(event: any) {
        const parentWithClass = event.closest('ag-grid-angular');
        this.groupIndex = parentWithClass.getAttribute('data-groupindex');
        this.groupId = parentWithClass.getAttribute('data-groupid');
    }

    isSubItems() {
        const parentWithClass = this.params.eGridCell.closest('.ag-details-row');
        return parentWithClass !== null;
    }

    // gets called whenever the user gets the cell to refresh
    refresh(params: ICellRendererParams) {
        // set value into cell again
        // this.cellValue = '';
        return true;
    }

    editLeadTitle() {
        if (this.boardsComponent.isShowDetailPopup){
            this.boardsComponent.showDetailPopup(this.params.data);
            return;
        }
        this.editMode = true;
    }

    changeCheckbox(event: any) {
      if(event.target.checked) {
        this.cellValue = '1';
      } else {
        this.cellValue = '0';
      }
      this.updateCell();
    }

    editColumn(cellName: any) {
        this.editMode = true;
    }

    getEmailFieldArray() {
        return this.cellValue.split(',');
    }

    getEmailId() {
        const emailFieldVal = this.getEmailFieldArray();
        return emailFieldVal[0] != undefined ? emailFieldVal[0] : '';
    }

    getEmailName() {
        const emailFieldVal = this.getEmailFieldArray();
        return emailFieldVal[1] != undefined ? emailFieldVal[1] : '';
    }

    updateEmailData() {
      if(this.dataEmail || this.dataEmailName){
        this.cellValue = [this.dataEmail, this.dataEmailName].join(',');
        this.updateCell();
      }
    }

    updateLinkData() {
        this.cellValue = [this.linkAddress, this.linkText].join(',');
        this.updateCell();
    }

    updateColorData(color: string) {
        this.cellValue = color;
        this.updateCell();
    }

    getLinkAddressOrText(type: string) {
        if (type === 'link') {
            return this.cellValue.split(',')[0] || '';
        } else if (type === 'text') {
            return this.cellValue.split(',')[1] || '';
        }
        return '';
    }

    addNewRow() {
        if (this.cellData == '') {
            return;
        }

        const leadRow = {item: this.cellData, id: 0, created: {fname: '', lname: '', date: '', time: ''}};
        this.cellData = '';
        this.boardsComponent.setRowDataValue(this.groupIndex, this.groupId, leadRow, this.isSubItems(), this.parentIndex);
    }

    getSuggestedList() {
        let suggestedList: string[] = [];
        for (let i = 0; i < this.boardsComponent.dataTables[this.groupIndex].rows.length; i++) {
            if (this.boardsComponent.dataTables[this.groupIndex].rows[i][this.currentCell] != undefined && this.boardsComponent.dataTables[this.groupIndex].rows[i][this.currentCell] != '' && !suggestedList.includes(this.boardsComponent.dataTables[this.groupIndex].rows[i][this.currentCell])) {
                suggestedList.push(this.boardsComponent.dataTables[this.groupIndex].rows[i][this.currentCell]);
                if (suggestedList.length > 3) {
                    break;
                }
            }
        }

        return suggestedList;
    }

    selectSuggestedItem(item: string) {
        this.cellValue = item;
    }

    duplicateRow(withUpdates = false) {
        this.boardsComponent.duplicateRow(this.groupId, this.rowId, this.gridApi, withUpdates);
    }

    /**
     * Copy the value of the cell "item" to the clipboard
     */
    copyName() {
        this.dismissPopup();

        return this.copyText(this.params.data.item);
    }

    /**
     * Copy item link
     */
    copyItemLink() {
        this.dismissPopup();

        const itemLink = window.location.origin + this.siteUrl + 'boards/' + this.params.data.board_id + '/main/' + this.params.data.id;
        return this.copyText(itemLink);
    }

    /**
     * Copy text to clipboard
     *
     * @param text
     * @param showCopied
     */
    copyText(text = '', showCopied = false) {
        navigator.clipboard.writeText(text).then(() => {
            if (showCopied) {
                this.showCopied = true;
                const that = this;
                setTimeout(() => {
                    that.showCopied = false;
                }, 1500);
            }
        });
    }

    /**
     * Select persons
     *
     * @param UserId
     */
    selectPerson(UserId: any) {
        if (this.cellValue === undefined) {
            this.cellValue = '';
        }

        let selectedPersonsArr = this.cellValue.split(',');

        if (selectedPersonsArr.length == 1 && selectedPersonsArr[0] == '') {
            selectedPersonsArr[0] = UserId;
        } else {
            selectedPersonsArr.push(UserId);
        }

        this.seItemsFromArr(selectedPersonsArr);
    }

    /**
     * Get selected users
     */
    getSelectedPersons() {
        const selectedPersonsArr = this.getSelectedItemsArray();
        return this.boardsComponent.users.filter((o: { id: any; }) => selectedPersonsArr.includes(o.id));
    }

    /**
     * Get available and unused colors pallets
     */
    getAvailablePallets() {
        let availabelPallets = [...this.boardsComponent.colorPallets];

        for (let iStatus = 0; iStatus < this.statuses.length; iStatus++) {
            for (let iAvailable = 0; iAvailable < availabelPallets.length; iAvailable++) {
                if (availabelPallets[iAvailable] == this.statuses[iStatus].color) {
                    availabelPallets.splice(iAvailable, 1);
                }
            }
        }

        return availabelPallets;
    }

    /**
     * Remove status
     *
     * @param i
     */
    removeStatus(i = 0) {
        const status = {...this.statuses[i]};
        this.statuses.splice(i, 1);
        this.boardsComponent.removeStatus(status.id);
    }


    /**
     * Get selected users Array
     */
    getSelectedItemsArray() {
        return this.cellValue === undefined || this.cellValue == '' || typeof this.cellValue !== 'string' ? [] : this.cellValue.split(',');
    }

    /**
     * Remove selected items
     *
     * @param item
     */
    removeSelectedItem(item: string | number) {
        let selectedItemsArr = this.currentCell == 'people' ? this.getSelectedPersons() : this.getSelectedItemsArray();
        let index: number;

        if (this.currentCell == 'people') {
            index = selectedItemsArr.findIndex((o: { id: any; }) => o.id == item);
        } else {
            index = selectedItemsArr.findIndex((i: any) => i == item);
        }

        if (index > -1) {
            selectedItemsArr.splice(index, 1);
        }

        this.seItemsFromArr(selectedItemsArr);
    }

    /**
     * Set users in cell value
     *
     * @param array
     */
    seItemsFromArr(array: any) {
        this.cellValue = array.join(',');
        this.updateCell();
    }

    bulkActionsRows(action = '', where = '', groupId = 0, ids: any = 0) {
        this.boardsComponent.bulkActionsRows(action, where, groupId, ids);
    }

    /**
     * Get suggested users
     */
    getSuggestedUsers() {
        const selectedPersonsArr = this.getSelectedItemsArray();
        let suggestedUsers = this.boardsComponent.users.filter((o: { id: any; }) => !selectedPersonsArr.includes(o.id));

        // Search users from suggested list
        if (this.suggestedItemsSearch != '') {
            suggestedUsers = suggestedUsers.filter((o: { fname: string; lname: string }) => o.fname.toLowerCase().startsWith(this.suggestedItemsSearch.toLowerCase()) || o.lname.toLowerCase().startsWith(this.suggestedItemsSearch.toLowerCase()));
        }

        return suggestedUsers;
    }

    async pasteName() {
        this.dismissPopup();

        const text = await navigator.clipboard.readText();
        this.boardsComponent.updateItem(this.rowIndex, this.groupIndex, this.groupId, text, true);
    }

    /**
     * Move sub item from one parent row and group to others.
     *
     * @param newGroupId
     * @param newGroupIndex
     * @param newParentId
     * @param newParentIndex
     */
    changeParentRow(newGroupId = 0, newGroupIndex = 0, newParentId = 0, newParentIndex = 0) {
        this.boardsComponent.changeParentRow(newGroupId, this.groupIndex, newGroupIndex, this.rowId, this.rowIndex, this.parentIndex, newParentIndex, newParentId);
    }

    getStatusColor(cellValue: number) {
        if (this.boardsComponent.statuses[cellValue] === undefined || this.boardsComponent.colorPallets[this.boardsComponent.statuses[cellValue].color] === undefined) {
            return '';
        }

        return this.boardsComponent.colorPallets[this.boardsComponent.statuses[cellValue].color];
    }

    /**
     * Show status by ID
     * @param cellValue
     */
    getStatusById(id: number) {
        // get status based on id
        return this.statuses.find((o: { id: number; }) => o.id == id);
    }

    showDetailPopup() {
        this.boardsComponent.showDetailPopup(this.params.data);
    }

    //to set all functionality in date range
    setStartEndDate(date: any) {
        const stDate = new Date(this.dateRange.start);
        const getStDateMonth = stDate.toLocaleString('default', {month: 'short'});
        const getStDateDay = stDate.getDate();

        const endDate = new Date(this.dateRange.end);
        const getEndDateMonth = endDate.toLocaleString('default', {month: 'short'});
        const getEndDateDay = endDate.getDate();

        const currentDate = new Date();

        if(this.setMilestone) {
          this.selectedDate = getStDateMonth + ' ' + getStDateDay;
          const isFutureDate = moment(stDate).isAfter(currentDate);
          if(isFutureDate) {
            this.progressPercentage = 100;
          } else {
            this.progressPercentage = 0;
          }
        } else {
          this.selectedDate = getStDateMonth + ' ' + getStDateDay + ' - ' + getEndDateMonth + ' ' + getEndDateDay;
          // to calculate percentage of progress bar
          const a = moment(endDate);
          const b = moment(stDate);
          this.totalDaysSelected =a.diff(b, 'days');
          const totalDaysLeft = a.diff(moment(currentDate), 'days')+1;
          this.progressPercentage = Math.abs(((totalDaysLeft/this.totalDaysSelected)*100)-100);
        }

    }

    // check date range mileston and limit user to select sigle date
    checkMileStone() {
      this.dateRange.end = '';
      this.setStartEndDate(this.dateRange);
    }

    // clear date range
    clearDateRange() {
        this.selectedDate = '-';
        this.totalDaysSelected = 0;
        this.dateRange = {start: new Date(), end: new Date()};
        this.progressPercentage = 0;
        // todo: @umar also need to send request server to clear date from db
    }

    updateCell(empty = false) {
        if (this.typeCol == 'date-range') {
            const value = {
              setMilestone: this.setMilestone,
              dateRange: this.dateRange,
            }
            this.cellValue = JSON.stringify(value);
            this.setStartEndDate(this.dateRange);
        }

        if (this.typeCol == 'date') {
            const date = new Date(this.myDatePickerFrom).toISOString();
            this.cellValue = date;
        }

        if (empty && this.typeCol == 'email') {
          this.dataEmail = '';
          this.dataEmailName = '';
        }

        // reload again the entries to update the cell value
        if (this.typeCol == 'connect-boards') {
            this.getConnectedBoardEntries();

            // reload again the entries to update the cell value
            setTimeout(() => {
                this.boardsComponent.getBoardData();
            }, 10);
        }

        if (empty) {
            this.cellValue = '';

            if (this.typeCol == 'link') {
                this.linkAddress = '';
                this.linkText = '';
            }
        }

        if (this.typeCol == 'hour') {
            this.isHourChanged && (this.cellValue = this.hour);
        }

        if(this.currentCell === 'stage' && this.typeCol == 'status' && this.boardsComponent.boardData.type == 'opportunity') {
          this.boardsComponent.updateTopDeals();
        }

        if (this.isMirror) {
            const rowData = {board_id: this.boardId, group_id: this.groupId, entry_id: this.rowId, key: this.currentCell, content: '' + this.cellValue};

            this.boardsComponent.updateRowInDB(rowData, this.boardId);
        } else {
            this.boardsComponent.updateCell(this.cellValue, this.currentCell, this.groupIndex, this.rowIndex, this.parentIndex, this.isSubItems());
        }

        // update tags count if column is tags
        if (this.typeCol === 'tags') {
            this.boardsComponent.addTagCounting();
        }

        this.editMode = false;
    }

    updateLead() {
        const leadRow = {item: this.cellData, owner: '', status: '', createContact: '', email: '', title: '', company: '', phone: ''}
        this.boardsComponent.setRowDataValue(this.groupIndex, this.groupId, leadRow);
    }

    deleteRow(archive = false) {
        this.dismissPopup();
        this.boardsComponent.deleteRow(this.groupId, this.rowId, this.isSubItems(), 0, archive, this.gridApi);
    }

    buttonClicked() {
        alert(`${this.cellData} medals won!`);
    }

    getValueToDisplay(params: ICellRendererParams) {
        if (params.data.checkbox != undefined && params.data.checkbox == 'summary-row') {
            this.isSummaryRow = true;
        }

        if (params.data.item != undefined && params.data.item == '##add-new##') {
            this.isNewLead = true;
        }

        this.rowId = params.data.id;
        return params.valueFormatted ? params.valueFormatted : params.value;
    }

    showRightSidebar(event: string) {
        this.globalFunctions.rightSidebarShowHide(event);
    }

    editStatusLabel() {
        this.statusEdit = true;
    }

    addNewStatusLabel() {
        const availableColors = this.getAvailablePallets();

        if (availableColors.length == 0) {
            return;
        }

        const newStatusIndex = this.statuses.length;
        this.statuses.push({name: '', column_id: this.colId, color: availableColors[0]});

        this.boardsComponent.updateStatus(this.statuses[newStatusIndex]).subscribe((res: any) => {
            this.statuses[newStatusIndex] = res;
        });
    }

    updateStatusLabel(status: any, index: number) {
        this.boardsComponent.updateStatus(status).subscribe((res: any) => {
            this.statuses[index].id = res.id;
        });
    }

    /**
     * Get progress tracking
     */
    getProgressPercentage() {
        const settings = this.getSettings();
        let percentage = 0;
        if (settings && settings.statusCols !== undefined && settings.statusCols.length > 0) {
            for (let i = 0; i < settings.statusCols.length; i++) {
                // check if current column is enabled
                if (settings.statusCols[i].enabled == true || settings.statusCols[i].enabled == 1) {

                    // get the status ID and check if that status ID is marked as is_completed
                    if (this.params.data[settings.statusCols[i].key] !== undefined) {

                        // check if status is completed
                        const column = this.boardsComponent.columns.find((col: any) => col.field == settings.statusCols[i].key);
                        const status = column.cellRendererParams.statuses.find((status: any) => status.id == this.params.data[settings.statusCols[i].key] && status.is_completed == 1);

                        // then add its percentage to the total percentage
                        if (status !== undefined) {
                            percentage += settings.statusCols[i].percentage;
                        }
                    }
                }
            }
        }

        return percentage;
    }

    movedItemToContact() {
        this.movedToContact = true;
    }

    saveStatuses() {
        this.statusEdit = false;
    }

    /**
     * Update lead status
     *
     * @param index
     */
    selectStatus(index = 0) {
        this.cellValue = this.statuses[index].id;

        // Move to appropriate group based on status
        this.boardsComponent.updateGroupStatus(this.statuses[index], this.rowId, this.groupId);
        this.updateCell();

        // Trigger click event outside to close the popup
        const elem: HTMLElement = document.getElementsByClassName('ag-center-cols-viewport')[0] as HTMLElement;
        if (elem != null) {
            elem.click();
        }
    }

    /**
     * Select color to attach with a status
     *
     * @param i
     * @param color
     */
    selectColor(i = 0, color = '') {
        this.statuses[i].color = color;
        this.showPalletPop = false;
    }

    /**
     * Get color pallet index by color
     * @param color
     */
    getColorPalletIndexByColor(color = '') {
        for (let i = 0; i < this.boardsComponent.colorPallets.length; i++) {
            if (this.boardsComponent.colorPallets[i] == color) {
                return i;
            }
        }

        return false;
    }

    /**
     * Validate field
     * Accept on + symbol for country code and 0-9 numbers
     * @param event
     */
    validateField(event: any) {
        const charCode = (event.which) ? event.which : event.keyCode;
        switch (this.typeCol) {
            case 'phone':
                // Accept + symbol also
                if (charCode == 43) {
                    return true;
                }

                // Only Numbers 0-9
                if ((charCode < 48 || charCode > 57)) {
                    event.preventDefault();
                    return false;
                } else {
                    return true;
                }

            case 'numbers':
                // Accept - and . also
                if (charCode == 45 || charCode == 46) {
                    return true;
                }

                // Only Numbers 0-9
                if ((charCode < 48 || charCode > 57)) {
                    event.preventDefault();
                    return false;
                } else {
                    return true;
                }
        }

        return true;
    }

    /**
     * Get country image based on mobile number country code.
     */
    getCountryImg(getCountryCode = false) {
        if (this.cellValue[0] === '+') {
            for (let i = 0; i < this.countryCodes.length; i++) {
                if (this.cellValue.startsWith(this.countryCodes[i].code, 1)) {
                    if (getCountryCode) {
                        return this.countryCodes[i].code;
                    }
                    return this.countryCodes[i].iso.toLowerCase() + '.svg';
                }
            }
        }

        if (getCountryCode) {
            return '';
        }

        // Default country is USA
        return 'us.svg';
    }

    showPopup(event: any, type: any = false) {
        this.subPopupType = type;
        this.boardsComponent.showPopup(event, this);
    }

    expandSubItems() {
        this.boardsComponent.expandSubItems(this.groupIndex, this.rowIndex);
    }

    /**
     * Move row to top
     */
    moveToTop() {
        this.dismissPopup();
        this.boardsComponent.moveToTop(this.groupIndex, this.rowIndex);
    }

    /**
     * Move row to another group
     *
     * @param groupId
     * @param boardId
     */
    moveToGroup(groupId = 0, boardId = 0) {
        this.dismissPopup();

        // Move row to another group
        this.boardsComponent.moveToGroup(this.groupId, groupId, this.rowId);
    }

    /**
     * Get products count
     */
    getProductsCount() {
        try {
            return JSON.parse(this.cellValue).length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Set products
     */
    setProducts() {
        const products = this.cellValue ? JSON.parse(this.cellValue) : [];
        products.forEach((ele: any) => {
            this.products.push(ele[1]);
        });
    }

    // Check if value ia a number or not
    isNumber(value: any) {
        return !isNaN(value);
    }

    /**
     * File upload
     */
    fileUpload(input: any) {
        const files = input.srcElement.files;
        if (files.length) {
            let formData: any = new FormData();
            formData.append('action', 'upload');
            formData.append('type', 'file');
            formData.append('content', files[0]);

            this.httpService.uploadFile('crm-settings', formData).subscribe((res) => {
                if (res.status) {
                    const data = this.cellValue ? JSON.parse(this.cellValue) : [];
                    data.push({
                        name: res.data.name,
                        url: res.data.url
                    });
                    this.cellValue = JSON.stringify(data);
                    this.updateCell();
                }
            });
        }
    }

    /**
     * Get files
     */
    getFiles() {
        try {
            return this.cellValue ? JSON.parse(this.cellValue) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * remove file
     */
    removeFile(name: string) {
        const data: [] = this.cellValue ? JSON.parse(this.cellValue) : [];
        const temp = data.filter((ele: any) => ele.name != name);
        this.cellValue = JSON.stringify(temp);
        this.updateCell();
    }

    /**
     * Select tag for the cell field
     *
     * @param tagId
     */
    selectTag(tagId: 0) {
        const tags = this.cellValue.split(',');
        if (tags.includes(tagId.toString())) {
            tags.splice(tags.indexOf(tagId.toString()), 1);
        } else {
            if (tags[0] == '') {
                tags[0] = tagId.toString();
            } else {
                tags.push(tagId.toString());
            }
        }

        this.cellValue = tags.join(',');
        this.updateCell();
    }

    /**
     * Get selected tags for the cell field
     */
    getTags() {
        const tags = this.cellValue.split(',');
        let temp: any = [];
        tags.forEach((ele: any) => {
            const tag = this.boardsComponent.tags.find((tag: any) => tag.id == ele);
            if (tag) {
                temp.push(tag);
            }
        });

        return temp;
    }

    updateRating(value: string) {
      this.cellValue = value;
      this.updateCell();
    }

    updateVote() {
      this.cellValue = this.cellValue === '0'? '1': '0';
      this.updateCell();
    }

    setWorldClockCellValue() {
      if(this.cellValue) {
        const value: any = this.cellValue && JSON.parse(this.cellValue)?.[0];

        const date: any = new Date();
        let options: any = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: this.worldClockColSettings.format === '12h',
          timeZone: value?.timezone
        };

        this.worldClockCellValue.time = date.toLocaleString('en-US', options);
        this.worldClockCellValue.name = value.name;

        let hour: any = this.worldClockCellValue.time.split(':')?.[0];
        hour && (hour = Number(hour));

        this.worldClockCellValue.isDayTime = false;

        if(!options.hour12 && (hour > 5 && hour < 19)) {
          this.worldClockCellValue.isDayTime = true;
        } else if (options.hour12) {
          if((this.worldClockCellValue.time?.includes('AM') && (hour > 5 && hour < 12)) || (this.worldClockCellValue.time?.includes('PM') && (hour == 12 || (hour >= 1 && hour < 7)))) {
            this.worldClockCellValue.isDayTime = true;
          }
        }
      }
    }

    componentToHex(c: any) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(rgb: string) {
      const [r, g, b] = rgb.split('(')[1]?.split(')')[0]?.split(',');
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    hexToRgb(hex: string) {
      let regex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      if(regex.test(hex)) {
        const hexValue: any = hex?.split('#')?.[1];
        const aRgbHex: any = hexValue?.match(/.{1,2}/g);
        const aRgb: any = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ];
        return 'rgb(' + aRgb?.join(',') + ')';
      }
      return '';
    }

    updateColorPicker(event: any) {
      this.cellValue = event.target.value;
      this.updateCell();
    }

    private dismissPopup() {
        // Click on outer span ID 'outer-span' to hide the popup
        document.getElementById('outer-span')?.click();
    }
}
