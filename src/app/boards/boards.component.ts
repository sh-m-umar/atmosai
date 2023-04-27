import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Event, Navigation, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {ColDef, FirstDataRenderedEvent, GridOptions, GridReadyEvent, IDetailCellRendererParams, IsRowSelectable, RowNode} from 'ag-grid-community';
import {LeadsCommonRendererComponent} from "../leads-common-renderer/leads-common-renderer.component";
import {GlobalFunctionService} from '../global-function.service';
import {LeadsHeaderRendererComponent} from "../leads-header-renderer/leads-header-renderer.component";
import {HttpService} from "../http.service";
import {LocalService} from "../local.service";
import {CacheService} from "../cache.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AppComponent} from "../app.component";
import {AgendaService, DayService, EventSettingsModel, MonthService, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import {environment} from "../../environments/environment";
import {BoardsFilterService} from "../boards-filter.service";
import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx';
import {Observable, of} from 'rxjs';
import {BoardService} from "../board.service";
import {FavoritesService} from "../favorites.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import {ModuleItemsService} from "../module-items.service";
import { NEW_COLUMNS } from '../constants/board-columns.const';
import {allColTypes, colTypes, tabsTypes, statuses, colorPallets, defaultCols, defaultSubCols, lastColumnAdd, hideMenuIcons, bulkEmailActionObj, permissions, boardTypeModel, kanBanOptions, newCol, mergeColumnKey} from "../constants/board-constants";

@Component({
    selector: 'app-boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.scss'],
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
    encapsulation: ViewEncapsulation.None
})
export class BoardsComponent implements OnInit, OnDestroy {
    myObserver:any = null;
    // @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
    @ViewChild('adFilter') adFilter!: ElementRef;
    public ganttData: Object[] = [];
    public showDashTray = false;
    isDownloading = false;
    public dashboardData: any = {panelIndex: 0};
    public ganttTaskSettings: object = {};
    public ganttEditSettings: object = {};
    listGridView = 'grid';
    boardDependencyMode = 'flexible';
    galleryActiveTab = 'gallery';
    headerCollapsed = false;
    selectedColor = 'red'
    sortAdded = false;
    public gridApi: any = [];
    public siteUrl = environment.siteUrl;
    public popupTrayType = 'entry-detail';
    public alignedGrids: any = [];
    public gridOptions: any = [];
    public selectTabPopup = 'overview';
    public detailRowHeight: any = [];
    public newColumns: any = NEW_COLUMNS;
    public newColumnsFilterText: string = '';
    public tabsTypes: any = tabsTypes;
    public loaded = false;
    isShowDetailPopup = false;
    addNewPipeline = false;
    filterStep = 1;
    isTabEdit: any = false;
    popupTrayItem: any;
    boardTypeForInvoiceForm: any = 'estimate';
    trayTabs: any = [];
    private searchFilter: {} = {where: '', condition: 'and', operator: '', value: ''};
    searchFilterArray: any = [{...this.searchFilter}];
    anglePos = 'down';
    showSelectionPopup: boolean = false;
    public selectedRows: any = [];
    isSrarch = false;
    public advanceFilter = false;
    quickFilter = false;
    newFilter = false;
    isSearchQuery = false;
    popupData: any;
    header: any;
    popupStyleData: any;
    public groupIndex: number = 0;
    public groupId: any = 0;
    public importStep = 1;
    public allBoards: any;
    public tab: any = '';

    public datePickerTo: any;
    public dateNumber: number = 1;
    public typeFilter = 'clear-view';
    public filterName = '';
    public filterSharingOpt: any = [];
    public selectedFilterColumn: any;
    public datePickerFrom: any;
    public usersInBoard: any = [];
    public selectedUserForFilter: string = '';
    public selectedColForSorting: any;
    public sortingTypeForCol: string = 'asc';
    public sortBit = false;
    public showColorPicker: any = {};
    public notifications: any = { type: ''};

    // Each Column Definition results in one Column.
    public rowSelection: 'single' | 'multiple' = 'multiple';
    public isRowSelectable: IsRowSelectable = (params: RowNode<any>) => {
        return !!params.data && (params.data.item != '##add-new##' && params.data.checkbox != 'summary-row');
    };

    public users: any = [];
    public colTypes:any = colTypes;
    public allColTypes:any = allColTypes;
    public statuses:any = statuses;
    public colorPallets = colorPallets;
    public availabelPallets: string[] = [];
    public defaultCols: ColDef[] = defaultCols;

    public lastColumnAdd: any = lastColumnAdd;

    public defaultSubCols: ColDef[] = defaultSubCols;


    // DefaultColDef sets props common to all Columns
    public defaultColDef = {
        cellRenderer: LeadsCommonRendererComponent,
        headerComponent: LeadsHeaderRendererComponent,
        editable: false,
        sortable: false,
        filter: true,
        resizable: true,
        minWidth: 50
    };
    public subColumns: ColDef[] = [];
    public detailCellRendererParams: any;
    public columns: ColDef[] = [];
    public dataTables: any = [];
    public defaultLastRow: any = {parentIndex: 0, checkbox: false, item: '##add-new##',};
    public summaryRow: any = {checkbox: 'summary-row'};
    public defaultSubItems = [{...this.defaultLastRow}];
    public defaultRow: any = [];
    public newCol: any = newCol;
    public scrollStep = 100;
    public boardId: any = 0;
    public boardData: any;
    public connectedBoardsData: any = [];
    private expandedRows: any = undefined;
    public tempVal = {isSubTable: false, api: false};
    private prevApp = '';
    public contentAvailableAreaHeight = 100;
    public connectedBoards: any = [];
    public kanBanOptions:any = kanBanOptions;
    public selectedOptionKanban = 'minimal';
    public pipelines: any = [];
    public selectedPipeline: any;
    public newPipelineObj: any = {};
    public autoCompleteColumnValue: string[] = [];
    public filteredColumns: any[] = [];
    public user = this.localStore.get('userData');
    public columnsHide: any = [];
    public columnsToHide: any = [];
    public hideAllCols = false;
    public isHiding = false;
    public tags: any[] = [];
    public isClearViewSaved = false;
    public hideMenuIcons: any = hideMenuIcons;
    public emailSettings: any = {email_templates: [], email_from: ''};
    public bulkSmsText: string = '';
    public bulkEmailActionObj:any = bulkEmailActionObj;
    public bulkEmailAction:any = {...this.bulkEmailActionObj};
    isAllBoards = false;
    public xlsData: any = [];
    public xlsColumnNames: any = [];
    public xlsFileName: string = '';
    public isXlsUploaded = false;
    public itemNameFromXlsData = {name: '', index: null};
    public xlsColumnsMap: any = {};
    public xlsColumnsMapUI: any = {};
    public mergeByMethod: string = 'new';
    public mergeColumnKey: any = mergeColumnKey;
    public isXlsImported = false;
    public columnData: any = [];
    public columnData2: any = [];
    public buttonCustomizationProperties: any = {};
    public buttonCustomizationProperties2: any = {};
    dragEntireRow = true;
    filtersGroup = true;
    filtersGroupbtn:any = '';
    public boardMember: string = '';
    public filteredUsers: Array<any> = [];
    public isAddingSubscriber: boolean = false;
    public subscriberOptions: any = [];
    public loadingSubscribers: boolean = true;
    public subscribers: any = [];
    public subscribersIds: any = []; // this property will be used to check if user is already in the subscribers
    public editBoardName = false;
    public editBoardDesc = false;
    public permissions: any = permissions;
    public allowedItems: any = [];
    public loadBoardSubscribers = false;
    public boardTypeModel:any = boardTypeModel;
    public connectedBoardIds:any = [];

    constructor(private appComponent: AppComponent,
                private boardService: BoardService,
                private localStore: LocalService,
                public cache: CacheService,
                public httpService: HttpService,
                private route: ActivatedRoute,
                public router: Router,
                public globalFunctions: GlobalFunctionService,
                private boardsFilterService: BoardsFilterService,
                public favorites: FavoritesService,
                private deviceService: DeviceDetectorService,
                private moduleService: ModuleItemsService
    ) {
        this.getAllBoards();
        this.prevApp = this.localStore.get('currentModuleIndex');

        let currentUrl = '';

        this.myObserver = router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show progress spinner or progress bar
                this.loaded = false;
            }

            if (event instanceof NavigationEnd) {
                // Call it once, it was calling twice/thrice on even leaving navigation
                if (currentUrl!== event.url) {
                    this.handleInit();
                }

                currentUrl = event.url;
            }

