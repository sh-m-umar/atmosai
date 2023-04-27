import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-portal',
  templateUrl: './sales-portal.component.html',
  styleUrls: ['./sales-portal.component.scss']
})
export class SalesPortalComponent implements OnInit {

  isNewOrder = false;
  salesSetting = false;
  TeamManagementSetting = false;

  newOrder(event: any) {
    (event == 'show' ? this.isNewOrder = true : this.isNewOrder = false);
  }

  showSettingsInTray(type:string){
    (type == 'sales' ? this.salesSetting = true : this.salesSetting = false);
    (type == 'teams' ? this.TeamManagementSetting = true : this.TeamManagementSetting = false);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
