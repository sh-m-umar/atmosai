import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-marketing-dashboard',
  templateUrl: './email-marketing-dashboard.component.html',
  styleUrls: ['./email-marketing-dashboard.component.scss']
})
export class EmailMarketingDashboardComponent implements OnInit {

  isSrarch = false;

  // header search button
  filterSearch() {
    this.isSrarch = true;
}

// header search close
filterSearchClose() {
    this.isSrarch = false;
}


  constructor() { }

  ngOnInit(): void {
    const elem = document.getElementById('content-wrapper-body');
    elem?.classList.remove('board-page');
  }

}
