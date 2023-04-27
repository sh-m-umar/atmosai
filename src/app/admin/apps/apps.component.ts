import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {
 
  headerCollapsed = false;
  anglePos = 'down';
  constructor() { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }
  
  ngOnInit(): void {
  }

}
