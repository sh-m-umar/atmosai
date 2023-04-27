import { LocalService } from './../local.service';
import { HttpService } from './../http.service';
import {Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import * as ClassicEditor from 'src/app/right-sidebar-tray/ckeditor-build';
import { CacheService } from '../cache.service';
import { TIME_ZONES } from '../constants/time-zones.const';
import { lastValueFrom } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-popups',
    templateUrl: './popups.component.html',
    styleUrls: ['./popups.component.scss']
})
export class PopupsComponent implements OnInit {
    @Input() popupevent: any;
    @Input() data: any;
    @Input() header: any;
    public that: any;
    manuallySession = false;
    contactDetails = false;
    recurringOptions = false;
    meetingOptions = false;
    public suggestedUserSearch: any = '';
    public dropPosition = false;
    public dropPositionH = false;
    public selectedBoardIndex: any = false;
    public cordX: any = 0;
    public cordY: any = 0;
    public temp: any = 0;
    public searchTxt = '';
    public dropPos: any = 0;
    public dropPosH: any = 0;
    public ClassicEditor: any = ClassicEditor;
    newSocial = false;
    connectNewBoards = false;
    mirrorItems = [
        {img: './assets/img/atmosai-status.png', name: 'Status', bg: '#10de80'},
        {img: './assets/img/atmosai-people.png', name: 'People', bg: '#a358df'},
        {img: './assets/img/atmosai-numbers.png', name: 'Number', bg: '#ffcc01'},
        {img: './assets/img/atmosai-timeline.png', name: 'Timeline', bg: '#a358df'},
        {img: './assets/img/atmosai-data.png', name: 'Date', bg: '#00d0f4'},
        {img: './assets/img/atmosai-text.png', name: 'Text', bg: '#00a9ff'},
    ];

    colors = [
        'rgb(0, 200, 117)',
        'rgb(156, 211, 38)',
        '#CAB641',
        'rgb(255, 203, 0)',
        'rgb(120, 75, 209)',
        'rgb(162, 93, 220)',
        'rgb(0, 134, 192)',
        'rgb(51, 11, 11)',
        'rgb(87, 155, 252)',
        'rgb(102, 204, 255)',
        'rgb(187, 51, 84)',
        'rgb(226, 68, 92)',
        'rgb(255, 21, 138)',
        'rgb(255, 90, 196)',
        'rgb(255, 100, 46)',
        'rgb(253, 171, 61)',
        'rgb(127, 83, 71)',
        'rgb(196, 196, 196)',
        'rgb(128, 128, 128)',
        'rgb(0, 200, 117)',
    ];

    public connectBoardData:any = false;

    public inviteObject: any = { emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false, isSent: false };
    public modules: any[] = [];
    public menuItems: any[] = [];

    public numberColSettingsBit = true;
    public numberColSettings: any = {
      unit: 'none',
      direction: 'L',
    }
    public phoneColSettingsBit = true;
    public phoneColSettings: any = {
      flag: 'show',
    };

    public voteColSettingsBit = true;
    public voteColSettings: any = {
      barColor: '#FDAB3D',
    };

    public worldClockSettingsBit = true;
    public worldClockSettings = {
      format:'12h',
      UtcOffset:'hide',
      startHours: '',
      endHours: '',
    }

    public autoNumberSettingsBit = true;
    public autoNumberSettings = {
      scope: 'group',
      prefix: '$',
      font: 'bold',
      order: 'descending',
    }

    public colorPickerSettingsBit = true;
    public colorPickerSettings = {
      format: 'hex',
    }

    public timeZones = TIME_ZONES;
    public timeZoneText: string = '';
    public filteredTimeZones: Array<any> = this.timeZones;
    public editTagsBit = false;
    public editableTags:any = [];

    public moveEntryData: any = {
      rowIds: [],
      currentBoard: {},
      newBoard: {},
      newGroupId: '',
      showModal: false,
    }

    constructor(
      private httpService: HttpService,
      private localStore: LocalService,
      public cache: CacheService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.loadConnectedBoardData();
    }



    loadConnectedBoardData() {
        this.connectBoardData = false;
        if (this.that === undefined) {
            setTimeout(() => {
                this.loadConnectedBoards();
            }, 10);
        } else {
            this.loadConnectedBoards();
        }
    }

    loadConnectedBoards() {
        if (this.that?.typeCol !== 'connect-boards') {
            return;
        }

        const data = this.that.boardsComponent.getConnectedBoardById(this.getConnectedBoardId());

        if (data) {
            this.connectBoardData = data;
            return;
        } else {
            // load again after one second if data is not available
            setTimeout(() => {
                this.loadConnectedBoards();
            }, 1000);
        }
    }

