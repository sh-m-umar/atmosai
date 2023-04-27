import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-recyclebin',
  templateUrl: './recyclebin.component.html',
  styleUrls: ['./recyclebin.component.scss']
})
export class RecyclebinComponent implements OnInit {
  items:any = [];
  loaded = false;

  constructor( private httpService: HttpService) { }

  ngOnInit(): void {
    this.getRecycleBin();
  }

  getRecycleBin() {
    this.httpService.getRecycleBin().subscribe(data => {
      this.items = data;
      this.loaded = true;
    });
  }

  restore(item: any) {
    const data = {
      action: 'restore',
      type: 'trash',
      entity_type: item.type,
      id: item.id,
    };

    this.items = this.items.filter((ele: any) => ele.id != item.id);

    this.httpService.recycleBinAndArchivedAction(data).subscribe((res: any) => {
      this.items = res;
    });
  }

  deletePermanently(item: any) {
    const data = {
      action: 'delete',
      type: 'trash',
      entity_type: item.type,
      id: item.id,
    };

    this.items = this.items.filter((ele: any) => ele.id != item.id);

    this.httpService.recycleBinAndArchivedAction(data).subscribe((res: any) => {
      this.items = res;
    });
  }
}
