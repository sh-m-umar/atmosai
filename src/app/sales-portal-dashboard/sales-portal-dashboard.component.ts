import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-sales-portal-dashboard',
  templateUrl: './sales-portal-dashboard.component.html',
  styleUrls: ['./sales-portal-dashboard.component.scss']
})
export class SalesPortalDashboardComponent implements OnInit {


  chartOption4: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [
          {value: 200,itemStyle: {color: '#a90000'}},
          {value: 100,itemStyle: {color: '#00ffa7'}},
          {value: 240,itemStyle: {color: '#0066ff'}},
          {value: 300,itemStyle: {color: '#8e00ff'}},
          {value: 150,itemStyle: {color: '#aa4545'}},
          {value: 211,itemStyle: {color: '#45aa73'}},
          {value: 180,itemStyle: {color: '#e0d1596b'}},
          {value: 180,itemStyle: {color: '#198754'}},
          {value: 100,itemStyle: {color: '#20c997'}},
          {value: 240,itemStyle: {color: '#ffc107'}},
          {value: 300,itemStyle: {color: '#ffc107'}},
          {value: 150,itemStyle: {color: '#dc3545'}},
          {value: 211,itemStyle: {color: '#d63384'}},
          {value: 180,itemStyle: {color: '#6f42c1'}},
          {value: 180,itemStyle: {color: '#0d6efd'}}
        ],
        type: 'bar',
        barWidth: 20,
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
