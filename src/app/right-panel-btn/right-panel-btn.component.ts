import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-right-panel-btn',
  templateUrl: './right-panel-btn.component.html',
  styleUrls: ['./right-panel-btn.component.scss']
})
export class RightPanelBtnComponent implements OnInit, ICellRendererAngularComp {
  public cellVale = '';

  constructor() { }

  agInit(params: ICellRendererParams<any, any>): void {
    this.cellVale = params.value;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  ngOnInit(): void {
  }

}
