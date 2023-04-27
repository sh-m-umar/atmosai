import { Component } from '@angular/core';

@Component({
  selector: 'app-create-landing-page',
  templateUrl: './create-landing-page.component.html',
  styleUrls: ['./create-landing-page.component.scss']
})
export class CreateLandingPageComponent {

  headerCollapsed = false;
  anglePos = 'down';

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

}
