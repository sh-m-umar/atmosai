import { Component } from '@angular/core';

@Component({
  selector: 'app-cross-account-copier',
  templateUrl: './cross-account-copier.component.html',
  styleUrls: ['./cross-account-copier.component.scss']
})
export class CrossAccountCopierComponent {

  headerCollapsed = false;
  anglePos = 'down';
  constructor() { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
}
