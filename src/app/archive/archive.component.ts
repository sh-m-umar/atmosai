import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  items:any = [];
  loaded = false;

  constructor( private httpService: HttpService) { }

  ngOnInit(): void {
    this.getRecycleBin();
  }

  getRecycleBin() {
    this.httpService.getRecycleBin('archived').subscribe(data => {
      this.items = data;
      this.loaded = true;
    });
  }

  restore(item: any) {
    const data = {
      action: 'restore',
      type: 'archived',
      entity_type: item.type,
      id: item.id,
    };

    this.items = this.items.filter((ele: any) => ele.id != item.id);

    this.httpService.recycleBinAndArchivedAction(data).subscribe((res: any) => {
      this.items = res;
    });
  }
}
