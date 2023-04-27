import {Component, Input, OnInit} from '@angular/core';
import {DashboardComponent} from "../../dashboard/dashboard.component";

@Component({
    selector: 'app-dashboard-tray',
    templateUrl: './dashboard-tray.component.html',
    styleUrls: ['./dashboard-tray.component.scss']
})
export class DashboardTrayComponent implements OnInit {
    @Input() data: any;
    public panelTypes = [
        {title: 'Numbers', slug: 'numbers'},
        {title: 'Funnel', slug: 'funnel'},
        {title: 'Spline area', slug: 'spline'},
        {title: 'Column', slug: 'column'},
        {title: 'Blank content', slug: 'blank'},
    ];

    constructor(public dashboard: DashboardComponent) {
    }

    ngOnInit(): void {
    }

    selectPanel(panelIndex = 0) {
           this.dashboard.selectPanel(panelIndex);
    }

    hideDetailPopup() {
        this.dashboard.boardsComponent.showDashTray = false;
    }

    addPanel(item:any) {
        this.dashboard.addPanel(item);
    }

}
