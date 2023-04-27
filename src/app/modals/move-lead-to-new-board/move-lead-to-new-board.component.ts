import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnyAaaaRecord } from 'dns';
import { lastValueFrom } from 'rxjs';
import { CacheService } from 'src/app/cache.service';
import { HttpService } from 'src/app/http.service';
import { LocalService } from 'src/app/local.service';

@Component({
  selector: 'app-move-lead-to-new-board',
  templateUrl: './move-lead-to-new-board.component.html',
  styleUrls: ['./move-lead-to-new-board.component.scss']
})
export class MoveLeadToNewBoardComponent implements OnInit {

  @Input() moveEntryData: any;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  public step = 1;
  public b1MissedColumns: any[] = []; // columns of current board that are not mapped
  public b2MissedColumns: any[] = []; // columns of new board that are mapped
  public setOfColumnsToBeMapped: any[] = [];

  sameTypeCols: any[] = [];

  constructor(
    private httpService: HttpService,
    private localStore: LocalService,
    public cache: CacheService,
  ) {}

  ngOnInit() {
    this.setData();
  }

  close() {
    this.closeModal.emit();
  }

  setData() {
    this.moveEntryData?.currentBoard?.columns?.forEach((col: any) => {
      const b2Cols = this.moveEntryData?.newBoard?.columns?.filter((col2: any) => { return col2?.type === col?.type}) || [];

      this.setOfColumnsToBeMapped.push({b1Col: col, b2Cols, selectedCol: {}});
    });

    this.updateMissedColumns();
  }

  onColumnSelect() {
    this.updateMissedColumns();
  }

  updateMissedColumns() {
    this.b1MissedColumns = [];
    this.b2MissedColumns = [];

    this.moveEntryData?.currentBoard?.columns?.forEach((col: any) => {
      let check = false;
      this.setOfColumnsToBeMapped?.forEach((mapCol: any) => {
        if(col?.id === mapCol?.b1Col?.id && mapCol?.selectedCol?.id) {
          check = true;
        }
      });
      !check && (this.b1MissedColumns.push(col));
    });

    this.moveEntryData?.newBoard?.columns?.forEach((col: any) => {
      let check = false;
      this.setOfColumnsToBeMapped?.forEach((mapCol: any) => {
        if(col?.id === mapCol?.selectedCol?.id) {
          check = true;
        }
      });
      !check && (this.b2MissedColumns.push(col));
    });
  }

  moveItem() {
    this.step = 2;
  }

  async moveToBoard() {
    this.close();
    this.moveEntryData?.rowIds?.forEach(async (rowId: any, index: number) => {
      let isLastElement = index === (this.moveEntryData?.rowIds?.length - 1);
      let rowData: any;

      const board = await this.getBoardData(this.moveEntryData?.currentBoard?.id);

      board?.groups?.every((group: any) => {
        return group?.entries?.every((entry: any) => {
          if(entry?.id === rowId) {
            rowData = entry;
            return false;
          }
          return true;
        });
      });

      let data: any = {
        board_id: this.moveEntryData?.newBoard?.id,
        group_id: this.moveEntryData?.newGroupId,
        parent_id: 0,
        title: rowData?.item,
      };

      this.setOfColumnsToBeMapped.forEach((set: any) => {
        if(set?.b1Col?.key && set?.selectedCol?.key) {
          let currentKey = set?.b1Col?.key;
          let newKey = set?.selectedCol?.key;
          data[newKey] = rowData[currentKey];
        }
      });

      this.addEntryInBoard(data, rowId, isLastElement);
    });
  }

  async getBoardData(boardId: number) {
    let localBoard: any = this.cache.getBoardCache(boardId);

    if (!localBoard) {
      const board$ = this.httpService.getSingleBoard(boardId);
      localBoard = await lastValueFrom(board$);
    }
    return localBoard;
  }

  addEntryInBoard(data: any, rowId:string, reCache: boolean) {
    this.httpService.addNewRow(data).subscribe((res: any) => {
      reCache && this.cache.reCacheBoardData(data?.board_id);
      this.deleteEntryFromBoard(rowId, this.moveEntryData?.currentBoard?.id, reCache);
    });
  }

  deleteEntryFromBoard(rowId: any, boardId: any, reCache: boolean) {
    this.httpService.deleteRow(rowId).subscribe(() => {
      reCache && this.cache.reCacheBoardData(boardId);
    });
  }

  addNewColumnToBoard(colType: string, colName: string, index: number) {
    let data = {
      board_id: this.moveEntryData?.newBoard?.id,
      focus_id: 0,
      order: "right",
      settings: "",
      sub_column: 0,
      width: 210,
      name: colName,
      type: colType,
    };

    this.httpService.addNewColumn(data).subscribe((res: any) => {
      this.cache.reCacheBoardData(data?.board_id);
      this.setOfColumnsToBeMapped[index].selectedCol = res;
      this.setOfColumnsToBeMapped[index].b2Cols.push(res);
    });
  }
}