    getCordX() {
        if (this.popupevent != undefined) {
            const dropPos = (screen.width - this.popupevent.target.getBoundingClientRect().x);
            this.dropPos = dropPos == screen.width ? this.dropPos : dropPos;
            let halfScreen = (screen.width / 2);

            this.dropPosition = this.dropPos < halfScreen;
            // this.dropPosition = false;
            this.cordX = this.popupevent.target.getBoundingClientRect().x <= 0 ? this.cordX : this.popupevent.target.getBoundingClientRect().x;
            return this.cordX;
        }
    }

    getCordY() {
        if (this.popupevent != undefined) {
          const dropPosH = (screen.height - this.popupevent.target.getBoundingClientRect().y);
          this.dropPosH = dropPosH == screen.height ? this.dropPosH : dropPosH;
          let halfScreen = (screen.height / 2);

          this.dropPositionH = this.dropPosH < halfScreen;

          this.cordY = this.popupevent.target.getBoundingClientRect().y <= 0 ? this.cordY : (this.popupevent.target.getBoundingClientRect().y + this.popupevent.target.getBoundingClientRect().height + 5);
          return this.cordY;
        }
    }

    getLog(log: any) {
        console.log('log', log);
    }

    showdata() {
        this.that = this.data;
        this.setNumberColSettings();
        this.setPhoneColSettings();
        this.setVoteColSettings();
        this.setWorldClockSettings();
        this.setAutoNumberSettings();
    }

    //open and close custom dropdown
    @HostListener('document:click', ['$event']) dropdownClickInOut(event: any) {
        const isDropDown = event.target.closest('.atmos-dropdown');
        const isDropDownBtn = event.target.closest('.atmos-dropdown-btn');
        if (isDropDown == null && isDropDownBtn == null) {
            this.popupevent = undefined
        }
    }

    clearAllSelectedBoards() {
        this.that.selectedBoards = [];
    }

    /**
     * Set first board as selected and then show dropdown conditionally if there is more than one boards
     */
    getConnectedBoardId() {
        // const settings = this.that.settings;
        const settings = this.that.getSettings();
        if (settings.boards !== undefined && settings.boards.length > 0) {
            this.temp = settings.boards[0];
            return settings.boards[0];
        }

        return 0;
    }

    ngOnInit(): void {
      this.getData();
    }

