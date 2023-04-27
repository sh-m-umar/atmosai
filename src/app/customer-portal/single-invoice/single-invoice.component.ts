import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-invoice',
  templateUrl: './single-invoice.component.html',
  styleUrls: ['./single-invoice.component.scss']
})
export class SingleInvoiceComponent implements OnInit {

  isShowPayment=false;

  showPayment() {
    this.isShowPayment=true
  }

  constructor() { }

  ngOnInit(): void {
  }

}
