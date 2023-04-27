import { Injectable } from '@angular/core';
import {CacheService} from "./cache.service";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public cache: CacheService, public httpService: HttpService) {
  }

  /**
   * Return board rows by board ID and return single row by row ID
   *
   * @param boardId
   * @param rowId
   */
  async getBoardRowsByBoardId(boardId: number, rowId: number = 0) {
    const board = await this.cache.getBoardCache(boardId);
    if (board) {
      return this.returnBoardRowsByBoardData(board, rowId);
    }

    this.httpService.getSingleBoard(boardId).subscribe((data:any) => {
      this.cache.setBoardCache(boardId, data);
      return this.returnBoardRowsByBoardData(data, rowId);
    });
  }

  /**
   * Return board rows by board data or row by ID
   *
   * @param data
   * @param rowId
   */
  returnBoardRowsByBoardData(data: any, rowId: number = 0) {
    let rows: any = [];
    let row = null;
    data?.groups?.forEach((group: any) => {
      if (rowId > 0) {
        // fine the row by Id
        const rowEntry = group.entries.find((row: any) => row.id == rowId);
        if (rowEntry !== undefined) {
          row = rowEntry;
        }
      } else {
        rows = [...rows, ...group.entries];
      }
    });

    return rowId > 0 ? row : rows;
  }
}