    // table header status customization sorte status items
    statusSort(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.data.statuses, event.previousIndex, event.currentIndex);
      this.updateColumnStatuses(this.data.statuses);
    }

    updateColumnStatuses(statuses: any) {
      const data = {
        action: 'reorder',
        ids: statuses?.map((status: any) => status?.id)?.join(','),
      }

      this.httpService.updateColumnStatuses(data).subscribe();
    }

    getData() {
      this.getMenuItems();
    }

    openInNewTab(url: string) {
        const w = window.open(url, '_blank');
        if (w) {
            w.focus(); // okay now
        }
    }

    /**
     * Get tags based on search text and selected tags for the cell
     */
    getTags(all = false) {
        if (all) {
            return this.that.boardsComponent.tags;
        }

        // search t ags by name
        return this.that.boardsComponent.tags.filter((tag: any) => {
            const selectedTags = this.that.cellValue.split(',');
            return !selectedTags.includes(tag.id) && tag.tag_name.toLowerCase().startsWith(this.searchTxt.toLowerCase());
        });
    }

    /**
     * Create new tag
     */
    addNewTag() {
        if (this.searchTxt === undefined || this.searchTxt.trim() === '') {
            return;
        }
        this.that.boardsComponent.createTag(this.searchTxt.trim());
        this.searchTxt = '';
    }

    updateTag(tag: any) {
        this.that.boardsComponent.createTag(tag.tag_name, tag.id);
    }

    delteTag(id = 0) {
        // Delete editableTag
        this.editableTags = this.editableTags.filter((tag: any) => tag.id !== id);
        this.that.boardsComponent.deleteTag(id);
    }

    /**
   * toggle invite model
   */
    toggleInviteModel(state: Boolean) {
      this.inviteObject.showModal = state;
      !state && (this.inviteObject = { emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false });
      this.inviteObject.isSent = false;
    }

    getMenuItems(switchModule = false) {
      const local = this.localStore.get('menuItems');

      if (local) {
          this.modules = local;
      } else {
          this.httpService.getMenuItems().subscribe((data: any) => {
              this.modules = data;
          });
      }
    }

    onChangeInviteModules(event: any, product: any) {
      if(event.target.checked) {
        this.inviteObject.products.push(product.module);
      } else {
        const index = this.inviteObject.products.indexOf(product.module);
        this.inviteObject.products.splice(index, 1);
      }
    }

    onInviteSend(){
      if(!this.inviteObject.emails.length) {
        alert('Add email(s) to send invite(s).');
        return;
      }
      if(!this.inviteObject.products.length) {
        alert('Add product(s) to send invite(s).');
        return;
      }

      this.inviteObject.isLoading = true;

      const data: any = {
        emails: this.inviteObject.emails.join(','),
        products: this.inviteObject.products.join(','),
        user_kind: this.inviteObject.user_kind,
      }
      this.httpService.sendInvite(data).subscribe( (res: any) => {
        this.inviteObject.isLoading = false;
        this.inviteObject.isSent = true;
        // this.toggleInviteModel(false);
      });
    }

    setNumberColSettings() {
      if(this.numberColSettingsBit && this.that?.colParams?.settings.length) {
        this.numberColSettings = JSON.parse(this.that.colParams.settings);
        this.numberColSettingsBit = false;
      }
    }

    setOwnNumberColUnit(event: any) {
      if(event.target.value) {
        this.numberColSettings.unit = event.target.value;
        this.updateNumberColSettings();
      }
    }

    updateNumberColSettings() {
      const settings = JSON.stringify(this.numberColSettings);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    setPhoneColSettings() {
      if(this.phoneColSettingsBit && this.that?.colParams?.settings.length) {
        this.phoneColSettings = JSON.parse(this.that.colParams.settings);
        this.phoneColSettingsBit = false;
      }
    }

    updatePhoneColSettings() {
      const settings = JSON.stringify(this.phoneColSettings);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    setVoteColSettings() {
      if(this.voteColSettingsBit && this.that?.colParams?.settings.length) {
        this.voteColSettings = JSON.parse(this.that.colParams.settings)?.[0];
        this.voteColSettingsBit = false;
      }
    }

    updateVoteColSettings(color: string) {
      this.voteColSettings = {barColor: color};
      const settings = JSON.stringify([{barColor: color}]);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    setWorldClockSettings() {
      if(this.worldClockSettingsBit && this.that?.colParams?.settings.length) {
        this.worldClockSettings = JSON.parse(this.that.colParams.settings);
        this.worldClockSettingsBit = false;
      }
    }

    updateWorldClockSettings() {
      const settings = JSON.stringify(this.worldClockSettings);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    setAutoNumberSettings() {
      if(this.autoNumberSettingsBit && this.that?.colParams?.settings.length) {
        this.autoNumberSettings = JSON.parse(this.that.colParams.settings);
        this.autoNumberSettingsBit = false;
      }
    }

    updateAutoNumberSettings() {
      const settings = JSON.stringify(this.autoNumberSettings);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    setColorPickerSettings() {
      if(this.colorPickerSettingsBit && this.that?.colParams?.settings.length) {
        this.colorPickerSettings = JSON.parse(this.that.colParams.settings);
        this.colorPickerSettingsBit = false;
      }
    }

    updateColorPickerSettings() {
      const settings = JSON.stringify(this.colorPickerSettings);
      this.httpService.updateColumn({id: this.that.colId, settings}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.that.boardsComponent.boardId);
        this.that.boardsComponent.getBoardData();
      });
    }

    onTimeZoneInputChange() {
      const text = this.timeZoneText?.toLowerCase();
      if (text) {
        this.filteredTimeZones = this.timeZones.filter((timeZone: any) => {
          return timeZone.timezone?.toLowerCase().includes(text) || timeZone.name?.toLowerCase().includes(text);
        });
      } else {
        this.filteredTimeZones = this.timeZones;
      }
    }

    onSelectTimeZone(timeZone: any) {
      this.that.cellValue = JSON.stringify([timeZone]);
      this.that.setWorldClockCellValue();
      this.that.updateCell();
    }

    editTags(edit = true){
        this.editTagsBit = edit;

        // Build tags array
        this.editableTags = [];
        const tags = this.getTags(true);
        if(tags.length) {
            tags.forEach((tag: any) => {
                this.editableTags.push(tag);
            });
        }
    }

    async getBoardData(boardId: any) {
      const localBoard = this.cache.getBoardCache(boardId);

      if (localBoard ) {
        return localBoard;
      } else {
        const board$ = this.httpService.getSingleBoard(boardId);
        const response = await lastValueFrom(board$);

        return response;
      }
    }

    async onBoardSelect(board: any) {
      if(board.id) {
        this.moveEntryData.rowIds.push(this.data?.rowId);
        this.moveEntryData.currentBoard = this.data?.boardsComponent?.boardData;
        this.moveEntryData.newBoard = await this.getBoardData(board.id);
      }
    }

    onGroupSelect(group: any) {
      if(group.id) {
        this.moveEntryData.newGroupId = group.id;
        this.moveEntryData.showModal = true;
      }
    }

    closeMoveEntryModal() {
      this.moveEntryData = {
        rowIds: [],
        currentBoard: {},
        newBoard: {},
        newGroupId: '',
        showModal: false,
      }
    }

    copyToClipboard(text: string = '') {
      if(text) {
        navigator.clipboard.writeText(text).then(() => {});
      }
    }
}
