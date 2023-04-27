import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  headerCollapsed = false;
  anglePos = 'down';
  isSrarch = false;
  isPopupShow = false;
  itemsArr = [
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
    {src: './assets/img/img-placeholder.png'},
  ];
  constructor() {
   }

  headerToggle(){
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  } 
  
  // header search close
  filterSearchClose() {
    this.isSrarch = false;
  }

   // header search button
   filterSearch() {
    this.isSrarch = true;
  }

  showPopupImage(){
    this.isPopupShow = !this.isPopupShow;
  }

  
  ngOnInit(): void {
  }

}
