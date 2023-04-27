import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-edit-subscriptions',
  templateUrl: './admin-edit-subscriptions.component.html',
  styleUrls: ['./admin-edit-subscriptions.component.scss']
})
export class AdminEditSubscriptionsComponent {

  headerCollapsed = false;
  anglePos = 'down';
  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
