import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  isSrarch = false;
  capmaingType = '';
  fetchPost = 'halfhour';
  schedulePeriod = 'customised';

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

  selectCampaginType(type:string = ''){
    this.capmaingType = type;
  }

}
