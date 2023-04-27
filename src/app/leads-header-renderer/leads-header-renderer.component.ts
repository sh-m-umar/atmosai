import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {BoardsComponent} from "../boards/boards.component";
import {GlobalFunctionService} from "../global-function.service";
import {ICellRendererParams} from "ag-grid-community";

@Component({
    selector: 'app-leads-header-renderer',
    templateUrl: './leads-header-renderer.component.html',
    styleUrls: ['./leads-header-renderer.component.scss']
})
export class LeadsHeaderRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public cellValue!: string;
    public cellData: string = '';
    public boardsComponent: any;
    public editMode: boolean = false;
    public currentCell: string = '';
    public colName: string = '';
    public colDescription: string = '';
    public instanceId = 0;
    public colId: number | string = 0;
    public mark = true;
    public typeCol = 'text';
    public viewDescription = false;
    public editDescription = false;
    public subPopupType: any = false;
    public isSubTable = false;
    public api = false;
    public event: any;
    public settings: any;
    public collapsed = false;
    public connectNewBoards = true;
    public colParams: any;
    private groupIndex: any;
    public selectedBoards: any = [];
    public temp: any = true;
    public statuses: any = [];
    public statusColsObj: any = {statusCols: [], errorTxt: '', isValid: true, distributeEqually: false};
    public showPalletPop = false;

    constructor(boardsComponent: BoardsComponent, public globalFunctions: GlobalFunctionService) {
        this.boardsComponent = boardsComponent;
    }

    // gets called once before the renderer is used
    agInit(params: any): void {
        this.params = params;
        this.colParams = this.params.column.userProvidedColDef.cellRendererParams !== undefined ? this.params.column.userProvidedColDef.cellRendererParams : {};
        this.typeCol = this.params.column.userProvidedColDef.cellRendererParams != undefined && this.params.column.userProvidedColDef.cellRendererParams.typeCol != undefined ? this.params.column.userProvidedColDef.cellRendererParams.typeCol : 'text';
        this.colDescription = this.params.column.userProvidedColDef.cellRendererParams != undefined && this.params.column.userProvidedColDef.cellRendererParams.description != undefined ? this.params.column.userProvidedColDef.cellRendererParams.description : '';
        this.collapsed = this.params.column.userProvidedColDef.cellRendererParams != undefined && this.params.column.userProvidedColDef.cellRendererParams.collapsed != '0';
        this.colId = this.params.column.userProvidedColDef.cellRendererParams != undefined && this.params.column.userProvidedColDef.cellRendererParams.id != undefined ? this.params.column.userProvidedColDef.cellRendererParams.id : '';
        this.settings = this.params.column.userProvidedColDef.cellRendererParams != undefined && this.params.column.userProvidedColDef.cellRendererParams.settings != undefined ? this.params.column.userProvidedColDef.cellRendererParams.settings : '{}';
        this.instanceId = this.params.column.instanceId != undefined ? this.params.column.instanceId : 0;
        this.colName = this.params.column.colId != undefined ? this.params.column.colId : '';
        this.currentCell = params.colDef?.field != undefined ? params.colDef?.field : '';
        this.cellValue = this.params.displayName;
        this.isSubTable = this.isSubItems();
        this.api = this.isSubTable ? this.params.api : false;

        if (this.typeCol == 'connect-boards') {
            this.populateConnectedBoards();
        }

        try {
            this.settings = typeof this.settings == 'string' ? JSON.parse(this.settings) : this.settings;
        } catch (error) {
        }

        if (this.typeCol == 'status') {
            this.statuses = this.params.column.userProvidedColDef.cellRendererParams.statuses != undefined ? this.params.column.userProvidedColDef.cellRendererParams.statuses : [];
        }

        // const listener = (event: any) => {
        //     const colIndex = this.boardsComponent.columns.findIndex((col: any) => col.cellRendererParams.id == this.colId);
        //     this.boardsComponent.columns[colIndex].width = event.column.actualWidth;
        //     for (let i = 0; i < this.boardsComponent.dataTables.length; i++) {
        //         if (this.boardsComponent.gridApi[i] !== undefined) {
        //             this.boardsComponent.gridApi[i].setColumnDefs(this.boardsComponent.columns);
        //         }
        //     }
        // };

        // this.params.column.addEventListener('widthChanged', listener);
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
     * Update status
     *
     * @param status
     * @param index
     */
    updateStatusLabel(status: any, index: number) {
        this.boardsComponent.updateStatus(status).subscribe((res: any) => {
            this.statuses[index].id = res.id;
        });
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
     * Get parsed settings
     */
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

        if (this.settings == '' || this.settings == undefined) {
            switch (this.typeCol) {
                case 'connect-boards':
                    this.settings = {boards: [], mirror: []};
                    break;
                case 'mirror':
                    this.settings = {connectedBoard: 0, column: '', boardColumn: ''};
                    break;
            }
        }

        return this.settings;
    }

    // gets called whenever the user gets the cell to refresh
    refresh(params: any) {
        // set value into cell again
        // this.cellValue = '';
        return true;
    }

    updateCol() {
        if (this.cellValue == '') {
            this.cellValue = this.params.displayName;
        }

        this.boardsComponent.updateCol(this.cellValue, this.colId, this.isSubTable, this.api, this.colParams);
        this.editMode = false;
    }

    deleteCol() {
        this.boardsComponent.deleteCol(this.colId, this.isSubTable, this.api);
    }

    editColumn() {
        this.editMode = true;
    }

    addNewCol(colName: string, leftColName = '', type = 'text') {
        const colData = {
            name: colName,
            leftCol: leftColName,
            type: type,
            settings: ''
        };
        this.boardsComponent.addNewCol(colData, this.isSubTable, this.api);
    }

    getValueToDisplay(params: ICellRendererParams) {

        return params.valueFormatted ? params.valueFormatted : params.value;
    }

    showPopup(event: any, type: any = false) {
        this.subPopupType = type;
        this.boardsComponent.showPopup(event, this, true);
    }

    updateDescription() {
        this.boardsComponent.updateDescription(this.colName, this.colId, this.colDescription, this.isSubTable);
        this.resetSubPopups();
    }

    colCollapse(collapsed = true) {
        this.collapsed = collapsed;
        this.boardsComponent.colCollapse(this.colName, this.colId, this.isSubTable, this.api, collapsed);
    }

    colDuplicate(DuplicateValues = false) {
        this.boardsComponent.colDuplicate(this.colName, DuplicateValues, this.isSubTable, this.api);
    }

    showSubPopup(type = 'edit-description', event: any = false) {
        this.resetSubPopups();
        this.subPopupType = type;
        if (event) {
            this.showPopup(event, type);
        }
    }

    changeColType(index = 0) {
        this.boardsComponent.changeColType(index, this.colName);
    }

    resetSubPopups() {
        this.subPopupType = false;
    }

    isSubItems() {
        if (this.params.columnApi.columnModel.columnDefs === undefined) {
            return false;
        }

        return this.params.columnApi.columnModel.columnDefs[0].cellRendererParams.sub
    }

    /**
     * Get category columns array
     */
    getEssentialColumns(cat = 'essential') {
        // search category columns from array filter
        return this.boardsComponent.colTypes.filter((item: any) => item.cat == cat);
    }

    /**
     * Save column settings
     */
    saveSettings(data: any, reloadConnectedBoards = false) {
        let columns = this.isSubItems() ? this.boardsComponent.subColumns : this.boardsComponent.columns;
        const colIndex = columns.findIndex((col: any) => col?.cellRendererParams?.id == this.colId);

        if (colIndex > -1) {
            columns[colIndex].cellRendererParams.settings = data;
            this.settings = data;
            this.boardsComponent.setColSettings(this.colId, data, this.isSubItems(), reloadConnectedBoards);
        }
    }

    /**
     * Add new mirror column
     */
    addMirrorColumn(boardId: 0) {
        const colData = {
            name: 'Mirror',
            leftCol: this.colName,
            type: 'mirror',
            settings: JSON.stringify({connectedBoard: boardId, column: '', boardColumn: this.colName})
        };

        this.boardsComponent.addNewCol(colData, this.isSubTable, this.api);
    }

    /**
     * Update connect boards
     */
    connectBoards(connected = true) {
        console.log('connectBoards', this.connectBoards);
        if (connected && this.selectedBoards.length > 0) {
            this.connectNewBoards = false;
        }

        const data = {boards: this.selectedBoards, mirror: []};
        this.saveSettings(data, true);
    }

    /**
     * Get all status columns
     */
    getStatusColumns() {
        if (this.statusColsObj.statusCols.length == 0) {
            const statusesCols = this.boardsComponent.columns.filter((col: any) => col.cellRendererParams.typeCol == 'status');
            const settings = this.getSettings();

            this.statusColsObj.statusCols = statusesCols.map((col: any) => {
                return {
                    id: col.cellRendererParams.id,
                    key: col.field,
                    name: col.headerName,
                    percentage: settings.statusCols.find((item: any) => item.id == col.cellRendererParams.id)?.percentage || 0,
                    enabled: settings.statusCols.find((item: any) => item.id == col.cellRendererParams.id)?.enabled || 0,
                }
            });
        }

        return this.statusColsObj.statusCols;
    }

    /**
     *
     */
    updateProgressTracking(event:any = false) {
        // if (event) {
        //     event.startPropagation();
        // }
        this.saveSettings(this.statusColsObj);
    }

    distributeWeight() {
        if (this.statusColsObj.distributeEqually) {
            const totalEnabled = this.statusColsObj.statusCols.filter((item: any) => item.enabled).length;
            const singleWeight = 100 / totalEnabled;

            for (let i = 0; i < this.statusColsObj.statusCols.length; i++) {
                if (this.statusColsObj.statusCols[i].enabled) {
                    this.statusColsObj.statusCols[i].percentage = singleWeight;
                }
            }
        }

        this.validateWeight();
    }

    validateWeight() {
        let totalWeight = 0;
        for (let i = 0; i < this.statusColsObj.statusCols.length; i++) {
            if (this.statusColsObj.statusCols[i].enabled) {
                totalWeight += this.statusColsObj.statusCols[i].percentage;
            }
        }

        if (totalWeight > 100) {
            this.statusColsObj.errorTxt = 'Total weight cannot be more than 100%';
        } else if (totalWeight < 100) {
            this.statusColsObj.errorTxt = 'Total weight cannot be less than 100%';
        }

        console.log(totalWeight);

       return this.statusColsObj.isValid = totalWeight == 100;
    }

    /**
     * Add/remove select boards array when click on checkbox
     *
     * @param id
     * @param disconnect
     */
    updateSelectedBoard(id: any, disconnect = false) {
        if (this.selectedBoards.indexOf(id) == -1) {
            // If multiple selection is not allowed (currently forcefully disabled)
            this.selectedBoards = [];
            this.selectedBoards.push(id);
        } else {
            this.selectedBoards.splice(this.selectedBoards.indexOf(id), 1);
        }

        // disconnect board
        if (disconnect) {
            if (this.selectedBoards.length == 0) {
                this.connectNewBoards = true;
            }

            this.connectBoards(false);
        }
    }

    disconnectBoard(id: any) {

    }

    /**
     * Get filtered Boards
     */
    getFilteredBoards() {
        return this.boardsComponent.allBoards.filter((board: any) => board.id != this.boardsComponent.boardId);
    }

    populateConnectedBoards() {
        const settings = this.getSettings();
        this.selectedBoards = settings.boards !== undefined ? settings.boards : [];
        if (this.selectedBoards.length > 0) {
            this.connectNewBoards = false;
        }
    }

    /**
     * Get filtered Boards
     */
    getBoardById(id = 0) {
        const board = this.boardsComponent.allBoards.filter((board: any) => board.id == id);
        return board.length > 0 ? board[0] : false;
    }

    /**
     * Get board name by ID
     * @param id
     */
    getBoardNameById(id = 0) {
        const board = this.getBoardById(id);
        return board ? board.name : '';
    }

    /**
     * Get board columns by ID
     * @param id
     */
    getBoardColumnsById(id = 0) {
        const board = this.getBoardById(id);
        return board ? board.columns : [];
    }

    selectMirrorCol(column: any) {
        // hide the dropdown popup after select
        const elems = document.getElementsByClassName('dropdown-parent-mirror') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < elems.length; i++) {
            elems[i].click();
        }

        let settings = this.getSettings();
        settings.column = column;
        this.saveSettings(settings, false);

        // Reload board
        this.boardsComponent.getBoardData();
    }
}
