import {Component, OnInit, AfterViewChecked, ViewChild, Renderer2, ElementRef, AfterViewInit} from '@angular/core';
import {EventRenderedArgs, EventSettingsModel, GroupModel, PopupCloseEventArgs, PopupOpenEventArgs, ScheduleComponent, View} from "@syncfusion/ej2-angular-schedule";
import {createElement, extend} from '@syncfusion/ej2-base';
import {DropDownList} from '@syncfusion/ej2-dropdowns';
import {BoardsComponent} from "../boards/boards.component";
import {HttpService} from '../http.service';
import {CacheService} from "../cache.service";
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import {TextInputFloatingFilter} from "ag-grid-community/dist/lib/filter/floating/provided/textInputFloatingFilter";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
    // @ViewChild('scheduleObj')
    // public scheduleObj: ScheduleComponent;
    
    public loaded = false;
    public contentAvailableAreaHeight = 100;
    public selectedDate: Date = new Date();
    public scheduleData: any[] = [];
    public eventSettings: EventSettingsModel = {
        dataSource: this.scheduleData,
        fields: {
            id: 'id',
            subject: {title: 'Task title', name: 'item', default: ''},
            location: {title: 'Event Location', name: 'location', default: ''},
            description: {title: 'Summary', name: 'description', default: ''},
            startTime: {title: 'From', name: 'start_time', default: ''},
            endTime: {title: 'To', name: 'end_time', default: ''},
            recurrenceRule: {title: 'Repeat', name: 'recurrence_rule', default: ''},
        }
    }
    public group: GroupModel = {
        byGroupID: false,
        resources: ['Type', 'Owner']
    };
    public types:any[] = [];
    public ownerStatus:any[] = [];
    public users:any[] = [];
    public currentView: View = 'Month';

    constructor(private rerender: Renderer2,private boardsComponent: BoardsComponent, private httpService: HttpService, private cache: CacheService) {
    }

    ngOnInit(): void {
        this.contentAvailableAreaHeight = window.innerHeight - 250;

        // Do not make less than 500px height
        this.contentAvailableAreaHeight = this.contentAvailableAreaHeight < 500 ? 500 : this.contentAvailableAreaHeight;
        this.populateData();
    }

    ngAfterViewInit() {
        setTimeout(()=>{ 
            this.addSettingTabInCalendarToolbar();

            //this.addNewEventTabInCalendarToolbar(); // TODO: This was having issue with the calendar Agenda, so commented out for now
        }, 1000);
    }

    // adding setting button in calendar header toolbar
    addSettingTabInCalendarToolbar(){
        const htmlData =`<div class="e-toolbar-item e-views e-settings" aria-disabled="false">
                            <button class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib" type="button" id="e-tbr-btn_9" tabindex="-1" aria-label="Settings" style="width: auto;">
                                <span class="e-btn-icon e-settings e-icons e-icon-left d-block"></span>
                                <span class="e-tbar-btn-text">Settings</span>
                            </button>
                        </div>`;
        const elem = document.getElementsByClassName('e-toolbar-right');
        elem[0].insertAdjacentHTML('beforeend', htmlData);   
    }

    // adding new event and new recurring buttons in calendar header toolbar
    addNewEventTabInCalendarToolbar(){
        const htmlData =`<div class="e-toolbar-item e-newevent e-tbtn-align e-overflow-show" aria-disabled="false" aria-label="New Event" title="New Event">
                            <button class="e-tbarbtn e-control e-btn e-lib e-icon-btn" type="button" id="e-tbr-btn_10" tabindex="-1" aria-label="New Event" title="New Event" style="width: auto;">
                                <span class="e-btn-icon e-plus e-icons e-icon-left d-block"></span>
                                <span class="e-tbar-btn-text">New Event</span>
                            </button>
                        </div>
                        <div class="e-toolbar-item e-views e-recurring-event" aria-disabled="false">
                            <button class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib" type="button" id="e-tbr-btn_11" tabindex="-1" aria-label="Recurring Event" style="width: auto;">
                                <span class="e-btn-icon e-repeat e-icons e-icon-left d-block"></span>
                                <span class="e-tbar-btn-text">New Recurring Event</span>
                            </button>
                        </div>`;
        const elem = document.getElementsByClassName('e-toolbar-left');
        elem[0].insertAdjacentHTML('beforeend', htmlData);   
    }

    public onEventRendered(args: EventRenderedArgs): void {
        // const categoryColor: string = args.data['CategoryColor'] as string;
        let categoryColor: string = '#000000';

        if (args.data['activity_type'] !== undefined && args.data['activity_type'] !== '') {
            // find the activity type by id
            const activityType = this.types.find(type => type.id === args.data['activity_type']);
            if (activityType !== undefined) {
                categoryColor = activityType.color as string;
            }
        }

        if (!args.element || !categoryColor) {
            return;
        }

        if (this.currentView === 'Agenda') {
            (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
        } else {
            args.element.style.backgroundColor = categoryColor;
        }
    }

    populateData() {
        // Populate types
        this.types = this.getSubBoardColumnStatus(this.boardsComponent.columns, 'activity_type');
        this.ownerStatus = this.getSubBoardColumnStatus(this.boardsComponent.columns, 'owner_status');
        this.buildScheduleData();
        this.loaded = true;
    }

    /**
     * Build schedule data from board data
     */
    buildScheduleData() {
        let scheduleData = this.boardsComponent.boardData.groups.map((group:any) => {
            return group.entries.map((entry:any) => {
                return {
                    id: entry.id,
                    item: entry.item,
                    start_time: new Date(entry.start_time),
                    end_time: new Date(entry.end_time),
                    activity_type: entry?.activity_type || '',
                    description: entry?.description || '',
                    owner: entry?.owner || '',
                    organization: entry?.organization || '',
                    people: entry?.people || '',
                    deal_lead_project: entry?.deal_lead_project || '',
                    owner_status: entry?.owner_status || '',
                    location: entry?.location || ''
                }
            })
        });

        let data = [];

        for (let i = 0; i < scheduleData.length; i++) {
            data.push(...scheduleData[i]);
        }

        this.eventSettings.dataSource = data;
        this.loaded = true;
    }

    /**
     * Add extra fields to editor
     * @param args
     */
    onPopupOpen(args: PopupOpenEventArgs): void {
        console.log(this.eventSettings);

        if (args.type === 'Editor') {
            // Create required custom elements in initial time

            // Activity type field
            if (!args.element.querySelector('.custom-field-row')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'custom-field-container'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'activity_type'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);
                let drowDownList: DropDownList = new DropDownList({
                    dataSource: this.types || [],
                    fields: {text: 'name', value: 'id'},
                    value: (args.data as { [key: string]: Object; })['activity_type'] as string,
                    floatLabelType: 'Always', placeholder: 'Type'
                });
                drowDownList.appendTo(inputEle);
                inputEle.setAttribute('name', 'activity_type');
            }

            // Owner field
            if (!args.element.querySelector('.custom-field-row1')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row1'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'custom-field-container1'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'owner'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);
                let drowDownList: DropDownList = new DropDownList({
                    dataSource: this.boardsComponent.users,
                    fields: {text: 'display_name', value: 'ID'},
                    value: (args.data as { [key: string]: Object; })['owner'] as string,
                    floatLabelType: 'Always', placeholder: 'Owner'
                });
                drowDownList.appendTo(inputEle);
                inputEle.setAttribute('name', 'owner');
            }

            // Owner status field
            if (!args.element.querySelector('.custom-field-row2')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row2'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'custom-field-container2'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'owner_status'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);
                let drowDownList: DropDownList = new DropDownList({
                    dataSource: this.ownerStatus || [],
                    fields: {text: 'name', value: 'id'},
                    value: (args.data as { [key: string]: Object; })['owner_status'] as string,
                    floatLabelType: 'Always', placeholder: 'Owner status'
                });
                drowDownList.appendTo(inputEle);
                inputEle.setAttribute('name', 'owner_status');
            }

            // Add deal/lead/project field
            if (!args.element.querySelector('.custom-field-row3')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row3'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'e-float-input e-control-wrapper custom-field-container3'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'deal_lead_project', class: 'e-deal_lead_project e-field', type: 'text'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                const label: HTMLElement = createElement('label', {className: 'e-float-text e-label-top', attrs: {}});
                label.innerHTML = 'Deal/Lead/Project';
                container.appendChild(label);
                row.appendChild(container);
            }

            // Add people
            if (!args.element.querySelector('.custom-field-row4')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row4'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'e-float-input e-control-wrapper custom-field-container4'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'people', class: 'e-people e-field', type: 'text'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                const label: HTMLElement = createElement('label', {className: 'e-float-text e-label-top', attrs: {}});
                label.innerHTML = 'People';
                container.appendChild(label);
                row.appendChild(container);
            }

            // Add organization
            if (!args.element.querySelector('.custom-field-row5')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row5'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'e-float-input e-control-wrapper custom-field-container5'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'organization', class: 'e-organization e-field', type: 'text'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                const label: HTMLElement = createElement('label', {className: 'e-float-text e-label-top', attrs: {}});
                label.innerHTML = 'Organization';
                container.appendChild(label);
                row.appendChild(container);
            }

        }
    }

    /**
     * Store event data into database
     *
     * @param args
     */
    onPopupClose(args: PopupCloseEventArgs) {
        if (['QuickInfo', 'Editor'].includes(args?.type) && args?.cancel === false) {
            // Save quick info data only if clicked on save button
            if (args?.type === 'QuickInfo') {
                const button:any = args?.event?.target;
                if (button?.classList.contains('e-event-create')) {
                    this.updateEntryHeader(args.data);
                }
            } else {
                this.updateEntryHeader(args.data);
            }
        }
    }

    /**
     * Update event in database
     */
    updateEntryHeader(data: any) {
        if (data === undefined) {
            return;
        }

        const formData = {
            id: data?.id,
            action: 'add-full-entry',
            board_id: this.boardsComponent.boardId,
            item: data.item,
            description: data?.description,
            end_time: data.end_time,
            start_time: data.start_time,
            activity_type: data?.activity_type,
            owner: data?.owner,
            organization: data?.organization,
            people: data?.people,
            deal_lead_project: data?.deal_lead_project,
            owner_status: data?.owner_status,
            location: data?.location,
        };

        // console.log(formData);
        // console.log(this.eventSettings);

        this.cache.reCacheBoardData(this.boardsComponent.boardId, false);
        this.httpService.bulkActionsRows(formData).subscribe((res: any) => {
            this.cache.reCacheBoardData(this.boardsComponent.boardId);
        });
    }

    /**
     * Get sub board column status options
     *
     * @param columns
     * @param key
     * @param from
     */
    getSubBoardColumnStatus(columns: any, key = 'activity_type', from = 'statuses') {
        let options = [];

        // find column with key
        let column = columns.find((column: any) => column?.key === key || column?.field === key);

        switch (from) {
            case 'statuses':
                options = column[from] !== undefined ? column[from] : column.cellRendererParams[from];
                break;
            case 'settings':
                try {
                    options = column[from] !== undefined ? JSON.parse(column[from]) : JSON.parse(column.cellRendererParams[from]);
                } catch (e) {
                }
        }

        return options;
    }

}