            if (event instanceof NavigationError) {
                // Hide progress spinner or progress bar
                // Present error to user
            }
        });

        this.openImportModal();
    }

    ngOnInit(): void {
        this.handleInit();
        this.detectDevice();
        this.getData();
    }

    ngOnDestroy() {
        this.myObserver.unsubscribe();
        const elem = document.getElementById('content-wrapper-body');
        elem?.classList.remove('board-page');
    }

    /**
     * File gallery inner modal tabs
     */
    galleryTab(tab:string = 'comments'){
        this.galleryActiveTab = tab;
    }

    /**
     * Handle init
     */
    handleInit(): void {
        this.boardId = this.route.snapshot.paramMap.get('id');
        this.tab = this.route.snapshot.paramMap.get('tab');
        this.tab = this.tab ? this.tab : 'main';

        // Add extra class to board wrapper if this is board table
        const elem = document.getElementById('content-wrapper-body');
        if (this.tab == 'main') {
            elem?.classList.add('board-page');
        } else {
            elem?.classList.remove('board-page');
        }

        const currentApp = this.localStore.get('currentModuleIndex');

        // Hide popup tray if it's open in case of app/module switch
        if (this.prevApp !== currentApp) {
            this.prevApp = currentApp;
            this.isShowDetailPopup = false;
        }

        this.getBoardData();
        this.getUsers();

        // get content area height
        this.contentAvailableAreaHeight = window.innerHeight - 250;
        this.initGanttScheduler();
        this.getFilterView();
    }

    //open all boards in popup
    openAllBoards(){
        this.isAllBoards = true;
    }

    // decect current device
    detectDevice(type = this.deviceService.getDeviceInfo().deviceType){
        if(type == 'tablet' || type == 'mobile'){
            this.dragEntireRow = false; // disable board tabls row drag
        }
        if(type == 'mobile'){
            this.filtersGroupbtn = type;
            this.filtersGroup = false;
        }
        return type;
    }

    toggleFilters(){
        console.log('filters', this.filtersGroup );
        this.filtersGroup = !this.filtersGroup;
    }

    openImportModal() {
      this.route.queryParams.subscribe((queryParams) => {
        if(queryParams['import'] && queryParams['import'] === 'leads') {
          setTimeout(() => {
            const importLeadsButton = document.getElementById('importLeadsButton');
            importLeadsButton?.click();
          }, 500);
        }
      });
    }

    getData() {
      this.getSubscribers();
    }

    setData() {
      this.setButtonCustomizationProperties();
      this.favorites.setFavoritesList();
      this.setHiddenColumns();
    }

    setButtonCustomizationProperties() {
      this.setButtonCols();
      this.buttonCustomizationProperties.selectedButton = this.buttonCustomizationProperties.buttonCols?.length? this.buttonCustomizationProperties.buttonCols[0] : [];
      this.buttonCustomizationProperties2.selectedButton = this.buttonCustomizationProperties2.buttonCols?.length? this.buttonCustomizationProperties2.buttonCols[0] : [];
    }

    setButtonCols(item = 1) {
      if(item === 1) {
        this.buttonCustomizationProperties.buttonCols = this.columns?.filter( (col: any) => col.cellRendererParams.typeCol === 'button');
      } else if (item === 2) {
        this.buttonCustomizationProperties2.buttonCols = this.columns?.filter( (col: any) => col.cellRendererParams.typeCol === 'button');
      }
    }

    setButtonSelect(button: any, item = 1) {
      if(item === 1) {
        this.buttonCustomizationProperties.selectedButton = button;
      } else if (item === 2) {
        this.buttonCustomizationProperties2.selectedButton = button;
      }
    }

    setButtonBoardProperty(board: any, item = 1) {
      if(item === 1) {
        this.buttonCustomizationProperties.newBoard = board;
        this.buttonCustomizationProperties.currentBoardColNames = this.boardData?.columns?.map((col: any) => {
          return {key: col.key, name: col.name, type: col.type}
        });
      } else if (item === 2) {
        this.buttonCustomizationProperties2.newBoard = board;
        this.buttonCustomizationProperties2.currentBoardColNames = this.boardData?.columns?.map((col: any) => {
          return {key: col.key, name: col.name, type: col.type}
        });
      }
    }

    filteredMapColumns(type: string, cols: any) {
      if(['status', 'connect-boards'].includes(type)) {
        return cols.filter( (col: any) => { return col.type === type } );
      }
      return cols;
    }

    selectItem(item = 1) {
      if(item === 1) {
        if(!this.buttonCustomizationProperties.newBoard) {
        this.buttonCustomizationProperties.showItems = false;
        alert('Select board first.');
        return;
        }
        this.buttonCustomizationProperties.showItems = true;
      } else if (item === 2) {
        if(!this.buttonCustomizationProperties2.newBoard) {
        this.buttonCustomizationProperties2.showItems = false;
        alert('Select board first.');
        return;
        }
        this.buttonCustomizationProperties2.showItems = true;
      }
    }

    mapButtonCols(item = 1) {
      if (item === 1) {
        this.buttonCustomizationProperties.showItems = false;
        this.buttonCustomizationProperties.mappedCols = Object.entries({...this.columnData}).map( (ele: any) => { return {newBoardCol: ele[0], currentBoardData: ele[1]} });
      } else if (item === 2) {
        this.buttonCustomizationProperties2.showItems = false;
        this.buttonCustomizationProperties2.mappedCols = Object.entries({...this.columnData}).map( (ele: any) => { return {newBoardCol: ele[0], currentBoardData: ele[1]} });
      }
    }

    onCancelButtonColMapping(item = 1) {
      if (item === 1) {
        this.buttonCustomizationProperties.showItems = false;
        this.resetButtonModal(1);
      } else if (item === 2) {
        this.buttonCustomizationProperties2.showItems = false;
        this.resetButtonModal(2);
      }
    }

    resetButtonModal(item = 1) {
      if (item === 1) {
        this.columnData = [];
      } else if (item === 2) {
        this.columnData2 = [];
      }
    }

    addButtonFunc() {
      this.buttonCustomizationProperties2.show = true;
    }

    removeButtonFunc(item: number) {
      this.resetButtonModal(item);
      this.buttonCustomizationProperties2.show = false;
    }

    onCreateAutomation() {
      const data: any = {};
      data.eventType = 'move-to-board';
      data.newBoard = this.buttonCustomizationProperties.newBoard?.type;
      data.mappedCols = this.buttonCustomizationProperties.mappedCols;

      const data2: any = {};
      data2.eventType = 'move-to-board';
      data2.newBoard = this.buttonCustomizationProperties2.newBoard?.type;
      data2.mappedCols = this.buttonCustomizationProperties2.mappedCols;

      const colId = this.buttonCustomizationProperties?.selectedButton?.cellRendererParams.id;

      const value = JSON.stringify([data, data2]);

      this.httpService.updateColumn({id: colId, settings: value}).subscribe((res: any) => {
        this.cache.reCacheBoardData(this.boardId);
      });
    }

    /**
    * Run button functionality from leads-common-renderer
   */
    onButtonClick(colId: any, rowId: any, groupId: any) {
      const column = this.columns?.find((col: any) => { return col.cellRendererParams.id === colId });
      const parsedData: any = column?.cellRendererParams?.settings? JSON.parse(column?.cellRendererParams?.settings) : '';
      const groupIndex = this.boardData.groups.findIndex((group: any) => { return group.id === groupId });

      if(parsedData.length && rowId && groupId) {
        const group = this.boardData?.groups?.find((group: any) => { return group.id === groupId });
        let row = group?.entries?.find((entry: any) => { return entry.id === rowId });

        parsedData.forEach( (data: any) => {
          const dataSet: any = {};

          if(data.eventType === "move-to-board") {
            data?.mappedCols?.forEach( (colData: any) => {
              let value = '';
              colData.currentBoardData?.forEach((val: any) => {
                if (val.key) {
                  value += row[val.key] || '';
                } else {
                  value += val.display;
                }
              });

            dataSet[colData.newBoardCol] = value;
            });

            // Check if there is a valid board type to copy data to
            if (data.newBoard !== undefined) {
                dataSet.action = 'add-full-entry';
                dataSet.board_type = data.newBoard;
                dataSet.item = dataSet.item || 'new';

                // delete row from current board UI
                this.gridApi[groupIndex].applyTransaction({remove: [row]});

                this.httpService.bulkActionsRows(dataSet).subscribe((res: any) => {
                    this.cache.reCacheBoardData(res.board_id, false);
                    row = group?.entries?.find((entry: any) => {
                        return entry.id === rowId
                    });

                    // Remove the row from the current board database
                    row && this.httpService.deleteRow(rowId).subscribe((del_res: any) => {
                        this.cache.reCacheBoardData(del_res.previous.board_id);
                    });
                });
            }
          }
        });
      }
    }

    // Switch pipeline for kanban view
    selectPipeline(pipeline: any) {
        this.selectedPipeline = pipeline;
    }

    /**
     * Create new pipeline for Kanban view
     */
    createNewPipeline() {
        if (this.newPipelineObj.color === undefined || this.newPipelineObj.color === '') {
            this.newPipelineObj.color = this.getAvailablePallets(this.pipelines)[0];
        }

        const statusColIndex = this.boardData.columns.findIndex((col: any) => col.key === 'pipeline');

        const newStatusIndex = this.boardData.columns[statusColIndex].statuses.length;
        this.boardData.columns[statusColIndex].statuses.push({
            id: 0,
            column_id: this.boardData.columns[statusColIndex].id,
            name: this.newPipelineObj.title,
            color: this.newPipelineObj.color,
        });

        // this.pipelines.push(this.boardData.columns[statusColIndex].statuses[newStatusIndex]);
        const pipelineNewIndex = this.pipelines.length - 1;

        this.cache.reCacheBoardData(this.boardId, false);

        this.updateStatus(this.boardData.columns[statusColIndex].statuses[newStatusIndex]).subscribe((res: any) => {
            this.boardData.columns[statusColIndex].statuses[newStatusIndex].id = res.id;
            this.pipelines[pipelineNewIndex].id = res.id;
        });

        this.newPipelineObj = {};
        this.addNewPipeline = false;
    }

    /**
     * Get search results groups/entries
     */
    searchFilterResults() {
        const completeFilters = this.searchFilterArray.filter((filter: any) => {
            return (filter.where && filter.condition && filter.operator && filter.value) || ['empty', 'not-empty', 'assigned', 'not-assigned', 'untouched'].includes(filter.operator);
        });

        if (completeFilters.length) {
            const localBoard = this.cache.getBoardCache(this.boardId);
            this.boardData.groups = this.boardsFilterService.applyFilter(localBoard.groups, this.boardData.columns, completeFilters);
            this.getBoardData(false, this.boardData);
        } else {
            this.getBoardData();
        }
    }

    applySearchFilter(input: any) {
        const text = input.target.value;
        let localBoard = this.cache.getBoardCache(this.boardId);
        this.boardData.groups = this.boardsFilterService.searchFilter(localBoard.groups, this.boardData.columns, text, {users: this.users});
        this.getBoardData(false, this.boardData);
    }

    // TODO: row drag/drop to other Grid work in progress
    // https://plnkr.co/edit/?open=app%2Fapp.component.ts&preview
    // https://ag-grid.com/angular-data-grid/drag-and-drop/#dragging-between-grids
    // https://www.ag-grid.com/angular-data-grid/row-dragging/#entire-row-dragging
    gridDragOver(event: any) {
        const dragSupported = event.dataTransfer.types.length;

        if (dragSupported) {
            event.dataTransfer.dropEffect = 'copy';
            event.preventDefault();
        }
    }

    gridDrop(event: any, i = 0) {
        alert();
        event.preventDefault();

        const jsonData = event.dataTransfer.getData('application/json');
        const data = JSON.parse(jsonData);

        // if data missing or data has no it, do nothing
        if (!data || data.id == null) {
            return;
        }

        // var gridApi = grid == 'left' ? this.leftGridOptions.api : this.rightGridOptions.api;
        const gridApi = i == 0 ? this.gridApi[0].api : this.gridApi[1].api;

        // do nothing if row is already in the grid, otherwise we would have duplicates
        const rowAlreadyInGrid = !!gridApi!.getRowNode(data.id);
        if (rowAlreadyInGrid) {
            console.log('not adding row to avoid duplicates in the grid');
            return;
        }

        const transaction = {
            add: [data],
        };
        gridApi!.applyTransaction(transaction);
    }

    addNewFilter() {
        // this.searchFilterResults();
        this.searchFilterArray.push({...this.searchFilter});
    }

    removeFilter(iFilter: number) {
        this.searchFilterArray.splice(iFilter, 1);
        this.searchFilterResults();
    }

    getFilterView() {
        let filterViewId: number = -1;
        this.route.params.subscribe((params: any) => {
            filterViewId = params['filterView'];
            if (filterViewId) {
                const localFilterView = JSON.parse(this.localStore.get('filterViews'));
                const filter = localFilterView.filter((view: any) => {
                    return view.id === filterViewId;
                });

                if (filter) {
                    this.searchFilterArray = JSON.parse(filter[0].query);
                    this.searchFilterResults();
                }
            }
        });
    }

    /**
     * Scroll table
     * @param event
     */
    onScroll(event: any) {
        const elem = document.querySelectorAll('.ag-center-cols-viewport');
        const elemContainer = document.querySelectorAll('.ag-center-cols-container');
        const elemLeftPinnedheader = document.querySelectorAll('.ag-pinned-left-header');
        let fakeScrollInner = document.querySelectorAll('.scroll-inner');
        if (elem[0] == null || elemContainer[0] == null || fakeScrollInner[0] == null || elemLeftPinnedheader[0] == null) {
            return;
        }

        const width = elemContainer[0].clientWidth + elemLeftPinnedheader[0].clientWidth;

        // set width of fake scrollbar
        fakeScrollInner[0].setAttribute('style', 'width: ' + width + 'px');

        if (event) {
            // set scroll position of fake scrollbar
            elem[0].scrollLeft = event.target.scrollLeft;
        }
    }

    setHiddenColumns() {
      let hide = false;
      this.columns?.forEach((col: any) => {
        if (!['action', 'checkbox', 'item', 'new'].includes(col.cellRendererParams.typeCol) && col.hide === true) {
          hide = true;
        }
      });
      this.hideAllCols = hide;
    }

    hideAllColumns(event: any) {
      if(event.target.checked) {
        this.columns?.forEach((col: any) => {
          if (!['action', 'checkbox', 'item', 'new'].includes(col.cellRendererParams.typeCol)) {
            col.hide = false
          }
        });
        this.hideAllCols = false;
      } else {
        this.columns?.forEach((col: any) => {
          if (!['action', 'checkbox', 'item', 'new'].includes(col.cellRendererParams.typeCol)) {
            col.hide = true
          }
        });
        this.hideAllCols = true;
      }
      this.saveColumnsToHide();
    }

    /**
     * Set Columns To Hide
     * Index -1 will be for hide all columns and specific index will be for hide specific column
     * @param index
     */
    setColumnsToHide(event: any, index = -1) {
      if (index === -1) {return}

      if(event.target.checked) {
        if (!['action', 'checkbox', 'item', 'new'].includes(this.columns[index].cellRendererParams.typeCol)) {
          this.columns[index].hide = false;
          this.columnsHide[index].hide = false;
        }
      } else {
        if (!['action', 'checkbox', 'item', 'new'].includes(this.columns[index].cellRendererParams.typeCol)) {
          this.columns[index].hide = true;
          this.columnsHide[index].hide = true;
        }
      }
      this.saveColumnsToHide();
    }

    /**
     * Hide columns
     */
    saveColumnsToHide(saveSettings = false) {
        if (saveSettings) {
            // Click on outer span ID 'outer-span' to hide the popup
            document.getElementById('outer-span')?.click();
        }

      this.columnsHide.forEach((ele: any, i: number) => {
        if(ele?.hide) {
          this.columnsToHide.push(i);
        }
      });

      this.columnsHide = [...this.columns];
      this.updateColsToGroups(this.columns);

      // Build array of Ids of only hidden columns
      let hiddenColumns = this.columns.map((column: any) => {
          if (column.hide) {
              return column.field;
          }

          return false;
      });

      hiddenColumns = hiddenColumns.filter((column: any) => {
          if (column) {
              return column;
          }
      });

      // Save settings
      if(saveSettings) {
        this.updateBoardSettings('hiddenCols', hiddenColumns);
      }
    }

    /**
     * Update board settings
     *
     * @param key
     * @param value
     */
    updateBoardSettings(key: any = false, value: any = false) {
        if (key && value) {
            this.boardData.settings[key] = value;
        }

        this.cache.setBoardCache(this.boardId, this.boardData);

        let settingsData = '';
        try {
            settingsData = JSON.stringify(this.boardData.settings);
        } catch (e) {
        }

        const data = {settings: settingsData};

        this.updateBoard(data);
    }

    updateBoard(data: any) {
        this.httpService.updateBoard(this.boardId, data)
            .subscribe((res: any) => {
            });
    }

    parseBoardSettings() {
        try {
            this.boardData.settings = JSON.parse(this.boardData.settings);
        } catch (e) {
        }

        if (this.boardData.settings === '') {
            this.boardData.settings = {};
        }
    }

    /**
     * Apply boards settings on board load
     */
    applyHiddenColumns() {
        if (this.boardData?.settings?.hiddenCols) {
            this.boardData?.settings?.hiddenCols.forEach((field: any) => {
                this.columns.forEach((col: any) => {
                    if (col.field === field) {
                        col.hide = true;
                    }
                });
            });
        }

        this.columnsHide = [...this.columns];
    }

    /**
     * Load all boards data
     */
    getAllBoards() {
        this.cache.getAllBoards().then((boards) => {
            this.allBoards = boards;
        });
    }

    logConsole() {
        console.log('all boards', this.allBoards);
        console.log('board data', this.boardData);
        console.log('board', this.dataTables);
        console.log('columns', this.columns);
        console.log('sub col', this.subColumns);
        console.log('sub boards', this.connectedBoardsData);
    }

    saveToClearView() {
        if (this.searchFilterArray[0].where && this.searchFilterArray[0].operator && this.searchFilterArray[0].value) {
            this.filterStep = 2;
        }
    }

    cancelSaveToClearView() {
        this.filterStep = 1;
    }

    getWhereCol(id = 0) {
        const columns = this.columns.find((col: any) => col.cellRendererParams.id == id);
        return columns ? columns.headerName : '';
    }

    selectFilterVal(val = 0, filterIndex = -1, key = '', column?: any) {
        this.selectedFilterColumn = column;
        this.searchFilterArray[filterIndex][key] = val;
        this.searchFilterArray[filterIndex].operator = 'is';
    }

    setFilterValue(data: any, iFilter: number, key: string, type = '') {
        !type && (this.searchFilterArray[iFilter][key] = data.target.value);

        if (type === 'next') {
            this.searchFilterArray[iFilter][key] = this.dateNumber + ',' + data.target.value;
        }

        if (type === 'is') {
            this.searchFilterArray[iFilter][key] = this.searchFilterArray[iFilter][key] ? this.searchFilterArray[iFilter][key] + ',' + data.target.value : data.target.value;
        }

        if (type === 'condition') {
            this.searchFilterArray.forEach((filter: any) => {
                filter[key] = data.target.value;
            });
        }

        this.searchFilterResults();
    }


    getColType(id: string) {
        const columns = this.columns.find((col: any) => col.cellRendererParams.id == id);
        return columns ? columns.cellRendererParams.typeCol : '';
    }

    setDateFilter(iFilter: number) {
        if (this.datePickerFrom && this.datePickerTo) {
            const dateCombination = this.datePickerFrom.toDateString() + ',' + this.datePickerTo.toDateString()
            this.searchFilterArray[iFilter].value = dateCombination;
            this.datePickerFrom = '';
            this.datePickerTo = '';
            this.searchFilterResults();
        }
    }

    clearFilters(getBoardData = true) {
        this.searchFilterArray = [{...this.searchFilter}];
        this.selectedFilterColumn = null;
        this.autoCompleteColumnValue = [];
        this.setFilterColumns();
        getBoardData && this.getBoardData();
    }

    setSharingOpt(data: any) {
        if (data.target.checked) {
            this.filterSharingOpt.push(data.target.value);
        } else if (!data.target.checked && this.filterSharingOpt.length) {
            this.filterSharingOpt = this.filterSharingOpt.filter((ele: any) => {
                return ele != data.target.value
            });
        }
    }

    onSaveToClearView() {
      if (this.filterName) {
        const data = {
          name: this.filterName,
                sharing: this.filterSharingOpt,
                board_id: this.boardId,
                query: JSON.stringify(this.searchFilterArray),
                sharing_users: '',
                type: this.typeFilter,
              }

              this.filterStep = 1;
              this.filterName = '';

              this.httpService.newFilterView(data).subscribe((res) => {
                this.isClearViewSaved = true;
                setTimeout(() => {
                    this.isClearViewSaved = false;
                }, 2000);
                const local = this.localStore.get('filterViews');
                let storedFilterViews = JSON.parse(local) || [];
                storedFilterViews.push(res);
                this.localStore.set('filterViews', JSON.stringify(storedFilterViews));
                this.appComponent.getFilterViews();
            });
        }
    }

    getBoardUsers() {
        let people: any = '';
        let peopleColsKeys: any = this.columns.filter((col: any) => {
            return col.cellRendererParams.typeCol === 'people';
        }).map((people: any) => {
            return people.field
        });

        let localBoard = this.cache.getBoardCache(this.boardId);

        localBoard.groups?.forEach((group: any) => {
            group.entries.forEach((entry: any) => {
                peopleColsKeys.forEach((key: string) => {
                    entry[key] && (people = people ? people + ',' + entry[key] : entry[key]);
                });
            })
        });

        people = people.split(',');
        people.length && (this.usersInBoard = this.getUsersById(people));
    }

    filterByPeople(user: any) {
        if (this.selectedUserForFilter !== user.ID) {
            this.selectedUserForFilter = user.ID
            let localBoard = this.cache.getBoardCache(this.boardId);
            this.boardData.groups = this.boardsFilterService.filterByPeople(localBoard.groups, this.boardData.columns, user);
            this.getBoardData(false, this.boardData);
        } else {
            this.selectedUserForFilter = '';
            this.getBoardData();
        }
    }

    /**
     * Get columns data for filters
     */
    getColumnData(id: string): string[] {
        const localBoard = this.cache.getBoardCache(this.boardId);
        const selectedFilterColumn: any = this.getColumnById(id);
        const data: string[] = [];
        localBoard?.groups?.forEach((table: any) => {
            table?.entries?.length && (table?.entries?.forEach((entry: any) => {
                entry[selectedFilterColumn?.key] && data.push(entry[selectedFilterColumn?.key]);
            }))
        });
        return data;
    }

    // Set filteredColumns for filter column dropdown
    setFilterColumns() {
        this.filteredColumns = this.columns.filter((col: any) => {
            return col.headerName;
        });
    }

    onColumnsTextChange(iFilter: number) {
        const text = this.autoCompleteColumnValue[iFilter].toLowerCase();
        if (text) {
            this.filteredColumns = this.columns.filter((col: any) => {
                return col.headerName.toLowerCase().includes(text);
            });
        } else {
            this.setFilterColumns();
        }
    }

    onColumnSelect(column: any, filterIndex: number) {
        this.searchFilterArray[filterIndex].where = column.cellRendererParams.id;
        this.searchFilterArray[filterIndex].operator = ['first-comm-date', 'latest-comm-date'].includes(column.cellRendererParams.typeCol) ? 'less-than' : 'is';
        this.setFilterColumns();
    }

    /**
     * Returns column by ID
     */
    getColumnById(id: string) {
        const column = this.boardData.columns.find((col: any) => {
            return col.id === id;
        });
        return column;
    }

    /**
     * Returns users by ID
     */
    getUsersById(ids: string[]) {
        const users = this.users.filter((user: any) => {
            return ids.includes(user.id);
        });
        return users;
    }

    /**
     * Returns tags by IDs
     */
    getTagsById(ids: string[]) {
      const tagIds: any[] = [];

      ids.forEach((id: any) => {tagIds.push(...id.split(','))});

      const tags = this.tags.filter((tag: any) => {
        return tagIds.includes(tag.id);
      });
      return tags;
    }

    /**
     * Returns statuses by ID
     */
    getStatusesById(colId: string) {
        const col = this.columns.find((col: any) => {
            return col.cellRendererParams.id === colId;
        });
        return col?.cellRendererParams.statuses;
    }

    /**
     * Add new item
     * @param param
     */
    newItem(param: any = false) {
        // open popup and return for templates on dashboard tab
        if (this.tab === 'dashboard') {
            this.showDashTemplatePopup();
            return;
        }

        switch (this.boardData.type) {
            case 'invoice':
            case 'estimate':
            case 'quote':
                this.showInvoicePopup(param);
                break;
            case 'email-templates':
                if (param == 'visual') {
                    window.open('/wp-admin/post-new.php?post_type=email_template', '_blank');
                } else if (param == 'text') {
                    this.showEmailTemplatesTray(param);
                }
                break;
            case 'activity':
                this.showNewActivityTray(param);
                break;
            case 'campaign-dialer':
                // open edit sequence page
                this.router.navigate(['campaigns/dialer']).then((data) => {
                });
                break;
            case 'broadcast':
            case 'sequence':
                // Navigate to page with query params
                this.router.navigate(['campaigns/email'], {queryParams: {type: this.boardData.type}}).then((data) => {
                });
                break;
            case 'campaign-sms':
                // open edit sequence page
                this.router.navigate(['campaigns/sms']).then((data) => {
                });
                break;
            case 'campaign-social':
                // open edit sequence page
                this.router.navigate(['campaigns/social']).then((data) => {
                });
                break;
            case 'campaign-advanced':
                // open edit sequence page
                this.router.navigate(['campaigns/advanced']).then((data) => {
                });
                break;
            case 'forms':
                // open edit sequence page
                this.router.navigate(['forms/edit-form']).then((data) => {
                });
                break;
            case 'landing-pages':
                // URL encode
                const encodedUrl = encodeURIComponent('boards/' + this.boardId + '/main');

                // navigate to page builder with query params
                this.router.navigate(['page-builder'], {queryParams: {ref: encodedUrl}});
                break;
            case 'segment':
                this.router.navigate(['marketing/new-segment']);
                break;
            case 'broadcast_sms':
                this.router.navigate(['campaigns/sms']);
                break;
            case 'sequence_email':
                this.router.navigate(['campaigns/edit-email-sequence']);
                break;
            case 'sequence_sms':
                this.router.navigate(['campaigns/edit-sms-sequence']);
                break;
            case 'promotional':
                this.router.navigate(['marketing/edit-promotional-email']);
                break;
        }
    }

    /**
     * Set tab to default
     *
     * @param index
     * @param isDefault
     */
    setTabToDefault(index = 0) {
        const currentDefaultIndex = this.boardData.tabs.findIndex((item: any) => item.is_default == 1);
        (currentDefaultIndex >= 0) && (this.boardData.tabs[currentDefaultIndex].is_default = 0);
        this.boardData.tabs[index].is_default = 1;
        const data = {id: this.boardData.tabs[index].id, is_default: 1};
        this.updateTabToDatabase(data, index);
    }

    /**
     * Rename tab title
     */
    renameTab(index = 0) {
        this.isTabEdit = false;
        const data = {id: this.boardData.tabs[index].id, title: this.boardData.tabs[index].title};
        this.updateTabToDatabase(data, index);
    }

    /**
     * Add new tab
     * @param item
     */
    addNewTab(item: any, mainTab = true) {
        const tabData = {id: 0, title: item.name, entity_type: 'board', slug: item.type, entity_id: this.boardId, type: item.type, icon: item.icon, is_default: 0};
        let index = -1;

        if (mainTab) {
            this.boardData.tabs.push(tabData);
            index = this.boardData.tabs.length - 1;
        } else {
            this.boardData.entry_tabs.push(tabData);
            index = this.boardData.entry_tabs.length - 1;
        }

        this.cache.setBoardCache(this.boardId, this.boardData);

        // create record in database
        const tabDataApi = {title: item.name, entity_type: 'board', entity_id: this.boardId, type: item.type, icon: item.icon, is_default: 0};
        this.updateTabToDatabase(tabDataApi, index);
    }

    /**
     * Get current tab type
     */
    getTabType() {
        const tabItem = this.boardData?.tabs?.find((item: any) => item.slug == this.tab);

        if (tabItem && tabItem.type != undefined) {
            return tabItem.type;
        }

        return 'main';
    }

    /**
     * Update tab to database
     * @param data
     * @param index
     */
    updateTabToDatabase(data: any, index = 0) {
        const boardId = this.boardId;
        this.httpService.updateTab(data).subscribe((res) => {
            this.boardData.tabs[index] = res;
            this.cache.setBoardCache(boardId, this.boardData);
        });
    }

    /**
     * Delete tab
     * @param tabIndex
     */
    deleteTab(tabIndex = 0) {
        // check that if this is default tab
        if (this.boardData.tabs[tabIndex].is_default == 1) {
            return;
        }

        // Delete from server database
        this.httpService.deleteTab(this.boardData.tabs[tabIndex].id).subscribe((res) => {
            this.cache.reCacheBoardData(this.boardId, false);
        });

        this.boardData.tabs.splice(tabIndex, 1);
    }

    getBoardTabsOptions() {
        return this.tabsTypes.filter((item: any) => {
            return item.boardType.includes(this.boardData?.type?.toLowerCase());
        });
    }

    /**
     * Perform bulk actions
     *
     * @param action
     * @param where
     * @param groupId
     * @param ids
     * @param boardId
     * @param map
     */
    bulkActionsRows(action = '', where = '', groupId = 0, ids: number | string = 0, boardId = 0, map = '') {
        let data = {action: action, where: where, group_id: groupId, board_id: boardId !== 0 ? boardId : this.boardId, ids: ids, map: map};
        this.httpService.bulkActionsRows(data).subscribe((res: any) => {
            if (action === 'move' && where === 'group') {
                if (boardId !== 0) {
                    this.cache.reCacheBoardData(boardId);
                }
                this.getBoardData();
            }

            this.cache.reCacheBoardData(this.boardId);
        });
    }

    /**
     * Move row to different group
     * @param currentGroupId
     * @param groupId
     * @param rowId
     * @param httpRequest
     */
    moveToGroup(currentGroupId = 0, groupId = 0, rowId = 0, httpRequest = true) {
        const currentGroupIndex = this.boardData.groups.findIndex((item: any) => item.id == currentGroupId);
        const newGroupIndex = this.boardData.groups.findIndex((item: any) => item.id == groupId);

        let rowData = {... this.dataTables[currentGroupIndex].rows.find((item: any) => item.id == rowId)};
        rowData.group_id = groupId;

        // Remove from current group
        this.boardData.groups[currentGroupIndex].rows = this.boardData.groups[currentGroupIndex].entries.filter((item: any) => item.id != rowId);
        this.dataTables[currentGroupIndex].rows = this.dataTables[currentGroupIndex].rows.filter((item: any) => item.id != rowId);

        // Remove from AG Grid
        this.gridApi[currentGroupIndex].applyTransaction({remove: [this.boardData.groups[currentGroupIndex].entries.find((item: any) => item.id == rowId)]});

        // Add to new group
        this.boardData.groups[newGroupIndex].entries.push(rowData);

        // Get new index
        const newIndex = this.boardData.groups[newGroupIndex].entries.findIndex((item: any) => item.id == rowId);

        // Add to datatables
        this.dataTables[newGroupIndex].rows.splice(newIndex, 0, rowData);

        // Add to AG Grid
        this.gridApi[newGroupIndex].applyTransaction({add: [rowData], addIndex: newIndex});

        // Update cache
        this.cache.setBoardCache(this.boardId, this.boardData);

        // Now save in database
        if (httpRequest) {
            let data = {action: 'move', where: 'group', group_id: groupId, board_id: this.boardId, ids: rowId, map: ''};
            this.httpService.bulkActionsRows(data).subscribe((res: any) => {
            });
        }
    }

    /**
     * Get board data from server
     */
    getBoardData(force = false, data: any = false) {
        // Keeping it to the scope to make sure it should always save cache to correct board
        const boardId = this.boardId;

        if (data) {
            this.boardData = data;
            this.buildBoardData();
            this.loaded = true;
            return;
        }

        const localBoard = this.cache.getBoardCache(boardId);

        if (localBoard && !force) {
            this.boardData = localBoard;
            this.buildBoardData();
            this.loaded = true;

            // Reload again from database
            //this.getBoardData(true);
        } else {
            this.httpService.getSingleBoard(boardId).subscribe((data:any) => {
                this.cache.setBoardCache(boardId, data);

                if (this.boardId == boardId) {
                    this.boardData = data;

                    // Build AG Grid only if this is main tab
                    if (this.tab == 'main') {
                        this.buildBoardData();
                    }
                    this.loaded = true;
                }
            });
        }
    }

    /**
     * Build board data for the page
     * Reset table data
     * build columns from APIs
     * build sub columns from APIs
     * build rows from APIs
     */
    buildBoardData() {
        if (this.boardData === undefined) {
            return;
        }

        this.setBoardsDefaultSettings();

        const {columns, groups, sub_columns} = this.boardData;
        this.dataTables = [];

        this.handleDefaultTabs();
        this.buildColumns(columns, sub_columns);
        this.setDetailCellRendererParams();
        this.buildBoardTables(groups);
        this.handleEntryDetailPopup(groups);

        setTimeout(() => {
          this.getBoardUsers();
          this.getTags();
        }, 1000);

        this.setFilterColumns();
        this.setData();
    }

    /**
     * Set default settings for the board
     */
    setBoardsDefaultSettings() {
        try {
            this.boardData.settings = JSON.parse(this.boardData.settings);
        } catch (e) {
        }

        if (this.boardData.settings === undefined || typeof this.boardData.settings === "string") {
            this.boardData.settings = {};
        }

        if (this.boardData.settings.permissions === undefined) {
            this.boardData.settings.permissions = this.permissions;
        }

        if (this.boardData.settings.notification_mute_all === undefined) {
            this.boardData.settings.notification_mute_all = false;
        }

        if (this.boardData.settings.terminology === undefined || this.boardData.settings.terminology === '') {
            this.boardData.settings.terminology = this.boardData.singular_name;
        }

        if (this.boardData.settings.type === undefined || this.boardData.settings.type === '') {
            this.boardData.settings.type = 'main';
        }

        this.changePermissions();
    }

    /**
     * Manipulate default tabs base on board type
     */
    handleDefaultTabs() {
        // if (!['broadcast', 'sequence', 'segment'].includes(this.boardData.type)) {
        //     return;
        // }
        //
        // this.boardData.tabs = [
        //     {icon: 'fa fa-list-ol', title: 'Broadcasts', slug: 'broadcasts', type: 'broadcasts', is_default: 1},
        //     {icon: 'fa fa-broadcast-tower', title: 'Sequences', slug: 'sequences', type: 'sequences', is_default: 0},
        //     {icon: 'fa fa-filter', title: 'Segments', slug: 'segments', type: 'segments', is_default: 0},
        // ];
        //
        // switch (this.boardData.type) {
        //     case 'broadcast':
        //         this.boardData.tabs[0].slug = 'main';
        //         break;
        //     case 'sequence':
        //         this.boardData.tabs[1].slug = 'main';
        //         break;
        //     case 'segment':
        //         this.boardData.tabs[2].slug = 'main';
        // }
    }

    /**
     * Navigate to the correct board
     *
     * @param tab
     */
    selectBoardTab(tab: any) {
        const boardIds: any = {
            broadcasts: 35,
            sequences: 34,
            segments: 36,
        }

        this.router.navigate(['/boards', boardIds[tab.type], 'main']);
    }

    /**
     * Set detail cell renderer params
     */
    setDetailCellRendererParams() {
        this.detailCellRendererParams = {
            detailGridOptions: {
                columnDefs: this.subColumns,
                defaultColDef: this.defaultColDef,
                isRowSelectable: this.isRowSelectable,
                rowSelection: this.rowSelection
            },
            getDetailRowData: (params) => {
                params.successCallback(params.data.subItems);
            }
        } as IDetailCellRendererParams;
    }

    /**
     * Build columns for the board
     * @param columns
     * @param sub_columns
     */
    async buildColumns(columns: any, sub_columns: any) {
        // Attach new columns
        this.defaultSubCols.concat(this.boardData.columns);
        this.subColumns = [...this.defaultSubCols];
        this.columns = [...this.defaultCols];
        this.pipelines = [];
        this.selectedPipeline = undefined;

        // Build table columns
        for (let i = 0; i < columns?.length; i++) {
            const column = columns[i];

            // Build pipelines for kanban
            if (this.tab == 'kanban' && column.key == 'pipeline') {
                this.pipelines = column.statuses;
                this.selectPipeline(this.pipelines[0]);
            }

            if (column.type == 'connect-boards') {
                try {
                    column.settings = JSON.parse(column.settings);
                } catch (e) {
                }

                let boardSettings: any = [];

                if (column.settings?.boards) {
                    // Replace connected board id with board name
                    if (column.settings.boards.length > 0) {
                        await this.cache.getAllBoards().then((boards) => {
                            for (let i = 0; i < column.settings.boards.length; i++) {
                                const board = boards.find((board: any) => board.type == column.settings.boards[i]);
                                if (board !== undefined && board.id !== undefined) {
                                    boardSettings.push(board.id);
                                }
                            }
                        });
                    }

                    // This will skip for non-matching board type
                    if (boardSettings.length > 0) {
                        column.settings.boards = boardSettings;
                    }
                }
            }

            this.columns.push({
                    field: column.key,
                    headerName: column.name,
                    pinned: column.key == 'item' ? 'left' : false,
                    width: column.width != 0 ? parseInt(column.width) : 200,
                    suppressMovable: column.key == 'item',
                    lockPosition: column.key == 'item' ? 'left' : false,
                    colSpan: params => {
                        if (params.data.item == '##add-new##') {
                            return columns.length;
                        }
                        return 1;
                    },
                    cellRendererParams: {
                        id: column.id,
                        typeCol: column.type,
                        collapsed: column.collapsed,
                        description: column.description,
                        settings: column.settings,
                        statuses: column.statuses === undefined ? [] : column.statuses,
                    }
                }
            );
        }

        // Build table sub columns
        for (let i = 0; i < sub_columns?.length; i++) {
            const column = sub_columns[i];

            this.subColumns.push({
                    field: column.key,
                    headerName: column.name,
                    pinned: column.key == 'item' ? 'left' : false,
                    width: column.width != 0 ? column.width : false,
                    suppressMovable: column.key == 'item',
                    colSpan: params => {
                        if (params.data.item == '##add-new##') {
                            return sub_columns.length;
                        }
                        return 1;
                    },
                    cellRendererParams: {
                        id: column.id,
                        typeCol: column.type,
                        collapsed: column.collapsed,
                        description: column.description,
                        statuses: column.statuses === undefined ? [] : column.statuses,
                    }
                }
            );
        }

        // Add last column to columns list
        this.columns.push(this.lastColumnAdd);
        this.columnsHide = [...this.columns];
        this.subColumns.push(this.lastColumnAdd);

        // Build data for connected boards
        this.buildConnectedBoardsData();

        // Hide columns
        this.applyHiddenColumns();
        this.setFilterColumns();
    }

    /**
     * Build data for connected boards
     */
    buildConnectedBoardsData(force = false) {
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].cellRendererParams?.typeCol == 'connect-boards' && this.columns[i].cellRendererParams?.settings !== undefined) {
                let settings = this.columns[i].cellRendererParams.settings;
                try {
                    settings = JSON.parse(settings);
                } catch (e) {

                }

                settings = settings == '' ? {boards: [], mirror: []} : settings;

                // Add boards IDs to array
                this.buildConnectedBoardArray(settings);
            }
        }

        // Get connected boards data stored in cache and build data
        this.buildConnectedBoardDataArray();
    }

    /**
     * Build array of connected board ids
     *
     * @param data
     */
    buildConnectedBoardArray(data:any) {
        if (data.boards === undefined || data.boards.length == 0) {
            return;
        }

        for (let i = 0; i < data.boards.length; i++) {

            // check if already in array of this.connectedBoardIds
            let index = this.connectedBoardIds.findIndex((id: any) => id == data.boards[i]);
            if (index == -1) {
                this.connectedBoardIds.push(data.boards[i]);
            }
        }
    }

    /**
     * Build data for connected boards
     */
    buildConnectedBoardDataArray() {
        for (let i = 0; i < this.connectedBoardIds.length; i++) {
            const boardId = this.connectedBoardIds[i];

            // Check if board is already in array
            let index = this.connectedBoards.findIndex((board: any) => board.id == boardId);
            if (index === -1) {
                this.connectedBoards.push({data: false, id: boardId});
                index = this.connectedBoards.length - 1;
            }

            // Get board data from cache
            const boardData = this.cache.getBoardCache(boardId);
            if (boardData !== undefined && boardData !== null && boardData !== false) {
                // Push to connected boards data array
                this.connectedBoards[index].data = boardData;
            } else {
                // Get connected board from API
                this.httpService.getSingleBoard(boardId).subscribe((boardData: any) => {
                    if (boardData !== undefined) {
                        // Set board data in cache
                        this.cache.setBoardCache(boardId, boardData);

                        // Push to connected boards data array
                        this.connectedBoards[index].data = boardData;
                    }
                });
            }
        }
    }

    /**
     * Get connected board data by ID
     * @param id
     * @param search
     */
    getConnectedBoardById(id = 0, search = '') {
        // Find board from array
        const connectedBoard = this.connectedBoards.find((connectedBoard: any) => {
            return connectedBoard.id == id;
        });

        if (connectedBoard) {
            return connectedBoard.data;
        }

        return false;
    }

    /**
     * Get connect board entries by ID
     * @param boardId
     * @param id
     * @param key
     */
    getConnectedItemsById(boardId = 0, id = 0, key: any = false) {
        // Find board from array
        const connectedBoard = this.getConnectedBoardById(boardId);
        if (connectedBoard !== undefined && connectedBoard) {
            for (let i = 0; i < connectedBoard?.groups?.length; i++) {
                const group = connectedBoard.groups[i];

                for (let j = 0; j < group.entries.length; j++) {
                    const item = group.entries[j];

                    if (item.id == id) {
                        return key ? item[key] : item;
                    }
                }
            }

            return '';
        }

        return false;
    }

    /**
     * Set last column dynamic width
     */
    setLastColumnWidth(gridApi: any) {
        let columns = gridApi.gridBodyCtrl?.columnModel?.columnDefs;
        const availableSpace = gridApi.gridBodyCtrl?.columnModel?.viewportRight;
        const currentSpace = gridApi.gridBodyCtrl?.columnModel?.bodyWidth;
        if (availableSpace > currentSpace) {
            columns = this.addSubWidthToLastCol(columns, (availableSpace - currentSpace));
        }
        gridApi.setColumnDefs(columns);
    }

    /**
     * Add or subtract width to last column
     */
    addSubWidthToLastCol(columns: any, width = 0, sub = false) {
        if (sub) {
            columns[columns.length - 1].width -= width;
        } else {
            columns[columns.length - 1].width += width;
        }

        return columns;
    }

    /**
     * Build groups and rows
     * @param groups
     */
    async buildBoardTables(groups: any) {
        for (let i = 0; i < groups?.length; i++) {
            this.gridOptions.push(<GridOptions>{alignedGrids: []});

            this.dataTables.push({group: groups[i].name, groupId: groups[i].id, color: groups[i].color, expanded: groups[i].collapsed, rowsExpanded: 0, expandedRowIndex: <number | undefined>undefined, rows: [...groups[i]?.entries]});

            // Add default row to create new row
            this.dataTables[i].rows.push({...this.defaultLastRow});

            // Add summary row at the end of the table
            await this.dataTables[i].rows.push({...this.summaryRow});
        }

        // Align tables
        for (let i = 0; i < this.gridOptions.length; i++) {
            this.gridOptions[i].alignedGrids = this.gridOptions;
        }
    }

    clearCache(resetDbMigration = false) {
        if (resetDbMigration) {
            this.httpService.updateCrmSettings({action: 'reset_db_migration'}).subscribe((res: any) => {
                this.localStore.clear();
                this.appComponent.reloadApp();
            });
        } else {
            this.localStore.clear();
            this.appComponent.reloadApp();
        }
    }

    scrollLeft() {
        this.adFilter.nativeElement.scrollLeft += 150;
        // let scrollleft = this.adFilter.nativeElement.scrollLeft,
        // scrollWidth = this.adFilter.nativeElement.scrollWidth;

        // if ((scrollleft + this.scrollStep) >= scrollWidth) {
        //     this.adFilter.nativeElement.scrollTo(scrollWidth, 0);
        // } else {
        //     this.adFilter.nativeElement.scrollTo((scrollleft + this.scrollStep), 0);
        // }
    }

    scrollRight() {
        this.adFilter.nativeElement.scrollLeft -= 150;
        // let scrollleft = this.adFilter.nativeElement.scrollLeft,
        // scrollWidth = this.adFilter.nativeElement.scrollWidth;

        // if ((scrollleft + this.scrollStep) >= scrollWidth) {
        //     this.adFilter.nativeElement.scrollTo(scrollWidth, 0);
        // } else {
        //     this.adFilter.nativeElement.scrollTo((scrollleft - this.scrollStep), 0);
        // }
    }

    /**
     * Initialize gantt / scheduler
     */
    initGanttScheduler() {
        this.ganttData = [
            {
                TaskID: 1,
                TaskName: 'Project Initiation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50},
                    {TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50},
                    {TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50},
                ]
            },
            {
                TaskID: 5,
                TaskName: 'Project Estimation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50},
                    {TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50},
                    {TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50}
                ]
            },
        ];

        this.ganttTaskSettings = {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            child: 'subtasks'
        };

        this.ganttEditSettings = {
            allowEditing: true,
            mode: "Auto"
        };
    }

    getUsers() {
        const users = this.cache.getUsersCache();
        if (users) {
            this.users = users;
            this.filteredUsers = users;
        } else {
            this.httpService.getUsers().subscribe((res: any) => {
                this.cache.setUsersCache(res);
                this.users = res;
                this.filteredUsers = res;
            });
        }
    }

    onFirstDataRendered(params: FirstDataRenderedEvent) {
        // arbitrarily expand a row for presentational purposes
        setTimeout(function () {
            //params.api.getDisplayedRowAtIndex(0)!.setExpanded(true);
        }, 0);
    }

    /**
     * Set column settings
     */
    setColSettings(colId: 0, colSettings: any, subCol = false, reloadConnectedBoards = false) {
        this.cache.reCacheBoardData(this.boardId, false);
        let columns = subCol ? this.subColumns : this.columns;
        const colIndex = columns.findIndex(col => col?.cellRendererParams?.id == colId);
        const data = {id: columns[colIndex]?.cellRendererParams?.id, settings: JSON.stringify(colSettings)};

        // Update column in board component also
        if (subCol) {
            this.subColumns[colIndex].cellRendererParams.settings = colSettings;
        } else {
            this.columns[colIndex].cellRendererParams.settings = colSettings;
        }

        this.httpService.updateColumn(data).subscribe((res: any) => {
            if (reloadConnectedBoards) {
                this.buildConnectedBoardsData(true);
            }
        });
    }

    /**
     * Update column description
     *
     * @param colName
     * @param id
     * @param description
     * @param subItems
     */
    updateDescription(colName = '', id = 0, description = '', subItems = false) {
        this.getColIndexByName(colName, subItems).then((colIndex) => {
            if (colIndex !== false) {
                this.columns[colIndex].cellRendererParams.description = description;
                const data = {id: id, description: description};
                this.httpService.updateColumn(data).subscribe((response: any) => {
                    this.cache.reCacheBoardData(this.boardId);
                });
            }
        });
    }

    /**
     * Delete status by ID
     * @param id
     */
    removeStatus(id = 0) {
        if (id > 0) {
          this.httpService.deleteStatus(id).subscribe((res: any) => {
            this.cache.reCacheBoardData(this.boardId, false);
          });
        }
    }

    /**
     * Delete pipeline by ID
     * @param id
     */
    removePipeline(id = 0) {
        if (id > 0) {
          this.pipelines = this.pipelines?.filter((ele: any) => ele.id != id);
          this.removeStatus(id);
        }
    }

    /**
     * Get available and unused colors pallets
     */
    getAvailablePallets(statuses: any[] = []) {
        let availablePallets = [...this.colorPallets];

        for (let iStatus = 0; iStatus < statuses.length; iStatus++) {
            for (let iAvailable = 0; iAvailable < availablePallets.length; iAvailable++) {
                if (availablePallets[iAvailable] == statuses[iStatus].color) {
                    availablePallets.splice(iAvailable, 1);
                }
            }
        }

        return availablePallets;
    }

    /**
     * Update status by ID
     * @param data
     */
    updateStatus(data: any) {
        this.cache.reCacheBoardData(this.boardId, false);
        return this.httpService.updateStatus(data);
    }

    /**
     * Duplicate column
     * @param colName
     * @param DuplicateValues
     * @param subItems
     * @param api
     */
    colDuplicate(colName = '', DuplicateValues = false, subItems = false, api: any = false) {
        this.cache.reCacheBoardData(this.boardId, false);
        this.getColIndexByName(colName, subItems).then((index) => {
            if (index === false) {
                return;
            }

            let columns = subItems ? this.subColumns : this.columns;
            let newCol = {...columns[index]};
            const colId = columns[index].cellRendererParams.id;
            newCol.field = this.getNewColFieldName(colName, subItems);
            newCol.headerName = 'Dup. of ' + newCol.headerName;
            const newIndex = index + 1;
            columns.splice(newIndex, 0, {...newCol});

            // update columns in server
            const data = {action: 'duplicate', with_values: DuplicateValues ? 1 : 0, ids: colId};
            this.httpService.bulkActionsColumns(data).subscribe((response: any) => {
                this.getColIndexByName(newCol.field, subItems).then((newIndex) => {
                    this.cache.reCacheBoardData(this.boardId);
                    if (newIndex !== false) {
                        columns[newIndex].cellRendererParams.id = response.response.data.id;
                        columns[newIndex].field = response.response.data.key;

                        // Refresh the table columns again
                        if (subItems && api) {
                            this.setColsDefs(api, columns);
                        } else {
                            this.updateColsToGroups(columns);
                        }
                    }
                });
            });

            if (DuplicateValues) {
                this.duplicateValues(newIndex, subItems, api);
                this.refreshTable(true);
            }
        });
    }

    /**
     * Duplicate values of newly created column and its rows
     *
     * @param colIndex
     * @param subItems
     * @param api
     */
    duplicateValues(colIndex = 0, subItems = false, api: any = false) {
        const columns = subItems ? this.subColumns : this.columns;
        const rowKey = columns[colIndex].field!;
        const rowKeyOld = columns[colIndex - 1].field!;

        for (let iGroup = 0; iGroup < this.dataTables.length; iGroup++) {
            for (let iRow = 0; iRow < this.dataTables[iGroup].rows.length; iRow++) {
                if (subItems) {
                    if (this.dataTables[iGroup].rows[iRow].subItems !== undefined) {
                        for (let iSubRow = 0; iSubRow < this.dataTables[iGroup].rows[iRow].subItems.length; iSubRow++) {
                            this.dataTables[iGroup].rows[iRow].subItems[iSubRow][rowKey] = this.dataTables[iGroup].rows[iRow].subItems[iSubRow][rowKeyOld];
                        }
                    }
                } else {
                    this.dataTables[iGroup].rows[iRow][rowKey] = this.dataTables[iGroup].rows[iRow][rowKeyOld];
                }
            }
        }
    }

    /**
     * Get unique new column name field
     * This will help to keep the name of column always unique
     *
     * @param colName
     * @param subItems
     */
    getNewColFieldName(colName = '', subItems = false) {
        let newColName = colName + '_1';
        this.getColIndexByName(newColName, subItems).then((index) => {
            if (index !== false) {
                const columns = subItems ? this.subColumns : this.columns;
                newColName = this.getNewColFieldName(columns[index].field);
            }
        });

        return newColName;
    }

    /**
     * Collapse column
     *
     * @param colName
     * @param colId
     * @param subItems
     * @param api
     * @param collapse
     */
    colCollapse(colName = '', colId = 0, subItems = false, api: any = false, collapse = true) {
        const columns = subItems ? this.subColumns : this.columns;
        // find colum index by id
        this.getColIndexByName(colName, subItems).then((index) => {
            if (index === false) {
                return;
            }

            columns[index].width = collapse ? 50 : 200;
            columns[index].cellRendererParams.collapsed = collapse ? 1 : 0;

            const data = {id: colId, collapsed: columns[index].cellRendererParams.collapsed, board_id: this.boardId, width: columns[index].width};

            // Save settings to server
            this.httpService.updateColumn(data).subscribe((response: any) => {
                this.cache.reCacheBoardData(this.boardId);
            });

            // Refresh the table columns again
            if (subItems && api) {
                this.setColsDefs(api, columns);
            } else {
                this.updateColsToGroups(columns);
            }
        });

    }

    /**
     * Get column index by name
     *
     * @param colName
     * @param subItems
     */
    async getColIndexByName(colName = '', subItems = false) {
        const columns = subItems ? this.subColumns : this.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].field == colName) {
                await console.log('getColIndexByName', i);
                return i;
            }
        }

        return false;
    }

    /**
     * Fire when AG grid is ready
     *
     * @param params
     * @param groupIndex
     */
    onGridReady(params: GridReadyEvent, groupIndex: number = 0) {
        this.groupIndex = groupIndex;
        this.gridApi[this.groupIndex] = params.api;
        this.setColsDefs(this.gridApi[this.groupIndex], this.columns);
        this.onScroll(false);
    }

    onSelectionChanged(event: any, groupIndex = 0, groupId = 0) {
        this.groupId = groupId;
        this.groupIndex = groupIndex;
        this.selectedRows = this.gridApi[this.groupIndex].getSelectedRows();
        this.showSelectionPopup = this.selectedRows.length != 0;
    }

    selectRowOnTrayOpen(data: any) {
      const groupIndex = this.dataTables?.findIndex((group: any) => group.groupId === data.groupId);
      if(groupIndex >= 0 && data.rowId) {
        this.groupIndex = groupIndex;
        this.gridApi[groupIndex]?.forEachNode((node: any) => {
          node.data.id === data.rowId ? node.setSelected(data?.select): 0;
        });
        this.showSelectionPopup = false;
      }
    }

    /**
     * Get email settings
     */
      getEmailSettings(forceLoad = false) {
        const localSettings = this.localStore.get('emailSettings');
        if (localSettings && !forceLoad) {
          this.emailSettings = localSettings;
        } else {
            this.httpService.getCrmSettings().subscribe((res: any) => {
              this.emailSettings = res;
              this.localStore.set('emailSettings', res);
            });
        }
      }

    getEmailTemplateList(templates = []) {
        if (templates === undefined) {
            return [];
        }

        // filter email templates by type
        return <any>templates.filter((template: any) => {
            return template.type === this.bulkEmailAction.templateType;
        });
    }

    /**
     * Perform rows operations
     * @param operation
     * @param groupId
     */
    rowOperations(operation = '') {
        if (this.selectedRows.length == 0) {
            return;
        }

        this.cache.reCacheBoardData(this.boardId, false);

        switch (operation) {
            case 'duplicate':
                this.duplicateRows();
                break;
            case 'export':
                this.exportRows();
                break;
            case 'archive':
                this.archiveRows();
                break;
            case 'delete':
                this.deleteRows();
                break;
            case 'convert':
                this.convertRows();
                break;
        }
    }

    /**
     * On Select bulk emails
     */
    sendBulkEmails() {
        const entryIDs = this.selectedRows?.map((row: any) => row.id)?.join(',');

        this.bulkEmailAction.errorMsg = '';
        this.bulkEmailAction.successMessage = '';

        if (this.bulkEmailAction.email_from == '') {
            this.bulkEmailAction.errorMsg = 'Please select a sender';
            return;
        }

        if (this.bulkEmailAction.email_template == '') {
            this.bulkEmailAction.errorMsg = 'Please select a template';
            return;
        }

        if (this.bulkEmailAction.enroll_for == '') {
            this.bulkEmailAction.errorMsg = 'Please select a enroll for';
            return;
        }

        this.bulkEmailAction.wait = true;

        const data = {
            ...this.bulkEmailAction,
            entry_ids: entryIDs,
        }

        this.httpService.sendBulkEmails(data).subscribe((res: any) => {
            if (res.success == true) {
                this.bulkEmailAction.successMessage = res.message;
            } else {
                this.bulkEmailAction.errorMsg = res.message;
            }

            this.bulkEmailAction.wait = false;
        });
    }

    /**
     * set connected email accounts
     */
    setBulkEmailOptions() {
        this.resetBulkEmailsObj();
        this.getConnectedEmailAccounts();
    }

    /**
     * get connected email accounts
     */
    getConnectedEmailAccounts() {
      this.getEmailSettings();
    }

    /**
     * Send bulk texts
     */
    sendBulkTexts() {
      const entryIDs = this.selectedRows?.map((row: any) => row.id)?.join(',');

      const data = {
        entry_ids: entryIDs,
        sms_body: this.bulkSmsText,
      }

      this.httpService.sendBulkSms(data).subscribe((res: any) => {
        console.log('Bulk sms res', res);
      });
    }

    /**
     * Duplicate selected rows
     */
    duplicateRows() {
        let groupId = 0;
        let rowIds = [];
        for (let i = 0; i < this.selectedRows.length; i++) {
            this.duplicateRow(this.selectedRows[i].group_id, this.selectedRows[i].id, false, false, false);
            if (i === 0){
                groupId = this.selectedRows[i].group_id;
            }

            rowIds.push(this.selectedRows[i].id);
        }

        // Save in DB
        const data = {
            action: 'duplicate',
            where: '',
            group_id: groupId,
            board_id: this.boardId,
            ids: rowIds.join(','),
            "with-updates": false
        };

        this.httpService.bulkActionsRows(data).subscribe((res: any) => {
            this.cache.reCacheBoardData(this.boardId);
        });

        this.unSelectRows();
    }

    bulkMoveToGroup(groupId = 0) {
        let rowIds = [];
        for (let i = 0; i < this.selectedRows.length; i++) {
            this.moveToGroup(this.selectedRows[i].group_id, groupId, this.selectedRows[i].id, false);
            rowIds.push(this.selectedRows[i].id);
        }

        // Save in DB
        const data = {action: 'move', where: 'group', group_id: groupId, board_id: this.boardId, ids: rowIds.join(','), map: ''};
        this.httpService.bulkActionsRows(data).subscribe((res: any) => {
        });

        this.unSelectRows();
    }

    /**
     * Duplicate specific Row
     * @param groupId
     * @param rowId
     * @param api
     * @param withUpdates
     * @param httpRequest
     */
    duplicateRow(groupId = 0, rowId = 0, api: any = false, withUpdates = false, httpRequest = true) {
        // Click on outer span ID 'outer-span' to hide the popup
        document.getElementById('outer-span')?.click();

        // Get group and row indexes real time because it can be changed
        const groupIndex = this.dataTables.findIndex((group: any) => group.groupId === groupId);
        const indexRow = this.dataTables[groupIndex].rows.findIndex((row: any) => row.id === rowId);

        // Build row data and set ID to 0 so that it will be added as new row
        let newRow = {...this.dataTables[groupIndex].rows[indexRow]};
        newRow.id = 0;

        // Add new row to Board Data also and then get the index of new row
        this.boardData.groups[groupIndex].entries.push(newRow);
        const newIndex = this.boardData.groups[groupIndex].entries.length - 1;

        // Add new row to AG Grid Using API
        if (api) {
            api.applyTransaction({add: [newRow], addIndex: newIndex});
        } else {
            this.gridApi[groupIndex].applyTransaction({add: [newRow], addIndex: newIndex});
        }

        this.cache.reCacheBoardData(this.boardId, false);

        // For multiple duplicate rows, we don't need to send HTTP request, we will send it once
        if(httpRequest) {
            // Add new row to database and then update the ID of new row
            const data = {
                action: 'duplicate',
                where: '',
                group_id: groupId,
                board_id: this.boardId,
                ids: this.dataTables[groupIndex].rows[indexRow].id,
                "with-updates": withUpdates
            };

            this.httpService.bulkActionsRows(data).subscribe((res: any) => {
                const newRowRes = res?.response?.data[0];
                if (newRowRes) {
                    this.boardData.groups[groupIndex].entries[newIndex] = newRowRes;
                    this.dataTables[groupIndex].rows.splice(newIndex, 0, newRowRes);

                    // Remove and add new row to AG Grid table
                    api.applyTransaction({remove: [newRow]});
                    api.applyTransaction({add: [newRowRes], addIndex: newIndex});

                    this.cache.setBoardCache(this.boardId, this.boardData);
                }
            });
        }
    }

    /**
     * Export selected rows
     */
    exportRows() {
        this.gridApi[this.groupIndex].exportDataAsExcel({
            onlySelected: true
        });
    }

    archiveRows() {
        // Mark these rows as Archived in database and delete them from Js
        this.deleteRows(true);
    }

    /**
     * Delete or archive single row
     *
     * @param groupId
     * @param rowId
     * @param isSubItem
     * @param parentId
     * @param archive
     * @param api
     */
    deleteRow(groupId = 0, rowId = 0,  isSubItem = false, parentId = 0, archive = false, api: any = false) {
        // Get group and row index
        const groupIndex = this.dataTables.findIndex((group: any) => group.groupId == groupId);
        let rowIndex = -1;
        if (isSubItem) {
            const parentIndex = this.dataTables[groupIndex].rows.findIndex((row: any) => row.id == parentId);
            rowIndex = this.dataTables[groupIndex].rows[parentIndex].subItems.findIndex((row: any) => row.id == rowId);

            // Remove row from boardData
            this.boardData.groups[groupIndex].entries[parentIndex].subItems.splice(rowIndex, 1);
        } else {
            rowIndex = this.dataTables[groupIndex].rows.findIndex((row: any) => row.id == rowId);

            // Remove row from boardData
            this.boardData.groups[groupIndex].entries.splice(rowIndex, 1);
        }

        // Remove row from AG Grid
        api.applyTransaction({remove: [this.dataTables[groupIndex].rows[rowIndex]]});

        // Update in cache
        this.cache.setBoardCache(this.boardId, this.boardData);

        // Update in database
        if (archive) {
            const data = {action: 'archive', where: '', group_id: groupId, board_id: this.boardId, ids: rowId, map: ''};
            this.httpService.bulkActionsRows(data).subscribe((res: any) => {
            });
        } else {
            this.httpService.deleteRow(rowId).subscribe((response: any) => {
            });
        }
    }

    /**
     * Delete selected Rows
     */
    async deleteRows(archive = false) {
        const selectedNodes = this.gridApi[this.groupIndex].getSelectedNodes();
        let rowIds = [];

        let minus = 0;
        for (let i = 0; i < selectedNodes.length; i++) {
            const rowId = this.dataTables[this.groupIndex].rows[selectedNodes[i].rowIndex - minus].id;
            rowIds.push(rowId);

            await this.dataTables[this.groupIndex].rows.splice(selectedNodes[i].rowIndex - minus, 1);
            this.boardData.groups[this.groupIndex].entries.splice(selectedNodes[i].rowIndex - minus, 1);

            minus++;
        }

        let data:any = {action: 'archive', where: '', group_id: this.groupId, board_id: this.boardId, ids: rowIds.join(','), map: ''};

        // Update in database
        if (!archive) {
            data.action = 'delete';
        }

        // Update cache
        this.cache.setBoardCache(this.boardId, this.boardData);

        this.httpService.bulkActionsRows(data).subscribe((res: any) => {
        });

        this.gridApi[this.groupIndex].setRowData(this.dataTables[this.groupIndex].rows);
        this.unSelectRows();
    }

    convertRows() {

    }

    moveTo() {

    }

    /**
     * Set temporary value for column center popup
     *
     * @param isSubTable
     * @param api
     */
    setCurrentPopupValues(isSubTable = false, api: any = false) {
        this.tempVal = {isSubTable: isSubTable, api: api};
    }

    /**
     * Build new column object
     *
     * @param colName
     * @param type
     * @param subItems
     * @param width
     */
    buildNewColObject(colName = '', type = '', subItems = false, width: any = 150, settings: any = {}, statuses?: any) {
        let newCol = {...this.newCol};
        newCol.field = this.getNewColFieldName(colName, subItems);
        newCol.headerName = colName;
        newCol.cellRendererParams.typeCol = type;
        newCol.cellRendererParams.settings = settings;
        newCol.width = parseInt(width);
        newCol.statuses = statuses;
        return newCol;
    }

    addNewColGeneric(colName: string, leftColKey = '', type = 'text', subItems = false, api: any = false, closePopup = false) {
        this.addNewCol({
            name: colName,
            leftCol: leftColKey,
            type: type
        }, subItems, api, closePopup);
    }

    /**
     * Add new column to the table
     *
     * @param colData
     * @param subItems
     * @param api
     * @param closePopup
     */
    addNewCol(colData: any, subItems = false, api: any = false, closePopup = false) {

        if (colData.name == '') {
            return;
        }

        if (closePopup) {
            const elem = <HTMLElement>document.querySelector('.js-close-btn-column-center');
            if (elem !== null) {
                elem.click();
            }
        }

        let newCol = this.buildNewColObject(colData.name, colData.type, subItems, this.getColumnWidth(colData.name), colData.settings);
        let columns = subItems ? this.subColumns : this.columns;
        const subCol = subItems ? 1 : 0;
        let focusId = 0;

        if (colData.leftCol == '') {
            columns.push(newCol);
        } else {
            const leftColumn = columns.find((col) => col.field === colData.leftCol);
            if (leftColumn === undefined) {
                return;
            }

            const LeftColIndex = columns.findIndex((col) => col.field === colData.leftCol);

            // Add new column to the right of the selected column
            columns.splice(LeftColIndex + 1, 0, newCol);
            focusId = leftColumn.cellRendererParams.id;
        }

        // If sub table update
        if (subItems) {
            if (api) {
                this.setColsDefs(api, columns);
            }
        } else {
            // Update column definitions for all the group tables
            this.updateColsToGroups(columns);
        }

        // Soft delete cache
        this.cache.reCacheBoardData(this.boardId, false);

        const data = {
            name: newCol.headerName,
            board_id: this.boardId,
            type: colData.type,
            sub_column: subCol,
            focus_id: focusId,
            order: 'right',
            width: newCol.width,
            settings: colData.settings,
        };

        this.refreshTable();

        // Add column in database
        this.httpService.addNewColumn(data).subscribe((response: any) => {
          // Reload cache
          this.cache.reCacheBoardData(this.boardId);
          this.refreshTable();

          const newIndex = columns.findIndex((col) => col.field === newCol.field);
          let newColLate = this.buildNewColObject(response.name, colData.type, subItems, response.width, response.settings, response?.statuses);
          newColLate.cellRendererParams.id = response.id;
          newColLate.field = response.key;
          newColLate.cellRendererParams.statuses = response?.statuses;
          columns.splice(newIndex, 1, {...newColLate});

          // If sub table update
          if (subItems) {
            if (api) {
              this.setColsDefs(api, columns);
            }
          } else {
            // Update column definitions for all the group tables
            this.updateColsToGroups(columns);
          }
        });
    }

    getColumnWidth(name = '') {
        switch (name.toLowerCase()) {
            case 'title':
                return 88;
            case 'type':
                return 80;
            case 'priority':
            case 'status':
                return 95
            case 'phone':
            case 'email':
            case 'date':
                return 210;
            case 'company':
                return 175;
            case 'owner':
                return 88;
            case 'timeline':
                return 272;
            case 'dropdown':
            case 'formula':
            case 'tags':
            case 'progress tracking':
                return 177;
            case 'create contact':
                return 150;
            case 'time tracking':
            case 'week':
                return 150;
            case 'id':
                return 75;
            case 'button':
                return 100;
            case 'files':
                return 90;
            case 'description':
                return 210;
            case 'location':
                return 250;
            case 'creation log':
                return 150;
            case 'latest communication':
            case 'latest communication user':
            case 'first communication':
                return 150;
            case 'first communication date':
            case 'latest communication date':
                return 190;
            default:
                return 150;
        }
    }

    /**
     * Change column type
     *
     * @param typeColIndex
     * @param colName
     * @param subItems
     * @param api
     */
    changeColType(typeColIndex = 0, colName = '', subItems = false, api: any = false) {
        this.getColIndexByName(colName, subItems).then((index) => {
            if (index === false) {
                return;
            }

            let columns = subItems ? this.subColumns : this.columns;
            columns[index].cellRendererParams.typeCol = this.colTypes[typeColIndex].type;

            if (subItems && api) {
                this.setColsDefs(api, columns);
            } else {
                this.updateColsToGroups(columns);
            }

            const colData = {id: columns[index].cellRendererParams.id, board_id: this.boardId, type: columns[index].cellRendererParams.typeCol};

            this.httpService.updateColumn(colData).subscribe((data: any) => {
                this.cache.reCacheBoardData(this.boardId);
            });

            this.refreshTable(true);
        });
    }

    /**
     * Add new group table
     *
     * Add new group to table data array
     * Add default row to create new row
     * Add summary row at the end of the table
     *
     */
    addNewGroup(position:any = 'top') {
        // Create random key string
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Create new group object
        const groupObj = {
            group: 'New group',
            expanded: true,
            color: '#000000',
            rowsExpanded: 0,
            key: key,
            expandedRowIndex: <number | undefined>undefined,
            rows: [
                {...this.defaultLastRow}, {...this.summaryRow}
            ]
        };

        switch (position) {
            case 'top':
                position = 0;
                break;
            case 'bottom':
                position = this.boardData.groups.length + 1;
                break;
        }

        // Handle validations
        position = parseInt(position);
        if (isNaN(position) || position < 0) {
            position = 0;
        }

        // Add to table data
        this.boardData.groups.splice(position, 0, {...groupObj, id: 0, collapsed: 0, entries: []});
        this.dataTables.splice(position, 0, {...groupObj, groupId: 0, rows: [{...this.defaultLastRow}, {...this.summaryRow}]});

        this.cache.reCacheBoardData(this.boardId, false);

        // Add new group to database
        const groupData = {
            name: groupObj.group,
            board_id: this.boardId,
            color: groupObj.color
        };

        // TODO: Send sort order to server

        // Sent request to server
        this.httpService.addNewGroup(groupData).subscribe((data: any) => {
            if (data.id !== undefined) {
                // Update group ID in table data
                const groupIndex = this.boardData.groups.findIndex((group: any) => group?.key === key);

                // Update group id
                this.boardData.groups[groupIndex] = {...data,  entries: []};

                // Build group object again for table with the latest data
                this.dataTables.splice(groupIndex, 1, {groupId: data.id, expanded:true, expandedRowIndex:0, group:groupObj.group, rows: [{...this.defaultLastRow}, {...this.summaryRow}]});

                // Set board cache
                this.cache.setBoardCache(this.boardId, this.boardData);

                // Build the board tables again to update the group id and indexes
                this.buildBoardData();
            }
        });
    }

    moveGroupToTop(groupIndex = -1) {
        if (groupIndex === -1) {
            return;
        }

        const group = this.boardData.groups.splice(groupIndex, 1);
        this.boardData.groups.unshift(group[0]);

        const groupData = this.dataTables.splice(groupIndex, 1);
        this.dataTables.unshift(groupData[0]);

        this.cache.setBoardCache(this.boardId, this.boardData);

        // TODO: Send sort order to server
    }

    /**
     * Refresh AG grid table via API
     */
    refreshTable(force = false) {
        this.gridApi[this.groupIndex].refreshCells();

        if (force) {
            const that = this;
            let tempVal = [...this.dataTables];
            this.dataTables = [];
            setTimeout(function () {
                that.dataTables = [...tempVal];
                that.gridApi[that.groupIndex].refreshCells();
            }, 100);
        }
    }

    /**
     * Get dynamic height of table of each group
     * @param groupIndex
     */
    getTableHeight(groupIndex = 0) {
        if (this.dataTables[groupIndex].expanded === false) {
            return 0;
        }

        // this.detailRowHeight[groupIndex] = this.detailRowHeight[groupIndex] === undefined ? this.getDetailRowHeight(groupIndex) : this.detailRowHeight[groupIndex];

        const expandedRowsHeight = this.dataTables[groupIndex].rowsExpanded > 0 ? this.getDetailRowHeight(groupIndex) : 0;

        return 75 + 36 * this.dataTables[groupIndex].rows.length + expandedRowsHeight - 20;
    }

    /**
     * Get dynamic sub table
     * @param groupIndex
     */
    getDetailRowHeight(groupIndex = 0) {
        if (this.dataTables[groupIndex].expanded === false) {
            return 0;
        }

        // Expand sub table if not expanded and supposed to be expanded
        if (this.dataTables[groupIndex].rowsExpanded > 0 && this.dataTables[groupIndex].expandedRowIndex !== undefined && this.gridApi[groupIndex].getRowNode(this.dataTables[groupIndex].expandedRowIndex) !== undefined && !this.gridApi[groupIndex].getRowNode(this.dataTables[groupIndex].expandedRowIndex).expanded) {
            //this.gridApi[groupIndex].getDisplayedRowAtIndex(this.dataTables[groupIndex].expandedRowIndex)!.setExpanded(true);
        }

        return this.dataTables[groupIndex].rowsExpanded > 0 ? 80 + (36 * this.dataTables[groupIndex].rowsExpanded) : 0;
    }

    /**
     * Show hide sub items table
     * Also create new sub items default table if not created already.
     *
     * @param groupIndex
     * @param rowIndex
     */
    async expandSubItems(groupIndex = 0, rowIndex = 0) {
        const expand = !this.gridApi[groupIndex].getRowNode(rowIndex).expanded;
        this.groupIndex = groupIndex;
        this.expandedRows = {groupIndex: groupIndex, rowIndex: rowIndex};

        // Create default empty row sub items table when not created
        if (expand) {
            this.dataTables[this.groupIndex].expandedRowIndex = rowIndex;
            if (
                this.dataTables[this.groupIndex].rows[rowIndex].subItems === undefined ||
                this.dataTables[this.groupIndex].rows[rowIndex].subItems.length == 0 ||
                this.dataTables[this.groupIndex].rows[rowIndex].subItems[this.dataTables[this.groupIndex].rows[rowIndex].subItems.length - 1].item != '##add-new##'
            ) {
                if (this.dataTables[this.groupIndex].rows[rowIndex].subItems === undefined) {
                    this.dataTables[this.groupIndex].rows[rowIndex].subItems = [];
                }

                let defaultLastRow = {...this.defaultLastRow};
                defaultLastRow.parentIndex = rowIndex;
                await this.dataTables[this.groupIndex].rows[rowIndex].subItems.push({...defaultLastRow});
            }

            this.dataTables[this.groupIndex].rowsExpanded = this.dataTables[this.groupIndex].rows[rowIndex].subItems.length;

            // Show sub items table
            this.expandRow(groupIndex, rowIndex).then(() => {
                const that = this;
                setTimeout(() => {
                    const rowNode = this.gridApi[this.groupIndex].getRowNode(rowIndex);
                    that.setLastColumnWidth(rowNode.detailNode.detailGridInfo.api);
                }, 200);
            });
        } else {
            for (let i = 0; i < this.dataTables[this.groupIndex].rows.length; i++) {
                this.gridApi[groupIndex].getDisplayedRowAtIndex(i)!.setExpanded(false);
            }
            this.dataTables[this.groupIndex].expandedRowIndex = undefined;
            this.dataTables[this.groupIndex].rowsExpanded = 0;
        }
    }

    /**
     * Expand row
     *
     * @param groupIndex
     * @param rowIndex
     * @param delay
     */
    async expandRow(groupIndex = 0, rowIndex = 0, delay = 1) {
        for (let i = 0; i < this.dataTables[this.groupIndex].rows.length; i++) {
            await this.gridApi[groupIndex].getDisplayedRowAtIndex(i)!.setExpanded(false);
        }

        const that = this;
        setTimeout(function () {
            that.gridApi[groupIndex].getDisplayedRowAtIndex(rowIndex)!.setExpanded(true);
        }, delay);
    }

    /**
     * Add new row to main table and sub items table
     *
     * @param index
     * @param groupId
     * @param newRow
     * @param subItems
     * @param parentIndex
     * @param duplicate
     */
    setRowDataValue(index = 0, groupId = 0, newRow: any, subItems = false, parentIndex = 0, duplicate = false) {
        //this.cache.reCacheBoardData(this.boardId, false);
        this.groupIndex = index;
        const groupIndex = index;
        this.groupId = groupId;
        const parentId = subItems ? this.dataTables[index].rows[parentIndex].id : 0;
        let newIndex = -1;

        let rowData:any = {
            title: newRow.item,
            parent_id: parentId,
            board_id: this.boardId,
            group_id: this.groupId
        };

        // Add default status and priority if board is Leads
        if (this.boardData.type === 'lead') {
            rowData.status = 6;
            rowData.priority = 9;
            rowData.owner = '' + this.user?.ID;
            newRow.status = 6;
            newRow.priority = 9;
            newRow.owner = '' + this.user?.ID;
        }

        // Add token to new row if board is invoices, estimates or quotes
        if (['invoice','estimate','quote'].includes(this.boardData.type)) {
            // Generate random key
            const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            rowData.token = randomKey;
            newRow.token = randomKey;
        }

        if (subItems) {
            // Add data to board data for caching purpose
            this.boardData.groups[groupIndex].entries[parentIndex]['subItems'].push(newRow);

            // Get index of new row
            newIndex = this.boardData.groups[groupIndex].entries[parentIndex]['subItems'].length - 2;

            // Add new row to sub items table in data table for AG Grid
            this.dataTables[groupIndex].rows[parentIndex]['subItems'].splice(newIndex, 0, newRow);

            // Add new AG Grid row in sub items table
            this.gridApi[groupIndex].getRowNode(parentIndex).detailNode.detailGridInfo.api.applyTransaction({add: [newRow], addIndex: newIndex});

            this.dataTables[groupIndex].rowsExpanded = this.dataTables[groupIndex].rows[parentIndex]['subItems'].length;

        } else {
            this.boardData.groups[groupIndex].entries.push(newRow);
            newIndex = this.boardData.groups[this.groupIndex].entries.length - 1;
            this.dataTables[groupIndex].rows.splice(newIndex, 0, newRow);
            this.gridApi[groupIndex].applyTransaction({add: [newRow], addIndex: newIndex});
        }

        if (duplicate) {
            return;
        }

        this.httpService.addNewRow(rowData).subscribe((data: any) => {
            // Set row id to this newly created row
            if (data.id !== undefined) {
                if (subItems) {
                    this.boardData.groups[groupIndex].entries[parentIndex]['subItems'][newIndex] = data;
                    this.dataTables[groupIndex].rows[parentIndex]['subItems'].splice(newIndex, 0, data);

                    // remove and add new row to AG Grid table
                    this.gridApi[groupIndex].getRowNode(parentIndex).detailNode.detailGridInfo.api.applyTransaction({remove: [newRow]});
                    this.gridApi[groupIndex].getRowNode(parentIndex).detailNode.detailGridInfo.api.applyTransaction({add: [data], addIndex: newIndex});
                } else {
                    this.boardData.groups[groupIndex].entries[newIndex] = data;
                    this.dataTables[groupIndex].rows.splice(newIndex, 0, data);

                    // remove and add new row to AG Grid table
                    this.gridApi[groupIndex].applyTransaction({remove: [newRow]});
                    this.gridApi[groupIndex].applyTransaction({add: [data], addIndex: newIndex});
                }

                this.cache.setBoardCache(this.boardId, this.boardData);
            }
        });
    }

    // /**
    //  * Add new row to main table and sub items table
    //  *
    //  * @param index
    //  * @param groupId
    //  * @param newRow
    //  * @param subItems
    //  * @param parentIndex
    //  * @param duplicate
    //  */
    // setRowDataValue(index = 0, groupId = 0, newRow: any, subItems = false, parentIndex = 0, duplicate = false) {
    //     this.cache.reCacheBoardData(this.boardId, false);
    //     this.groupIndex = index;
    //     this.groupId = groupId;
    //     let tempVal = [...this.dataTables];
    //     const parentId = subItems ? this.dataTables[index].rows[parentIndex].id : 0;
    //
    //     if (subItems) {
    //         // Add new row to sub items table
    //         let subItems = tempVal[this.groupIndex].rows[parentIndex]['subItems'];
    //         const lastRow = subItems[subItems.length - 1];
    //         subItems.splice(subItems.length - 1, 1);
    //         subItems.push(newRow);
    //         subItems.push(lastRow);
    //         tempVal[this.groupIndex].rows[parentIndex]['subItems'] = subItems;
    //         tempVal[this.groupIndex].rowsExpanded = subItems.length;
    //
    //         // Expand row
    //         this.expandRow(this.groupIndex, parentIndex, 0);
    //     } else {
    //         // Add new row to main table
    //         tempVal[index].rows.splice(tempVal[index].rows.length - 1, 1);
    //         tempVal[index].rows.splice(tempVal[index].rows.length - 1, 1);
    //         tempVal[index].rows.push(newRow);
    //         tempVal[index].rows.push({...this.defaultLastRow});
    //         tempVal[index].rows.push({...this.summaryRow});
    //         const currentExpandedRowIndex = this.dataTables[this.groupIndex].expandedRowIndex;
    //         if (currentExpandedRowIndex !== undefined) {
    //             this.expandRow(this.groupIndex, currentExpandedRowIndex, 0);
    //         }
    //     }
    //
    //     if (!duplicate) {
    //
    //         const rowData = {
    //             title: newRow.item,
    //             parent_id: parentId,
    //             board_id: this.boardId,
    //             group_id: this.groupId
    //         };
    //
    //         this.httpService.addNewRow(rowData).subscribe((data: any) => {
    //
    //             // Set row id to this newly created row
    //             if (data.id !== undefined) {
    //                 if (subItems) {
    //                     if (tempVal[this.groupIndex].rows[parentIndex]['subItems'][tempVal[this.groupIndex].rows[parentIndex]['subItems'].length - 2].id === undefined) {
    //                         tempVal[this.groupIndex].rows[parentIndex]['subItems'][tempVal[this.groupIndex].rows[parentIndex]['subItems'].length - 2]['id'] = 0;
    //                     }
    //                     tempVal[this.groupIndex].rows[parentIndex]['subItems'][tempVal[this.groupIndex].rows[parentIndex]['subItems'].length - 2].id = data.id;
    //                     tempVal[this.groupIndex].rows[parentIndex]['subItems'][tempVal[this.groupIndex].rows[parentIndex]['subItems'].length - 2].created = data.created;
    //                     // Expand row
    //                     this.expandRow(this.groupIndex, parentIndex, 0);
    //                 } else {
    //                     tempVal[index].rows[tempVal[index].rows.length - 3].id = data.id;
    //                     tempVal[index].rows[tempVal[index].rows.length - 3].created = data.created;
    //                 }
    //
    //                 this.dataTables = [...tempVal];
    //                 const that = this;
    //                 setTimeout(function () {
    //                     that.gridApi[that.groupIndex].setRowData(that.dataTables[index].rows);
    //                 }, 1000);
    //
    //             }
    //         });
    //     }
    //
    //     this.dataTables = [...tempVal];
    //     this.gridApi[this.groupIndex].setRowData(this.dataTables[index].rows);
    //     this.refreshTable();
    // }

    createNewRowConnectedBoard(boardId = 0, groupId = 0, value = '') {
        value = value.trim();
        if (boardId == 0 && groupId == 0 && value == '') {
            return;
        }

        let boardData = this.cache.getBoardCache(boardId);

        // Set new row

        //this.cache.setBoardCache(boardId, boardData);

        const rowData = {
            title: value,
            parent_id: 0,
            board_id: boardId,
            group_id: groupId
        };

        this.httpService.addNewRow(rowData).subscribe((data: any) => {
            // Set row id to this newly created row
            if (data.id !== undefined) {
            }
        });
    }

    /**
     * Move sub item to different group/parent row
     *
     * @param newGroupId
     * @param oldGroupIndex
     * @param newGroupIndex
     * @param rowId
     * @param oldRowIndex
     * @param oldParentIndex
     * @param newParentIndex
     * @param newParentId
     */
    changeParentRow(newGroupId = 0, oldGroupIndex = 0, newGroupIndex = 0, rowId = 0, oldRowIndex = 0, oldParentIndex = 0, newParentIndex = 0, newParentId = 0) {
        this.cache.reCacheBoardData(this.boardId, false);
        const row = {...this.dataTables[oldGroupIndex].rows[oldParentIndex].subItems[oldRowIndex]};

        // Remove row from current position
        this.dataTables[oldGroupIndex].rows[oldParentIndex].subItems.splice(oldRowIndex, 1);

        // Set the stage for new row
        const newParentRow = this.dataTables[newGroupIndex].rows[newParentIndex];
        if (newParentRow.subItems === undefined) {
            this.dataTables[newGroupIndex].rows[newParentIndex].subItems = [];
        } else if (newParentRow.subItems.length > 0 && newParentRow.subItems[newParentRow.subItems.length - 1].item == '##add-new##') {
            this.dataTables[newGroupIndex].rows[newParentIndex].subItems.splice(newParentRow.subItems.length - 1, 1);
        }

        // Add new row to new position
        this.dataTables[newGroupIndex].rows[newParentIndex].subItems.push({...row});

        // Update data to table
        this.gridApi[newGroupIndex].setRowData(this.dataTables[newGroupIndex].rows);
        this.gridApi[oldGroupIndex].setRowData(this.dataTables[oldGroupIndex].rows);

        // finally update in database
        const rowData = {board_id: this.boardId, group_id: newGroupId, entry_id: rowId, parent_id: newParentId};
        this.httpService.updateRow(rowData)
            .subscribe((data: any) => {
                this.cache.reCacheBoardData(this.boardId);
            });
    }

    updateItem(rowIndex = 0, groupIndex = 0, groupId = 0, value: any = '', force = false) {
        this.groupIndex = groupIndex;
        this.groupId = groupId;
        this.dataTables[groupIndex].rows[rowIndex].item = value;

        if (force) {
            this.gridApi[this.groupIndex].setRowData(this.dataTables[groupIndex].rows);
        }

        const rowData = {board_id: this.boardId, group_id: groupId, entry_id: this.dataTables[groupIndex].rows[rowIndex].id, title: '' + value,};

        this.httpService.updateRow(rowData)
            .subscribe((data: any) => {
                this.cache.reCacheBoardData(this.boardId);
            });
    }

    /**
     * Update cell value
     *
     * @param value
     * @param cellName
     * @param groupIndex
     * @param rowIndex
     * @param parentRowIndex
     * @param subItems
     */
    updateCell(value = '', cellName: any, groupIndex = 0, rowIndex = 0, parentRowIndex = 0, subItems = false) {
        this.groupIndex = groupIndex;
        let entryId: number;

        this.cache.reCacheBoardData(this.boardId, false);
        let row: any = {};

        if (subItems) {
            this.dataTables[this.groupIndex].rows[parentRowIndex].subItems[rowIndex][cellName] = value;
            this.boardData.groups[groupIndex].entries[parentRowIndex].subItems[rowIndex][cellName] = value;
            row = this.dataTables[this.groupIndex].rows[parentRowIndex].subItems[rowIndex];
            entryId = this.dataTables[this.groupIndex].rows[parentRowIndex].subItems[rowIndex].id;
        } else {
            this.dataTables[this.groupIndex].rows[rowIndex][cellName] = value;
            this.boardData.groups[groupIndex].entries[rowIndex][cellName] = value;
            row = this.dataTables[this.groupIndex].rows[rowIndex];
            entryId = this.dataTables[this.groupIndex].rows[rowIndex].id;
        }

        const groupId = this.dataTables[this.groupIndex].groupId;
        const rowData = {board_id: this.boardId, group_id: groupId, entry_id: entryId, key: cellName, content: '' + value};

        try {
            // Update row in AG Grid
            // getRowId
            this.gridApi[this.groupIndex].applyTransaction({update: [row]});
        } catch (e) {
        }


        this.updateRowInDB(rowData);
        this.getBoardUsers();
    }

    /**
     * Move to different group based on the status update
     *
     * @param status
     * @param rowId
     * @param currentGroupId
     * @param _statusName
     * @param _statusId
     */
    updateGroupStatus(status:any = false, rowId = 0, currentGroupId = 0, _statusName = '', _statusId = 0) {
        // Only for "opportunity" board
        if (this.boardData.type !== 'opportunity'){
            return;
        }

        const statusName = status === false ? _statusName.toLowerCase().trim() : status.name.toLowerCase().trim();
        const statusId = status === false ? _statusId : status.id;

        if (statusName === undefined || statusId == 0) {
            return;
        }

        // Find group based on group name
        const group = this.boardData.groups.find((group: any) => {
            return group.name.toLowerCase().trim() === statusName;
        });

        let groupId = 0;

        // Check if relevant group found
        if (group === undefined) {
            // Group not found, then move to active group
            const activeGroup = this.boardData.groups.find((group: any) => {
                return group.name.toLowerCase().trim() === 'active';
            });

            // Check if active group available and is that the existing group
            if (activeGroup === undefined || activeGroup.id == currentGroupId) {
                return;
            }

            // Set group Id to be stored in database
            groupId = activeGroup.id;
        } else {
            groupId = group.id;
        }

        // Check if group is same as current group or not found
        if (groupId == currentGroupId || groupId == 0) {
            return;
        }

        // Move to accounts if group is "won"
        if (statusName === 'won') {
            const groupIndex = this.boardData.groups.findIndex((group: any) => {
                return group.id === currentGroupId;
            });

            if (groupIndex >= 0) {
                // Get row
                let opportunityRow = this.boardData.groups[groupIndex].entries.find((entry: any) => {
                    return entry.id == rowId;
                });

                // Get new group Index
                const newGroupIndex = this.boardData.groups.findIndex((group: any) => {
                    return group.id === groupId;
                });

                setTimeout(() => {
                    // Remove row from AG-Grid
                    this.gridApi[groupIndex].applyTransaction({remove: [opportunityRow]});

                    // Add row to new group
                    opportunityRow = {...opportunityRow, group_id: groupId, stage: statusId};

                    // Add row to AG-Grid
                    this.gridApi[newGroupIndex].applyTransaction({add: [opportunityRow], addIndex: this.dataTables[newGroupIndex].rows.length - 2});
                }, 10);

                // Get connected contact id from current row
                const contactId = opportunityRow?.contacts;

                if (contactId !== undefined && contactId > 0) {
                    // get board row by board id and row id
                    const contactsBoardId = this.allBoards?.find((board: any) => {
                        return board.type === 'contact';
                    })?.id;

                    if (contactsBoardId === undefined) {
                        return;
                    }

                    this.boardService.getBoardRowsByBoardId(contactsBoardId, contactId)
                        .then((contactRow: any) => {
                            if (contactRow !== undefined && contactRow !== null) {

                                // Create new account from the contact and opportunity row data
                                const rowData = {
                                    action: 'add-full-entry',
                                    board_type: 'account',
                                    item: opportunityRow?.company || contactRow?.item,
                                    contacts: contactId,
                                    deals: rowId,
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
                                        board_id: this.boardId,
                                        group_id: groupId,
                                        entry_id: rowId,
                                        key: 'accounts',
                                        content: '' + res.id
                                    };

                                    this.cache.reCacheBoardData(this.boardId, false);
                                    this.updateRowInDB(oppRowData);

                                    /**
                                     * Update contact row with account id
                                     */
                                    const contactRowData = {
                                        board_id: 3, // Manually use contacts board id
                                        entry_id: contactId,
                                        group_id: contactRow.group_id,
                                        key: 'accounts',
                                        content: '' + res.id
                                    };

                                    this.cache.reCacheBoardData(3, false);
                                    this.updateRowInDB(contactRowData);
                                });
                            }
                        });
                }
            }
        }

        // finally update in database
        this.bulkActionsRows('move', 'group', groupId, rowId, this.boardId);
    }

    /**
     * Update cell value in database
     *
     * @param rowData
     * @param boardId
     */
    updateRowInDB(rowData: any, boardId = 0) {
        if (boardId > 0) {
            this.cache.reCacheBoardData(boardId, false);
        } else {
            this.cache.setBoardCache(this.boardId, this.boardData);
        }

        this.httpService.updateRowMeta(rowData)
          .subscribe((data: any) => {
            this.cache.reCacheBoardData(this.boardId);
          });
    }

    /**
     * Update column name
     *
     * @param value
     * @param colId
     * @param subItems
     * @param api
     * @param colParams
     */
    updateCol(value: string, colId = 0, subItems = false, api: any = false, colParams: any = false) {
        let columns = subItems ? this.subColumns : this.columns;
        const index = columns.findIndex(col => col?.cellRendererParams?.id == colId);
        if (index < 0) {
            return;
        }

        this.cache.reCacheBoardData(this.boardId, false);

        if (columns[index].headerName === undefined) {
            columns[index]['headerName'] = '';
        }

        columns[index].headerName = value;

        const colData = {id: colParams.id, board_id: this.boardId, name: value};

        this.httpService.updateColumn(colData).subscribe((data: any) => {
            this.cache.reCacheBoardData(this.boardId);
            if (subItems && api) {
                this.setColsDefs(api, columns);
            } else {
                this.setColsDefs(this.gridApi[this.groupIndex], columns);
            }
        });

        if (subItems && api) {
            this.setColsDefs(api, columns);
        } else {
            this.setColsDefs(this.gridApi[this.groupIndex], columns);
        }

    }

    /**
     * Delete column
     *
     * @param colId
     * @param subItems
     * @param api
     */
    deleteCol(colId = 0, subItems = false, api: any = false) {
      let columns = subItems ? this.subColumns : this.columns;
        const index = columns.findIndex((col: any) => col?.cellRendererParams?.id == colId);

        if (index < 0) {
            return;
        }

        // Do not delete default columns
        if (this.checkIfDefaultColumnField(columns[index].field)) {
            return;
        }

        // Soft delete cache
        this.cache.reCacheBoardData(this.boardId, false);

        columns.splice(index, 1);

        // Remove width of deleted column from total width
        // if (columns[index]?.width !== undefined) {
            // columns = this.addSubWidthToLastCol(columns, column.width, true);
        // }

        this.httpService.deleteCol(colId).subscribe((data: any) => {
            // Rebuild cache
            this.cache.reCacheBoardData(this.boardId);
        });

        if (subItems && api) {
            this.setColsDefs(api, columns);
        } else {
            // Refresh the table columns again
            this.updateColsToGroups(columns);
        }
    }

    /**
     * Delete group
     * @param groupIndex
     */
    deleteGroup(groupIndex = -1) {
        const groupId = this.dataTables[groupIndex].groupId;
        this.httpService.deleteGroup(groupId).subscribe((data: any) => {
        });

        this.dataTables.splice(groupIndex, 1);
        this.boardData.groups.splice(groupIndex, 1);

        // Update the cache
        this.cache.setBoardCache(this.boardId, this.boardData);

        // Regenerate the table as the group is deleted, needs to refresh indexes in cell renderer
        this.getBoardData();
    }

    /**
     * Create new item
     *
     * @param groupIndex
     * @param groupId
     * @param parentIndex
     * @param value
     */
    createNewItem(groupIndex = 0, groupId = 0, parentIndex = false, value: any = 'New item') {
        // Click on outer span ID 'outer-span' to hide the popup
        document.getElementById('outer-span')?.click();

        this.groupIndex = groupIndex;
        this.groupId = groupId;
        this.addNewRow(value);
    }

    /**
     * Add new lead, row to the table
     */
    addNewRow(itemVal = '') {
        const rowData = {item: itemVal, id: 0};
        this.setRowDataValue(this.groupIndex, this.groupId, rowData);
    }

    headerToggle() {
        (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
        (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
    }

    collapse(index = 0) {
        this.dataTables[index].expanded = !this.dataTables[index].expanded;
    }

    /**
     * Add new tab to popup tray
     *
     * @param name
     * @param slug
     * @param icon
     */
    addNewTabPopupTray(name = '', slug = '', icon = 'fa-file-invoice') {
        // find index of tab
        const index = this.trayTabs.findIndex((tab: any) => tab.slug === slug);

        // Check if tab already exists
        if (index === -1) {
            // Add new tab
            this.trayTabs.push({title: name, slug: slug, id: 0, is_default: 0, icon: icon, entity_type: slug});
            // Set back the tabs to local storage
            this.boardData.entry_tabs = this.trayTabs;
            this.cache.setBoardCache(this.boardId, this.boardData);

            // Todo: create new tab in database
        }

        // close popup
        const elem = <HTMLElement>document.querySelector('.js-close-btn-item-views-center');
        if (elem !== null) {
            elem.click();
        }
    }

    /**
     * Show entry detail popup tray
     *
     * @param recurring
     */
    showInvoicePopup(recurring = false, data = {}) {
        this.popupTrayType = 'invoice-form';
        this.isShowDetailPopup = true;
        this.popupTrayItem = {loaded: true, recurring: recurring, title: 'Invoices', columns: this.columns, boardId: this.boardId, row: data};

        if (this.boardData.type === 'invoice') {
            this.trayTabs = [{title: '+ Invoices', slug: 'invoices', id: 0, is_default: 0, icon: '', entity_type: ''}];
            this.boardTypeForInvoiceForm = 'invoice';
        } else if (this.boardData.type === 'estimate') {
            this.trayTabs = [{title: '+ Estimates', slug: 'estimates', id: 0, is_default: 0, icon: '', entity_type: ''}];
            this.popupTrayItem.title = 'Estimates';
            this.boardTypeForInvoiceForm = 'estimate';
        } else if (this.boardData.type === 'quote') {
          this.trayTabs = [{title: '+ Quotes', slug: 'quotes', id: 0, is_default: 0, icon: '', entity_type: ''}];
          this.popupTrayItem.title = 'quote';
          this.boardTypeForInvoiceForm = 'quote';
        }

        this.selectTabPopup = this.trayTabs[0].slug;
        this.setDefaultEntryData();
        this.popupTrayItem.board = {id: this.boardId, name: this.boardData.name, type: this.boardData.type};
    }

    /**
     * Show entry detail popup tray
     *
     * @param recurring
     */
    showDashTemplatePopup() {
        this.showDashTray = true;
    }

    /**
     * Show entry detail popup tray
     *
     * @param recurring
     */
    showEmailTemplatesTray(recurring = false) {
        this.popupTrayType = 'text-email-template';
        this.isShowDetailPopup = true;
        this.trayTabs = [
            {title: 'Text email', slug: 'text-email', id: 0, is_default: 0, icon: '', entity_type: ''},
        ];
        this.selectTabPopup = this.trayTabs[0].slug;
        this.popupTrayItem = {loaded: true, title: 'Text Email', columns: this.columns, boardId: this.boardId};
        this.setDefaultEntryData();
    }

    /**
     * Show entry detail popup tray
     *
     * @param recurring
     */
    showNewActivityTray(recurring = false) {
        this.popupTrayType = 'new-activity';
        this.isShowDetailPopup = true;
        this.trayTabs = [
            {title: 'New activity', slug: 'new-activity', id: 0, is_default: 0, icon: '', entity_type: ''},
        ];
        this.selectTabPopup = this.trayTabs[0].slug;
        this.popupTrayItem = {loaded: true, title: 'Schedule an activity', columns: this.columns, boardId: this.boardId};
        this.setDefaultEntryData();
    }

    /**
     * Show eligibility form popup tray
     *
     */
    showEligibilityPopup() {
        this.popupTrayType = 'eligibility-form';
        this.isShowDetailPopup = true;
        this.trayTabs = [
            {title: 'Eligibility', slug: 'eligibility', id: 0, is_default: 0, icon: '', entity_type: ''},
            {title: 'Map eligibility file', slug: 'map-eligibility-file', id: 0, is_default: 0, icon: '', entity_type: ''},
            {title: 'Generate eligibility file', slug: 'generate-eligibility-file', id: 0, is_default: 0, icon: '', entity_type: ''},
        ];
        this.selectTabPopup = this.trayTabs[0].slug;
        this.popupTrayItem = {loaded: true, title: 'Eligibility'};
        this.setDefaultEntryData();
    }

    /**
     * Show entry detail popup tray
     *
     * @param data
     * @param show
     * @param force
     */
    showDetailPopup(data: any, show = true, force = false) {
        // Conversation is only available for emails
        if (this.boardData.type == 'inbox' && show && data.email_id === undefined) {
            alert('Conversation is only available for emails!')
            return;
        }

        // check if board is campaigns board
        if( show && [ 'broadcast', 'sequence_email', 'broadcast_sms', 'sequence_sms' ].includes( this.boardData.type ) ) {

            if( this.boardData.type == 'sequence_email' ) {

                // Navigate to page with query params
                this.router.navigate(['campaigns/edit-email-sequence'], {queryParams: {id: data.id}}).then((data) => {
                });
            }
            if( this.boardData.type == 'broadcast' ) {

                // Navigate to page with query params
                this.router.navigate(['campaigns/email'], {queryParams: {type: 'broadcast', id: data.id}}).then((data) => {
                });
            }
            return;
        }

        if (show && ['invoice', 'estimate', 'quote'].includes(this.boardData.type)) {
            this.showInvoicePopup(false, data);

            return;
        }

        this.popupTrayType = 'entry-detail';

        if (!force) {
            this.isShowDetailPopup = show;

            if (!show) {
                return;
            }

            // Default primary data to push
            this.popupTrayItem = {id: data.id, title: data.item, row: data, loaded: false};

            // Set dynamic width for popup tray
            this.setTrayDynamicWidth();
        }

        // Get local checked data if available
        const localEntry = this.localStore.get('entry_' + data.id);
        if (this.boardData.type == 'inbox') {
            this.selectTabPopup = 'inbox';
            this.trayTabs = [
                {title: 'Inbox', slug: 'inbox', id: 0, is_default: 0, icon: '', entity_type: ''},
            ];
        } else if (this.boardData.type === 'appointment') {
            this.selectTabPopup = 'notifications';
            this.trayTabs = [
                {title: 'Notifications', slug: 'notifications', id: 0, is_default: 0, icon: '', entity_type: ''},
            ];
        } else {
            this.selectTabPopup = 'overview';
            this.trayTabs = [...this.boardData.entry_tabs];
            this.addNewTabPopupTray('Touchpoints', 'touchpoints', 'fa-file-invoice');

            // Rename tabs if module is 'RealEstate'
            const module = this.moduleService.getCurrentModule();
            if (module !== undefined && module.module == 'real-estate-crm') {
                this.trayTabs.forEach((tab: any) => {
                    if (tab.slug == 'overview') {
                        tab.title = 'Communications';
                    } else if (tab.slug == 'updates') {
                        tab.title = 'Activity';
                    } else if (tab.slug == 'activity-log') {
                        tab.title = 'Timeline';
                    } else if (tab.slug == 'touchpoints') {
                        tab.title = 'Touch points';
                    }
                });

                // Add extra tabs
                this.trayTabs.push({title: 'Property Details', slug: 'slug:property-details', icon: 'fa-home', id: 0, is_default: 0, entity_type: ''});
                this.trayTabs.push({title: 'Gallery', slug: 'gallery', icon: 'fa-gallery', id: 0, is_default: 0, entity_type: ''});
                this.trayTabs.push({title: 'Map', slug: 'map', icon: 'fa-map-marker-alt', id: 0, is_default: 0, entity_type: ''});
                this.trayTabs.push({title: 'Nearby Listings', slug: 'nearby-listings', icon: 'fa-map-marker-alt', id: 0, is_default: 0, entity_type: ''});
                this.trayTabs.push({title: 'Alerts!', slug: 'alerts', icon: 'fa-bell', id: 0, is_default: 0, entity_type: ''});
            }
        }

        // Attach local stored data if available
        if (localEntry && !force) {
            this.popupTrayItem = localEntry;
            this.setDefaultEntryData(data, force);

            // Reload again from cache to get the latest data from server
            this.showDetailPopup(data, show, true);
        } else {
            if (this.boardData.type == 'inbox') {
                this.httpService.getEmailThread(data.email_id).subscribe((res: any) => {
                    this.popupTrayItem.inbox = res;
                    this.setDefaultEntryData(data, force);
                    this.localStore.set('entry_' + data.id, this.popupTrayItem);
                });
            } else {
                // Get entry data from server if not cached already
                this.httpService.getEntryActivities(data.id).subscribe((entry: any) => {
                    this.popupTrayItem = entry;
                    this.setDefaultEntryData(data, force);
                    this.localStore.set('entry_' + data.id, this.popupTrayItem);
                });
            }
        }
    }

    setDefaultEntryData(data: any = false, force = false) {
        if (data) {
            this.popupTrayItem.id = data.id;
            this.popupTrayItem.row = data;
            this.popupTrayItem.title = data.item;
        }

        this.popupTrayItem.entryHeader = [];
        this.popupTrayItem.board = {id: this.boardId, name: this.boardData.name, type: this.boardData.type};
        this.popupTrayItem.loaded = true;

        if (!force) {
            this.setTrayDynamicWidth();
        }
    }

    closeSidebar(close:any = -1) {
        // Already closed
        if (close) {
            return;
        }

        // get element by class and add new class
        const sidebar = document.getElementsByClassName('sidebar-collapseable')[0];
        sidebar?.classList.add('closed');
    }

    setTrayDynamicWidth() {
        // Make maximum screen width for the popup tray
        const elemWidth = window.innerWidth;
        this.popupTrayItem.trayMinWidth = 500;

        const sidebar = document.getElementsByClassName('sidebar-collapseable')[0];
        const isClosedSidebar = sidebar?.classList.contains('closed');
        this.popupTrayItem.trayWidth = this.popupTrayItem.trayMaxWidth = elemWidth - 407;

        // If sidebar is NOT closed, close it
        if (!isClosedSidebar) {
            sidebar?.classList.add('closed');
        }

        // Set width to maximum if it's greater than maximum
        if (this.popupTrayItem.trayWidth > this.popupTrayItem.trayMaxWidth) {
            this.popupTrayItem.trayWidth = this.popupTrayItem.trayMaxWidth;
        }
    }

    showPopup(event: any, data: any, header = false) {
        this.popupStyleData = event;
        this.popupData = data;
        this.header = header;
    }

    /**
     * Check if column field is default column
     *
     * @param field
     */
    checkIfDefaultColumnField(field = '') {
        return ['new', 'checkbox', 'action'].includes(field);
    }


    onCellClicked(params: any) {
        if (
            params.event.target.dataset.action == 'toggle' &&
            params.column.getColId() == 'xyz'
        ) {
            const cellRendererInstances = params.api.getCellRendererInstances({
                rowNodes: [params.node],
                columns: [params.column],
            });
            if (cellRendererInstances.length > 0) {
                const instance = cellRendererInstances[0];
                instance.togglePopup();
            }
        }
    }

    /**
     * Re-arrange columns
     *
     * @param event
     */
    onDragStopped(event: any) {
        const colGrid = event.columnApi?.columnModel?.gridColumns;

        // create new array of columns id
        let newCols: any = [];
        colGrid.forEach((col: any) => {
            if (col.userProvidedColDef.cellRendererParams.id !== undefined && col.userProvidedColDef.cellRendererParams.id > 0) {
                newCols.push(col.userProvidedColDef.cellRendererParams.id);
            }
        });

        // Save column order in database
        this.cache.reCacheBoardData(this.boardId, false);
        const data = {board_id: this.boardId, action: 'rearrange', ids: newCols.join(',')};
        this.httpService.bulkActionsColumns(data).subscribe((response: any) => {
        });
    }

    /**
     * Unselect rows
     */
    unSelectRows() {
        this.gridApi[this.groupIndex].deselectAll();
    }

    //add header sorting rule
    addSortingRule() {
        if (this.selectedColForSorting && this.sortingTypeForCol) {
            let localBoard = this.cache.getBoardCache(this.boardId);
            this.boardData.groups = this.boardsFilterService.sortByColumn(localBoard.groups, this.selectedColForSorting, this.sortingTypeForCol, this.columns, this.boardData.columns);
            this.getBoardData(false, this.boardData);
        }
    }

    //remove header sorting rule
    removeSortingRule() {
        this.selectedColForSorting = '',
            this.sortingTypeForCol = 'asc';
        this.getBoardData();
    }

    // header search button
    filterSearch() {
        this.isSrarch = true;
    }

    // header search close
    filterSearchClose() {
        this.isSrarch = false;
    }

    // filter button with type open close
    filterType(event: any, trigger = false) {
        if (trigger) {
            // trigger click on class
            const elem = <HTMLElement>document.querySelector('.js-filter-button-popup');
            if (elem !== null) {
                elem.click();
            }

        }
        (event == 'advance' ? this.advanceFilter = true : this.advanceFilter = false);
        (event == 'quick' ? this.quickFilter = true : this.quickFilter = false);
    }

    // filter button with type open close
    sortPopup() {
        const elem = <HTMLElement>document.querySelector('.js-sort-button-popup');
        if (elem !== null) {
            elem.click();
        }
    }

    // add new filter row
    newFilterSort() {
        this.newFilter = true;
    }

    // new new filter row
    removeFilterSort() {
        this.newFilter = false;
    }

    /**
     * Move row to top
     * @param groupIndex
     * @param rowIndex
     */
    moveToTop(groupIndex = 0, rowIndex = 0) {
        this.groupIndex = groupIndex;
        const row = {...this.dataTables[groupIndex].rows[rowIndex]};

        // Remove row from its current position
        this.dataTables[groupIndex].rows.splice(rowIndex, 1);

        // Add row at top
        this.dataTables[groupIndex].rows.splice(0, 0, {...row});

        this.bulkActionsRows('move', 'top', this.dataTables[groupIndex].groupId, row.id);

        this.gridApi[this.groupIndex].setRowData(this.dataTables[groupIndex].rows);
        this.refreshTable();
    }

    updateColsToGroups(columns = <any>[]) {
        for (let i = 0; i < this.gridApi.length; i++) {
            this.setColsDefs(this.gridApi[i], columns);
        }
    }

    setColsDefs(api: any, columns = <any>[]) {
        api.setColumnDefs(columns);
        this.setLastColumnWidth(api);
    }

    /**
     * Kanban functions
     */

    /**
     * Connect board to column
     */
    connectBoard() {

    }

    triggerClick(event: any) {
        event.target.click();
    }

    /**
     * Handle opening entry detail popup based on URL parameters
     * @param groups
     */
    handleEntryDetailPopup(groups: any) {
      this.route.params.subscribe((queryParams) => {
        if(queryParams['tab'] && queryParams['rowId']) {
          let row: any;
          for (let i = 0; i < groups.length; i++) {
            row = groups[i].entries.find((row: any) => row.id == queryParams['rowId']);
            if (row !== undefined) {
              break;
            }
          }

          row.open_reply = queryParams['tab'];
          this.showDetailPopup(row);
        } else {
          return;
        }
      });
    }

    /**
     * Get tags
     */
    getTags() {
        const tags = this.cache.getTagsCache();
        if (tags) {
            this.tags = tags;
            this.addTagCounting();
        } else {
            this.httpService.getTags().subscribe((response: any) => {
                this.cache.setTagsCache(response);
                this.tags = response;
                this.addTagCounting();
            });
        }
    }

    /**
     * Add tag counting
     */
    addTagCounting() {
        this.tags.forEach((tag: any) => {
            tag.count = 0;
        });

        // get tag columns
        const tagColumns = this.boardData.columns.filter((column: any) => column.type == 'tags');

        this.boardData.groups.forEach((group: any) => {
            group.entries.forEach((entry: any) => {
                tagColumns.forEach((column: any) => {
                    if (entry[column.key] !== undefined) {
                        // split tags
                        const entryTags = entry[column.key].split(',');
                        entryTags.forEach((tag: any) => {
                            const tagIndex = this.tags.findIndex((t: any) => t.id == tag);
                            if (tagIndex > -1) {
                                this.tags[tagIndex].count++;
                            }
                        });
                    }
                });
            });
        });
    }

    /**
     * Create/Update tag
     */
    createTag(tagName: string, tagId = 0) {
        let data: any = {tag_name: tagName, tag_color: this.generateRandomColor()};
        if (tagId > 0) {
            data = {...data, tag_id: tagId};
        }

        this.cache.reCacheTagsData(false);
        this.httpService.createTag(data).subscribe((response: any) => {
            if (tagId > 0) {
                const tagIndex = this.tags.findIndex((t: any) => t.id == tagId);
                if (tagIndex > -1) {
                    this.tags[tagIndex] = response;
                }
            } else {
                this.tags.push(response);
            }

            // Set tag cache
            this.cache.setTagsCache(this.tags);
        });
    }

    deleteTag(tagId: number | string = 0) {
        const tagIndex = this.tags.findIndex((t: any) => t.id == tagId);
        if (tagIndex > -1) {
            this.tags.splice(tagIndex, 1);
        }

        this.cache.reCacheTagsData(false);
        this.httpService.deleteTag(tagId).subscribe((response: any) => {

            // Set tag cache
            this.cache.setTagsCache(this.tags);
        });
    }

    /**
     * Generate random color
     */
    generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    _onXlsFileUpload(input: any) {
        const files = input.srcElement.files;
        if (files[0]) {
            this.xlsFileName = files[0].name;
            readXlsxFile(files[0]).then((rows) => {
                [, ...this.xlsData] = rows;
                this.xlsColumnNames = rows[0].map((ele: any, i: number) => {
                    return {id: i, name: ele}
                });
                this.isXlsUploaded = true;
            }).catch((error)=>{console.log("readXlsxFile", error)})
        }
    }

    /* handle excel file upload */
    onXlsFileUpload(input: any) {
      this.resetXlsImportModal();
      const files = input.srcElement.files;
      if (files[0]) {
        this.xlsFileName = files[0].name;
        /* wire up file reader */
        const target = input.target;
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          const data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });
          [, ...this.xlsData] = data;
          this.xlsColumnNames = data[0].map((ele: any, i: number) => {
              return {id: i, name: ele}
          });
          this.isXlsUploaded = true;
        };
        reader.readAsBinaryString(target.files[0]);
      }
    }

    onRemoveXlsFile() {
        this.xlsData = null;
        this.isXlsUploaded = false;
    }

    onSelectItemName(name: string, index: any) {
        this.itemNameFromXlsData = {name, index};
    }

    onSelectMapColumn(xlsDataColumn: string, xlsColumnIndex: number, column: any) {

        Object.entries(this.xlsColumnsMap).forEach(entry => {
            const [key, value] = entry;
            if (value === xlsColumnIndex) {
                delete this.xlsColumnsMap[key]
            }
        });

        Object.entries(this.xlsColumnsMapUI).forEach(entry => {
            const [key, value] = entry;
            if (value === column.name) {
                delete this.xlsColumnsMapUI[key]
            }
        });

        this.xlsColumnsMap[column.key] = xlsColumnIndex;
        this.xlsColumnsMapUI[xlsColumnIndex] = column.name;
    }

    onSelectMergeMethod(col: string) {
        this.mergeByMethod = col;
    }

    onSelectMergeColumnKey(mergeType: string, column: any) {
        this.mergeColumnKey[mergeType].name = column.name;
        this.mergeColumnKey[mergeType].key = column.key;
    }

    onStartImport() {
        this.importStep = 5;
        const tempDataMap = Object.entries({...this.columnData});

        tempDataMap.forEach((ele: any) => {
            let colField = this.columns[ele[0]].field;
            colField && (this.xlsColumnsMap[colField] = ele[1].map((val: any) => {
                if (val.id || val.id == 0) {
                    return `{${val.id}}`
                }
                return val.display
            }).join(' '));
        });

        const importData = {
            "data": this.xlsData,
            "mergeByMethod": this.mergeByMethod, // new, skip, overwrite
            "mergeColumnKey": this.mergeColumnKey[this.mergeByMethod] || '', // For skip, overwrite: pass the column key
            "columnsMap": this.xlsColumnsMap,
            "board_id": this.boardId, // board id to import to
            "fileName": this.xlsFileName, // Group name
            "itemNameColumnIndex": this.itemNameFromXlsData.index, // the index of the column in the data array
        }

        this.httpService.importXlsData(importData).subscribe((res: any) => {
            this.isXlsImported = true;
            this.getBoardData(true);
            this.resetXlsImportModal();
        });
    }

    resetXlsImportModal() {
        this.xlsData = [];
        this.columnData = [];
        this.xlsFileName = '';
        this.isXlsUploaded = false;
        this.itemNameFromXlsData = {name: '', index: null};
        this.xlsColumnsMap = {};
        this.xlsColumnsMapUI = {};
        this.mergeByMethod = 'new';
        this.mergeColumnKey = {
            skip: {name: '', key: ''},
            overwrite: {name: '', key: ''},
        };
        this.isXlsImported = false;
        this.importStep = 1;
    }

    toggleColorPicker(group: any) {
      this.showColorPicker[group.groupId] = this.showColorPicker[group.groupId]? false : true;
    }

    updateGroupColor(group: any, color: string) {

        // find group index
        const groupIndex = this.boardData.groups.findIndex( ( groupObj: any ) => groupObj.id === group.groupId );

        // update group color on both objects
        this.boardData.groups[ groupIndex ].color = color;
        this.dataTables[ groupIndex ].color = color;

        // update group color in the database
        const data = {
            title: group.group,
            group_id: group.groupId,
            color: color,
        };
        this.httpService.updateGroup(group.groupId, data).subscribe((res: any) => {
            if(res){

                // update cache with new board data
                this.cache.setBoardCache( this.boardId, this.boardData );
            }
        });
    }

    updateTopDeals() {
      this.httpService.getTopDeals(10).subscribe((res: any) => {
        res.entries.forEach((entry: any) => {
          const stageCol = res.columns?.find((col: any) => col.key === 'stage');
          const stage = stageCol.statuses?.find((status: any) => status.id === entry.stage);
          entry.color = stage?.color || '#EDF1F7';
          entry.stageName = stage?.name || '';
        });
        this.localStore.set('topDeals', res);
      });
    }

    /**
     * Reset bulk emails object
     */
    resetBulkEmailsObj(){
        this.bulkEmailAction = {...this.bulkEmailActionObj};
    }

    updateBoardNameDescription() {
        this.editBoardName = this.editBoardDesc = false;
        const data = {
            name: this.boardData.name,
            description: this.boardData.description,
        }

        this.cache.setBoardCache(this.boardId, this.boardData);

        this.httpService.updateBoard(this.boardId, data).subscribe((res: any) => {
        });
    }

    onBoardMemberInputChange() {
      const text = this.boardMember;
      if (text) {
        this.filteredUsers = this.users.filter((user: any) => {
          return user.display_name.includes(text);
        });
      }
    }

    /**
     * Update board notifications
     */
    updateBoardNotifications() {
        // close modal by close button ID
        document.getElementById('btn-notificationmodal-close')?.click();

        // Remove cache for board subscriber
        this.localStore.remove('boardSub_' + this.boardId);

        const data = {
            user_id: this.user.ID,
            type: this.notifications.type,
            entity_type: 'board',
            entity_id: this.boardId
        };

        this.httpService.addSubscriber(data).subscribe((res: any) => {

            // Add again to cache
            this.localStore.set('boardSub_' + this.boardId, this.notifications);
        });
    }

    // add subscriber
    addSubscriber(user: any) {
      let data = {
        user_id: user.ID,
        type: '',
        entity_type: 'board_owner',
        entity_id: this.boardId
      }

      // set loader
      this.isAddingSubscriber = true;

      this.httpService.addSubscriber(data).subscribe((res: any) => {
        if(res) {
          this.subscribers = res;

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
      this.boardMember = '';
      this.filteredUsers = this.users;
    }

    // get subscribers
    getSubscribers() {
      if(this.boardId) {
        const data = {
            entity_type: 'board_owner',
            entity_id: this.boardId
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

    getBoardSubscribers() {
        this.loadBoardSubscribers = false;
        const boardSub = this.localStore.get('boardSub_' + this.boardId);

        if (boardSub) {
            this.notifications.type = boardSub.type;
            this.loadBoardSubscribers = true;
            return;
        }
        {
            const data = {
                entity_type: 'board',
                entity_id: this.boardId
            }

            this.httpService.getBoardSubscribers(data).subscribe((res: any) => {
                if (res.type !== undefined) {
                    this.notifications.type = res.type;
                } else {
                    this.notifications.type = '';
                }

                this.localStore.set('boardSub_' + this.boardId, this.notifications);

                this.loadBoardSubscribers = true;
            });
        }
    }

    // convert subscriber short name
    getShortName(subscriber: any) {
        if( subscriber == undefined || !subscriber ) {
          return '';
        }
        if( !isNaN( subscriber ) ) {
          const user = this.users.filter( ( userObj: any ) => {
            return userObj.ID == subscriber;
            } );
          return user[0]?.fname.substring(0, 1) + user[0]?.lname.substring(0, 1);
        } else {
          return subscriber.user.fname.substring(0, 1) + subscriber.user.lname.substring(0, 1);
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

    editBoard(focusId = 'editBoardName') {
        this.editBoardName = this.editBoardDesc = false;

        if (focusId === 'editBoardName') {
            this.editBoardName = true;
        } else {
            this.editBoardDesc = true;
        }

        setTimeout(() => {
            document.getElementById(focusId)?.focus();
        }, 100);
    }

    savePermissions() {
        console.log('savePermissions', this.boardData.settings);
        this.updateBoardSettings();
        document.getElementById('close-btn-permissions')?.click();
    }

    changePermissions() {
        switch (this.boardData.settings.permissions.editing_permission.option) {
            case 'everything':
                this.allowedItems = ['items', 'updates', 'views', 'columns', 'groups', 'automations'];
                break;
            case 'edit_without_changing_structure':
                this.allowedItems = ['items', 'updates', 'views'];
                break;
            case 'only_assigned_people':
                this.allowedItems = ['assigned items including subitems','assigned subitems','updates'];
                break;
            case 'only_updates':
                this.allowedItems = ['updates'];
                break;
        }
    }

    updateBoardSettingsNotification() {
        this.updateBoardSettings();
    }

    /**
     * Save board terminology
     * @param terminology
     */
    saveTerminology(terminology: any) {
        terminology = terminology.trim();
        this.updateBoardSettings('terminology', terminology);
    }

    /**
     * Open shareable/private/main modal to change board type
     *
     * @param type
     */
    openBoardTypeModal(type = 'main') {
        type = this.boardData.settings.type == type ? 'main' : type;

        this.boardTypeModel = {
            current: this.boardData.settings.type,
            changeTo: type,
            boardId: this.boardId
        }
    }

    /**
     * Save board type
     * @param data
     */
    saveBoardType(data:any = false) {
        if (!data) {
            return;
        }

        const type = data.changeTo;
        this.updateBoardSettings('type', type);
    }

    /**
     * Full screen browser window
     */
    fullScreen() {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch((err: any) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /**
     * Archive or unarchive board
     */
    archiveBoard() {
        const archiveOrUnarchive = this.boardData?.status === 'archive' ? 'unarchive' : 'archive';

        if (!confirm(`Are you sure you want to ${archiveOrUnarchive} this board?`)) {
            return;
        }

        const data = {
            action: archiveOrUnarchive,
            id: this.boardId,
        }

        this.httpService.postBoardsBulk(data).subscribe((res: any) => {
            this.getBoardData(true);
        });
    }

    /**
     * Delete board
     */
    deleteBoard() {
        // Add confirmation to delete board alert
        if (!confirm('Are you sure you want to delete this board?')) {
            return;
        }

        const data =  {
            action: 'delete',
            id: this.boardId,
        }

        this.httpService.postBoardsBulk(data).subscribe((res: any) => {
            if (res) {
                this.router.navigate(['/']);

                // rebuild menu
                this.appComponent.getMenuItems(true, true);
            }
        });
    }

    exportToExcel() {
        // Export board data to excel using lib XLSX
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.boardData.groups);
        // const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // XLSX.writeFile(wb, 'board.xlsx');
    }

    collapseAllGroups(index = -1) {
        const expandValue = index === -1 ? false : !this.dataTables[index].expanded;
        for (let i = 0; i < this.dataTables.length; i++) {
            this.dataTables[i].expanded = expandValue;
        }
    }

    saveBoardAsTemplate() {
        const data = {
            action: 'save-as-template',
            id: this.boardId,
        }

        this.httpService.postBoardsBulk(data).subscribe((res: any) => {
            // Reload board data again.
            this.getBoardData(true);
        });
    }

    /**
     * Select or deselect all items in grid
     *
     * @param groupIndex
     * @param select
     */
    selectDeselectAll(groupIndex = 0, select = true) {
        if (select) {
            this.gridApi[groupIndex].selectAll();
        } else {
            this.gridApi[groupIndex].deselectAll();
        }
    }

    filterNewColumns() {
      if(!this.newColumnsFilterText) {
        this.newColumns = NEW_COLUMNS;
      } else {
        this.newColumns = NEW_COLUMNS;
        let filteredData: any = {};
        Object.entries(this.newColumns).forEach(([key, value]) => {
          const values: any = value|| []
          filteredData[key] = values?.filter((item: any) => {
            // console.log('item', item)
            return item?.title.toLowerCase()?.includes(this.newColumnsFilterText?.toLowerCase());
          });
        });
        this.newColumns = {...filteredData};
      }
    }
}
