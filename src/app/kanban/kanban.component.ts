import {Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {BoardsComponent} from "../boards/boards.component";
import {BoardService} from "../board.service";

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
    @Input() pipeline: any;
    public addNewColmn = false;
    public addNewCol = false;
    public defaultdropCols = false;
    public newStatusName = '';
    public statuses: any = [];
    public connectedContacts: any = [];
    public entries: any = [];
    public entriesObj: any = {};
    public entryObjDefault: any = {confidence: 50};
    public entryObj: any = {...this.entryObjDefault};
    public outStatus = {won: 0, abandoned: 0, lost: 0};

    constructor(public boardService: BoardService, public boardsComponent: BoardsComponent) {
        this.buildStatuses();
    }

    openTray(){
        const data = {id: 1}
        this.boardsComponent.showDetailPopup(data);
    }

    ngOnInit(): void {
        this.getContacts();
    }

    ngOnChanges(changes: any) {
        if (changes.pipeline !== undefined) {
            this.buildStatuses();
        }
    }

    /**
     * Set contacts from connected board
     */
    getContacts() {
        this.boardService.getBoardRowsByBoardId(3).then((res: any) => {
            this.connectedContacts = res;
        });
    }

    /**
     * Build statuses from board data
     */
    buildStatuses() {
        this.statuses = [];
        const stageCol = this.boardsComponent.boardData.columns.find((col: any) => col.key === 'stage');

        if (stageCol && stageCol.statuses !== undefined) {
            this.statuses = stageCol?.statuses;
        }

        this.attachEntries();
    }

    /**
     * Build status IDs for out status |  won, abandoned and lost
     * @param status
     */
    collectStatusIdsForOutStatus(status:any = false) {
        if (!status) {
            return;
        }

        switch (status.name.toLowerCase().trim()){
            case 'won':
                this.outStatus.won = status.id;
                break;
            case 'abandoned':
                this.outStatus.abandoned = status.id;
                break;
            case 'lost':
                this.outStatus.lost = status.id;
                break;
        }
    }

    /**
     * Attach entries to statuses
     */
    attachEntries() {
        this.entriesObj = {};
        for (let iStatus = 0; iStatus < this.statuses.length; iStatus++) {
            this.collectStatusIdsForOutStatus(this.statuses[iStatus]);
            this.entriesObj['st_' + this.statuses[iStatus].id] = [];
            for (let i = 0; i < this.boardsComponent.boardData.groups.length; i++) {
                const entries = this.boardsComponent.boardData.groups[i].entries
                    .filter((entry: any) =>
                        entry?.stage === this.statuses[iStatus].id &&
                        this.boardsComponent.selectedPipeline !== undefined &&
                        entry?.pipeline === this.boardsComponent.selectedPipeline.id
                    );
                if (entries.length > 0) {
                    this.entriesObj['st_' + this.statuses[iStatus].id].push(...entries);
                }
                // this.entries = [...this.entries, ...this.boardsComponent.boardData.groups[i].entries];
            }
        }
    }

    /**
     * Create new status column
     */
    createNewStatus() {
        const availableColors = this.boardsComponent.getAvailablePallets(this.statuses);

        if (availableColors.length == 0) {
            return;
        }

        const statusColIndex = this.boardsComponent.boardData.columns.findIndex((col: any) => col.key === 'stage');

        if (statusColIndex < 0) {
            return;
        }

        const newStatusIndex = this.boardsComponent.boardData.columns[statusColIndex]?.statuses?.length;
        this.boardsComponent.boardData.columns[statusColIndex].statuses.push({
            id: 0,
            column_id: this.boardsComponent.boardData.columns[statusColIndex].id,
            name: this.newStatusName,
            color: availableColors[0]
        });

        // Build again statuses to load the updated data even before the API call
        this.buildStatuses();

        // Update data to the server
        this.updateStatus(this.statuses[newStatusIndex], statusColIndex, newStatusIndex);

        // Reset form
        this.newStatusName = '';
        this.addNewCol = false;
    }

    /**
     * Update status column name and color
     *
     * @param index
     */
    updateStatusColumn(index = -1) {
        this.statuses[index].name = this.statuses[index]?.name?.trim();
        this.statuses[index].isEdit = false;

        // update in database
        const statusColIndex = this.boardsComponent.boardData.columns?.findIndex((col: any) => col.key === 'stage');
        this.updateStatus(this.statuses[index], statusColIndex, index);
    }

    /**
     * Update status to the server
     *
     * @param data
     * @param statusColIndex
     * @param newStatusIndex
     */
    updateStatus(data: any, statusColIndex = -1, newStatusIndex = -1) {
        // Reset board cache to it can be reloaded on next load
        this.boardsComponent.cache.reCacheBoardData(this.boardsComponent.boardId, false);

        // Update in DB
        this.boardsComponent.updateStatus(data).subscribe((res: any) => {
            this.boardsComponent.boardData.columns[statusColIndex].statuses[newStatusIndex].id = res?.id;
            this.buildStatuses();
        });
    }

    drop(event: CdkDragDrop<any[]>, statusId = 0) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            // Update status after moving to another status column
            this.updateEntryStatus(statusId, event.container.data[event.currentIndex].id);
        }

        this.defaultdropCols = false;
    }

    /**
     * Move entry to Abandoned, Lost or Won
     *
     * @param event
     * @param statusId
     * @param statusName
     */
    dropTo(event: CdkDragDrop<any[]>, statusId = 0, statusName = '') {

        if (event.previousContainer === event.container) {
            // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            if (statusId) {
                // Update status after moving to another status column
                this.updateEntryStatus(statusId, event.container.data[event.currentIndex].id);

                // Move to appropriate group
                this.boardsComponent.updateGroupStatus(false, event.container.data[event.currentIndex].id, event.container.data[event.currentIndex].group_id, statusName, statusId);
            }
        }

        this.defaultdropCols = false;
    }

    // display won abandoned and lost popup while dragging
    dragStart(event: CdkDragStart) {
        this.defaultdropCols = true;
    }

    /**
     * Update status after moving to another status column
     * @param statusId
     * @param entryId
     */
    updateEntryStatus(statusId = 0, entryId = 0) {
        if (statusId <= 0 || entryId <= 0) {
            return;
        }

        const rowData = {board_id: this.boardsComponent.boardId, entry_id: entryId, key: 'stage', content: '' + statusId};
        this.boardsComponent.cache.reCacheBoardData(this.boardsComponent.boardId, false);
        this.boardsComponent.httpService.updateRowMeta(rowData)
            .subscribe((data: any) => {

            });
    }

    /**
     * Get sum value for whole column opportunities
     * @param statusId
     * @param type - 'annualized' or 'monthly' or 'one-time' or 'annual'
     */
    getValueSum(statusId = 0, type = 'annualized') {
        let sum = 0.0; // I am using 0.0 instead of 0 because I am using float values
        const entries = this.entriesObj['st_' + statusId] !== undefined ? this.entriesObj['st_' + statusId] : [];

        // Start the loop and add the value of each item in the array to the sum variable
        if (entries.length > 0) {
            for (let i = 0; i < entries.length; i++) {
                const frequency = entries[i].frequency !== undefined ? entries[i].frequency.toLowerCase().trim() : 'one time';
                const frequencyNum = frequency === 'monthly' ? 12 : 1;
                const confidence = entries[i].confidence !== undefined && parseFloat(entries[i].confidence) > 0 ? parseFloat(entries[i].confidence) : 100;
                const value = entries[i].deal_value !== undefined && parseFloat(entries[i].deal_value) > 0 ? parseFloat(entries[i].deal_value) : 0;
                let newSum = 0;

                // Handle different types frequency
                switch (type) {
                    case 'annualized':
                        newSum += value * frequencyNum;
                        break;
                    case 'monthly':
                        if (frequency === 'monthly') {
                            newSum += value;
                        }
                        break;
                    case 'one-time':
                        if (frequency === 'one time') {
                            newSum += value;
                        }
                        break;
                    case 'annual':
                        if (frequency === 'annually') {
                            newSum += value;
                        }
                        break;
                }

                // If actual then show the exact value otherwise apply confidence percentage
                sum += this.boardsComponent.selectedOptionKanban === 'actual' ? newSum : newSum * confidence / 100;
            }
        }

        // Return zero if sum is NaN
        if (isNaN(sum)) {
            return 0;
        }

        // return number with 2 decimal places
        return Math.round(sum * 100) / 100;
    }

    /**
     * Edit entry from list
     *
     * @param statusId
     * @param index
     * @param isEdit
     */
    editEntry(statusId = 0, index = 0, isEdit = true) {
        this.entriesObj['st_' + statusId][index].isEdit = isEdit;
        this.entryObj = this.entriesObj['st_' + statusId][index];

        if (!isEdit) {
            // Delete entry from list if it is new form and not added yet
            if (this.entryObj.id == 0) {
                this.entriesObj['st_' + statusId].splice(index, 1);
            }

            this.entryObj = {...this.entryObjDefault};
        }
    }

    /**
     * Edit entry from list
     *
     * @param statusId
     * @param index
     * @param isEdit
     */
    deleteEntry(statusId = 0, index = 0, isEdit = true) {
        const entry = this.entriesObj['st_' + statusId][index];
        if (entry.id > 0) {
            this.boardsComponent.cache.reCacheBoardData(this.boardsComponent.boardId, false);
            const rowId = entry.id;
            this.entriesObj['st_' + statusId].splice(index, 1);
            this.boardsComponent.httpService.deleteRow(rowId).subscribe((response: any) => {
            });
        }
    }

    /**
     * Delete status column
     *
     * @param index
     */
    deleteColumn(index = -1) {
        if (index < 0) {
            return;
        }

        const columnIndex = this.boardsComponent.boardData.columns.findIndex((col: any) => col.key === 'stage');

        // Check if column exists
        if (columnIndex < 0 || this.boardsComponent.boardData.columns[columnIndex].statuses === undefined) {
            return;
        }

        const statusId = this.statuses[index].id;

        // Delete column from board and kanban both
        this.boardsComponent.boardData.columns[columnIndex].statuses.splice(index, 1);
        this.boardsComponent.cache.reCacheBoardData(this.boardsComponent.boardId, false);
        this.boardsComponent.removeStatus(statusId);

        // Rebuild statuses
        this.buildStatuses();
    }

    /**
     * Update entry
     */
    updateEntry() {
        let rowData: any = {
            action: 'add-full-entry',
            board_id: this.boardsComponent.boardId,
            ...this.entryObj
        };

        // If no pipeline is selected, add it current pipeline
        if (rowData.pipeline === undefined) {
            rowData.pipeline = this.boardsComponent.selectedPipeline.id;
        }

        // Assign default values for new entry
        if (rowData.id === undefined) {
            rowData.id = 0;
            this.entriesObj['st_' + rowData.stage].splice(0, 0, rowData);
        }

        this.boardsComponent.cache.reCacheBoardData(this.boardsComponent.boardId, false);
        this.entryObj.isEdit = false;

        // Update entry in database
        this.boardsComponent.httpService.bulkActionsRows(rowData).subscribe((res: any) => {
            if (rowData.id === undefined || rowData.id == 0) {
                const index = this.entriesObj['st_' + rowData.stage].findIndex((entry: any) => entry.id == 0);
                if (index >= 0) {
                    this.entriesObj['st_' + rowData.stage][index] = res;
                }
            }

            this.entryObj = {...this.entryObjDefault};
        });
    }

    /**
     * Add new entry
     */
    addNewEntry(statusId = 0) {
        const data = {
            id: 0,
            pipeline: this.boardsComponent.selectedPipeline.id,
            stage: statusId,
            ...this.entryObjDefault
        }

        this.entriesObj['st_' + statusId].splice(0, 0, data);

        this.editEntry(statusId, 0);
    }

    /**
     * Fold/unfold column status
     *
     * @param index
     * @param isFold
     */
    foldCol(index = 0, isFold = true) {
        this.statuses[index].folded = isFold;
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

        if (column === undefined) {
            return;
        }

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
}
