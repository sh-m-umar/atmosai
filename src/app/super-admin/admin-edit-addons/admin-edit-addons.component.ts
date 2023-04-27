import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-edit-addons',
  templateUrl: './admin-edit-addons.component.html',
  styleUrls: ['./admin-edit-addons.component.scss']
})
export class AdminEditAddonsComponent {
  headerCollapsed = false;
  anglePos = 'down';
  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
