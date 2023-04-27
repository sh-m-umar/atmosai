import {Component, OnInit} from '@angular/core';
import {EventRenderedArgs, EventSettingsModel, GroupModel, View} from "@syncfusion/ej2-angular-schedule";
import {HttpService} from "../http.service";
import {CacheService} from "../cache.service";

@Component({
    selector: 'app-calendar-common',
    templateUrl: './calendar-common.component.html',
    styleUrls: ['./calendar-common.component.scss']
})
export class CalendarCommonComponent implements OnInit {
    public loaded = false;
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
    public types: any[] = [];
    public ownerStatus: any[] = [];
    public users: any[] = [];
    public currentView: View = 'Month';
    public boardData: any;

    constructor(private httpService: HttpService, private cache: CacheService) {
    }

    ngOnInit(): void {
        this.loadBoardActivities();
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

    /**
     * Load activities board from API/Cache
     */
    loadBoardActivities() {
        // get activities board
        this.cache.getAllBoards().then((boards: any) => {
            // Activities board ID is 5, use static if not loaded all boards.
            const activitiesBoard = boards === undefined ? {id: 5} : boards.find((board: any) => board.type === 'activity');
            if (activitiesBoard !== undefined) {
                const boardData = this.cache.getBoardCache(activitiesBoard.id);
                if (boardData) {
                    this.boardData = boardData;
                    this.buildScheduleData();
                } else {
                    this.httpService.getSingleBoard(activitiesBoard.id).subscribe((response: any) => {
                        this.cache.setBoardCache(activitiesBoard.id, response);
                        this.boardData = response;
                        this.buildScheduleData();
                    });
                }
            }
        });
    }

    /**
     * Build schedule data from the board data
     */
    buildScheduleData() {
        if (this.boardData === undefined) {
            return;
        }

        let scheduleData = this.boardData.groups.map((group: any) => {
            return group.entries.map((entry: any) => {
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

        // Populate types
        this.types = this.getSubBoardColumnStatus(this.boardData.columns, 'activity_type');
        // this.ownerStatus = this.getSubBoardColumnStatus(this.boardData.columns, 'owner_status');

        // now load the calendar
        this.loaded = true;
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
        if(column) {
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
        }

        return options;
    }

}
