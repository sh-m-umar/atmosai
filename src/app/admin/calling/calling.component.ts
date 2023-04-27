import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calling',
  templateUrl: './calling.component.html',
  styleUrls: ['./calling.component.scss']
})
export class CallingComponent implements OnInit {

  headerCollapsed = false;
  activeTab:number = 1;
  anglePos = 'down';


  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  urlChange(url:string){
    if(url==='manage') this.activeTab = 1;
    if(url==='outgoing') this.activeTab = 2;
    if(url==='tax') this.activeTab = 3;
    if(url==='sharing') this.activeTab = 4;
  }



  constructor() { }

  ngOnInit(): void {
  }

}
