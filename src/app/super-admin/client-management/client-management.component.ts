import { Component } from '@angular/core';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent {
  headerCollapsed = false;
  anglePos = 'down';
  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
