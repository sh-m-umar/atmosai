import { Component } from '@angular/core';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})
export class SegmentsComponent {

  headerCollapsed = false;
  anglePos = 'down';
  isSrarch: boolean = false;
  rulesList = true;
  isOr = false;

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

   // header search button
   filterSearch() {
    this.isSrarch = true;
}

  // header search close
  filterSearchClose() {
      this.isSrarch = false;
  }

}
