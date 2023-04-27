import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-panel-template',
  templateUrl: './panel-template.component.html',
  styleUrls: ['./panel-template.component.scss']
})
export class PanelTemplateComponent implements OnInit {
  @Input() data: any = {title: 'Panel Title', content: 'Panel Content'};

  constructor() { }

  ngOnInit(): void {
    console.log('data', this.data);
  }

}
