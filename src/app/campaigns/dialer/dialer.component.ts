import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss']
})
export class DialerComponent implements OnInit {

  tabType = 'dialer';
  keyboard = false;
  vitalShowMore = false;
  addGuest = false;
  addLocation = false;
  addDescription = false;
  isAddFields = false;
  public guestsArray: any = [];
  guestsEmails: any = [];
  opportunitiesEdit = true;
  activityEdit = true;
  constructor() { }

  changeDialerTab(type:string){
    this.tabType = type;
  }
  ngOnInit(): void {
  }

}
