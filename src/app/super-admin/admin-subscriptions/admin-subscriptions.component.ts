import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-subscriptions',
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss']
})
export class AdminSubscriptionsComponent {

  headerCollapsed = false;
  anglePos = 'down';
  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
