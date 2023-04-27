import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-addons',
  templateUrl: './admin-addons.component.html',
  styleUrls: ['./admin-addons.component.scss']
})
export class AdminAddonsComponent {
  headerCollapsed = false;
  anglePos = 'down';
  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
