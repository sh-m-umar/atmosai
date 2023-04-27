import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  headerCollapsed = false;
  gateWayChange = false;
  smsContentConfigure = false;
  anglePos = 'down';
  isRecipientEdit = false;
  recipientType = '';
  advandedOptions = false;
  configureResponse = false;
  responseRowAdded = false;
  constructor() {
   }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }


  ngOnInit(): void {
  }

}
