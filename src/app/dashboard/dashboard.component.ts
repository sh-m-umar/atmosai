import {Component, ViewEncapsulation, Inject, ViewChild, OnInit, Input, SimpleChanges} from '@angular/core';
import {DashboardLayoutComponent, PanelModel} from '@syncfusion/ej2-angular-layouts';
import {BoardsComponent} from "../boards/boards.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    @ViewChild('predefine_dashboard')
    // @Input() public dashboardData:any;
    public dashboard: DashboardLayoutComponent | undefined;
    public loaded = false;
    public trayData: any = {title: 'Dashboard templates'};
    public panels: any = [
        {
            'panel1': {'sizeX': 8, 'sizeY': 6, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 4, 'sizeY': 6, 'row': 0, 'col': 8},
            'panel3': {'sizeX': 12, 'sizeY': 4, 'row': 3, 'col': 0}
        },
        {
            'panel1': {'sizeX': 12, 'sizeY': 1, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 4, 'sizeY': 3, 'row': 1, 'col': 0},
            'panel3': {'sizeX': 8, 'sizeY': 3, 'row': 1, 'col': 4},
            'panel4': {'sizeX': 12, 'sizeY': 1, 'row': 4, 'col': 0}
        },
        {
            'panel1': {'sizeX': 12, 'sizeY': 1, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 6, 'sizeY': 3, 'row': 1, 'col': 0},
            'panel3': {'sizeX': 6, 'sizeY': 3, 'row': 1, 'col': 6},
            'panel4': {'sizeX': 12, 'sizeY': 1, 'row': 4, 'col': 0}
        },
        {
            'panel1': {'sizeX': 6, 'sizeY': 1, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 2, 'sizeY': 3, 'row': 1, 'col': 0},
            'panel3': {'sizeX': 2, 'sizeY': 3, 'row': 1, 'col': 4},
            'panel4': {'sizeX': 2, 'sizeY': 3, 'row': 1, 'col': 8},
            'panel5': {'sizeX': 6, 'sizeY': 1, 'row': 4, 'col': 0}
        },
        {
            'panel1': {'sizeX': 12, 'sizeY': 1, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 8, 'sizeY': 3, 'row': 1, 'col': 0},
            'panel3': {'sizeX': 4, 'sizeY': 3, 'row': 1, 'col': 8},
            'panel4': {'sizeX': 12, 'sizeY': 1, 'row': 4, 'col': 0}
        },
        {
            'panel1': {'sizeX': 4, 'sizeY': 3, 'row': 0, 'col': 0},
            'panel2': {'sizeX': 4, 'sizeY': 3, 'row': 0, 'col': 4},
            'panel3': {'sizeX': 4, 'sizeY': 3, 'row': 0, 'col': 8},
            'panel4': {'sizeX': 12, 'sizeY': 2, 'row': 3, 'col': 0}
        }
    ];
    public panelsData:any = [
        {
            sizeX: 8,
            sizeY: 6,
            row: 0,
            col: 0,
            type: 'numbers',
        },
        {
            sizeX: 4,
            sizeY: 6,
            row: 0,
            col: 8,
            type: 'numbers',
        },
        {
            sizeX: 12,
            sizeY: 4,
            row: 3,
            col: 0,
            type: 'numbers',
        }
    ];

    public cellSpacing: number[] = [10, 10];
    public headerCount: number = 1;
    public count: number = 8;

    constructor(public boardsComponent: BoardsComponent) {
        // sourceFiles.files = ['default-style.css'];
    }

    ngOnInit(): void {
        this.setTrayDynamicWidth();
        this.loaded = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);

        // if (changes.dashboardData) {
        //   this.dashboardData = changes.dashboardData.currentValue;
        //   this.selectPanel(this.dashboardData.);
        // }
    }

    public selectPanel(index = 0): void {
        let selectedElement: HTMLCollection = document.getElementsByClassName('e-selected-style');
        if (this.dashboard) {
            this.dashboard.removeAll();
        }
        this.initializeTemplate(index);
    };

    public initializeTemplate(index = 0): void {
        let updatedPanels: PanelModel[] = [];
        let panel: any = Object.keys(this.panels[index]).map((panelIndex: string) => {
            return this.panels[index][panelIndex];
        });
        for (let i: number = 0; i < panel.length; i++) {
            let panelModelValue: PanelModel = {
                row: panel[i].row,
                col: panel[i].col,
                sizeX: panel[i].sizeX,
                sizeY: panel[i].sizeY,
                header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
                content: '<div class="panel-content"><app-panel-template></app-panel-template></div>'
            };
            updatedPanels.push(panelModelValue);
        }
        if (this.dashboard) {
            this.dashboard.panels = updatedPanels;
        }
    }

    setTrayDynamicWidth() {
        // Make maximum width dynamic
        const contentWrapperElem = document.getElementById('content-wrapper') as HTMLElement;
        this.trayData.trayMaxWidth = contentWrapperElem.offsetWidth;
        this.trayData.trayMinWidth = 300;
        this.trayData.trayWidth = contentWrapperElem.offsetWidth * 0.25;
    }

    addPanel(panelItem:any) {
        const {slug, title} = panelItem;

        let panel = {
            id: 'panel' + this.count,
            sizeX: 3,
            sizeY: 2,
            row: 0,
            col: 0,
            type: slug,
            header: '<div class="e-header-text">{{title}}</div><div class="header-border"></div>',
            content: '<div class="panel-content"><app-panel-template></app-panel-template></div>'
        }

        if (this.dashboard != undefined) {
            console.log('addPanel', this.dashboard);
            this.dashboard.addPanel(panel);
            this.count = this.count + 1;

            this.panelsData.push(panel);
            // this.loaded = true;
        }
    }

    onCloseIconHandler(event: any): void {
        if ((<HTMLElement>event.target) === null && (<HTMLElement>event.target).offsetParent === null) {
            return;
        }

        if ((<HTMLElement>event.target).offsetParent) {
            //this.dashboard?.removePanel((<HTMLElement>event.target).offsetParent.id);
        }
    }

    //Dashboard Layout's resizestart event function
    onResizeStart(args: any) {
        console.log("Resize start");
    }

    //Dashboard Layout's resize event function
    onResize(args: any) {
        console.log("Resizing");
    }

    //Dashboard Layout's resizestop event function
    onResizeStop(args: any) {
        console.log("Resize stop", args);
        console.log("Resize stop", this.dashboard?.panels);
        this.addContent();
    }

    addContent() {
        if (this.dashboard != undefined) {
            this.dashboard.panels[0].content = '<div class="panel-content">Updated content, for test</div>';
            // refresh the dashboard layout
            this.dashboard.updatePanel(this.dashboard.panels[0]);
        }
    }

    /**
     * Update panel settings
     */
    updateSettings(){

    }

    /**
     * Update panel title
     */
    updateTitle(){

    }
}
