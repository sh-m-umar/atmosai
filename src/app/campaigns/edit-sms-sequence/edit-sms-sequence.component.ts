import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-sms-sequence',
  templateUrl: './edit-sms-sequence.component.html',
  styleUrls: ['./edit-sms-sequence.component.scss']
})
export class EditSmsSequenceComponent {

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
