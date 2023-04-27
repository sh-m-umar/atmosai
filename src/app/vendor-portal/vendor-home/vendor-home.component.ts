import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.scss']
})
export class VendorHomeComponent implements OnInit {
public isEdit = false; 
  constructor() { }

  ngOnInit(): void {
  }

}
