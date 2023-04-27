import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-promotoinal-email',
  templateUrl: './edit-promotoinal-email.component.html',
  styleUrls: ['./edit-promotoinal-email.component.scss']
})
export class EditPromotoinalEmailComponent {
  headerCollapsed = false;
  anglePos = 'down';

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

}
