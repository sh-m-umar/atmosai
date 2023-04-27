import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {createElement, extend} from '@syncfusion/ej2-base';

import {DayService, DragAndDropService, EventSettingsModel, GroupModel, PopupCloseEventArgs, PopupOpenEventArgs, ResizeService, ResourceDetails, ScheduleComponent, TimelineMonthService, TimelineViewsService, View} from '@syncfusion/ej2-angular-schedule';
import {BoardsComponent} from "../../boards/boards.component";
import {HttpService} from "../../http.service";
import {CacheService} from "../../cache.service";
import {LocalService} from "../../local.service";
import {DropDownList} from "@syncfusion/ej2-dropdowns";

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DayService, TimelineViewsService, TimelineMonthService, ResizeService, DragAndDropService]
})
export class SchedulerComponent implements OnInit {
    public contentAvailableAreaHeight = 100;
    @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent | undefined;
    public loaded = false;
    public reloaded = true;
    public blockData: Record<string, any>[] = [];
    public data: any = extend([], this.blockData, '', true) as Record<string, any>[];
    public selectedDate: Date = new Date();
    public currentView: View = 'TimelineMonth';
    public employeeDataSource: any = [];
    public group: GroupModel = {enableCompactView: false, resources: ['Employee']};
    public allowMultiple = false;
    public selectedStaff: any = {};
    public selectedServices: any = {};
    public eventSettings: EventSettingsModel = {
        dataSource: [],
        fields: {
            id: 'id',
            subject: {title: 'Subject', name: 'subject', validation: {required: true}},
            location: {title: 'Location', name: 'location', validation: {required: false}},
            description: {title: 'Description', name: 'description', validation: {required: false}},
            startTime: {title: 'Start Time', name: 'startTime', validation: {required: true}},
            endTime: {title: 'End Time', name: 'endTime', validation: {required: true}}
        }
    };
    weatherLocation = 'Atlanta';
    weatherData: any = {};
    services: any = [];
    areServices = false;
    servicesArray: any = [];
    usersArray: any = [];

    constructor(public boardsComponent: BoardsComponent, private httpService: HttpService, private cache: CacheService, private localStore: LocalService,) {

    }

    ngOnInit(): void {
        this.contentAvailableAreaHeight = window.innerHeight - 250;

        // Do not make less than 500px height
        this.contentAvailableAreaHeight = this.contentAvailableAreaHeight < 500 ? 500 : this.contentAvailableAreaHeight;
        this.buildSelectedUsers();
        this.buildSelectedServices();
        this.buildNestedUsers();
        this.getServices();

        setTimeout(() => {
            this.populateData();
        }, 1000);
    }

    populateData() {
        this.buildUsersData();
        this.buildScheduleData();
    }

    buildSelectedUsers() {
        this.selectedStaff['all'] = true;
        const localSelectedStaff = this.localStore.get('selectedStaff');
        if (localSelectedStaff) {
            this.selectedStaff = localSelectedStaff;
            return;
        }

        this.boardsComponent.users.forEach((user: any) => {
            this.selectedStaff['userId_' + user.ID] = true;
        });
    }

    buildSelectedServices() {
        this.selectedServices['all'] = true;

        const localSelectedServices = this.localStore.get('selectedServices');
        if (localSelectedServices) {
            this.selectedServices = localSelectedServices;
            return;
        }

        this.services.forEach((service: any) => {
            this.selectedServices['service_' + service.id] = true;
        });
    }

    /**
     * Build schedule data from board data
     */
    buildScheduleData() {
        let scheduleData = this.boardsComponent.boardData.groups.map((group: any) => {
            return group.entries.map((entry: any) => {
                return {
                    id: entry.id,
                    subject: entry.item,
                    location: '',
                    startTime: new Date(entry.start_date),
                    endTime: new Date(entry.end_date),
                    employeeId: entry?.owner || '',
                    services: entry?.services || '',
                    StartTimezone: null,
                    RecurrenceRule: null,
                    EndTimezone: null,
                    RecurrenceException: null,
                    RecurrenceID: null,
                    IsAllDay: false,
                }
            })
        });

        // Build array of selected services
        let selectedServices: any = [];
        if (this.areServices) {
            for (const [key, value] of Object.entries(this.selectedServices)) {
                if (value === true) {
                    // split by underscore
                    const serviceId = key.split('_')[1];
                    selectedServices.push(serviceId);
                }
            }
        }

        let data = [];
        for (let i = 0; i < scheduleData.length; i++) {
            data.push(...scheduleData[i]);
        }

        // Filter data by selected services
        this.eventSettings.dataSource = data.filter((entry: any) => {
            // If no services selected, show all
            if (entry?.services === '' || entry?.services === null || entry?.services === undefined) {
                return true;
            }

            return this.areServices ? selectedServices.includes(entry?.services) : true;
        });

        this.reloaded = false;

        setTimeout(() => {
            this.loaded = true;
            this.reloaded = true;
        }, 1);
    }

    buildUsersData() {
        this.employeeDataSource = [];
        this.usersArray.forEach((cat: any) => {
            cat.users.forEach((user: any) => {
                if (user.selected === true) {
                    // Check current user ID already pushed
                    const userExistsIndex = this.employeeDataSource.findIndex((employee: any) => {
                        return employee.id == user.ID;
                    });

                    if (userExistsIndex < 0) {
                        this.employeeDataSource.push({
                            text: (user.fname === '' && user.lname === '') ? user.display_name : user.fname + ' ' + user.lname,
                            id: user.ID,
                            groupId: cat.id,
                            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                            designation: user.role,
                            photo: user.photo
                        });
                    }
                }
            });
        });
    }

    buildNestedUsers() {
        // Build users categories array
        let userCats: any = [];
        this.boardsComponent.users.forEach((user: any) => {
            if (user.categories.length === 0 && !userCats.includes('Uncategorized')) {
                userCats.push('Uncategorized');
            } else {
                user.categories.forEach((cat: any) => {
                    if (!userCats.includes(cat)) {
                        userCats.push(cat);
                    }
                });
            }
        });

        this.usersArray = [];

        // Build users array based on categories
        userCats.forEach((cat: any) => {
            // Doing like this to avoid reference
            let users: any = [];
            this.boardsComponent.users.forEach((user: any) => {
                // If user has no categories
                if (cat === 'Uncategorized' && user.categories.length === 0) {
                    users.push({...user});
                } else if (user.categories.includes(cat)) {
                    users.push({...user});
                }
            });

            this.usersArray.push({
                cat: cat,
                selected: true,
                users: [...users]
            });

            this.usersArray[this.usersArray.length - 1].users.forEach((user: any) => {
                user.selected = true;
            });
        });
    }

    public getEmployeeName(value: ResourceDetails): string {
        if (this.scheduleObj !== undefined && value !== undefined && (value as ResourceDetails).resource !== undefined && (value as ResourceDetails).resource.textField !== undefined) {
            // @ts-ignore
            return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
        }
        return '';
    }

    public getEmployeePhoto(value: any): string {
        return value?.resourceData?.photo;
    }

    public getEmployeeDesignation(value: ResourceDetails): string {
        // @ts-ignore
        const resourceName: string = (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
        return (value as ResourceDetails).resourceData['designation'] as string;
    }

    public getEmployeeImageName(value: ResourceDetails): string {
        return this.getEmployeeName(value).toLowerCase();
    }

    logData() {
        console.log('data', this.eventSettings);
    }

    /**
     * Store event data into database
     *
     * @param args
     */
    onPopupClose(args: PopupCloseEventArgs) {
        const data = args.data;

        if (['QuickInfo', 'Editor'].includes(args?.type) && args?.cancel === false) {
            // Save quick info data only if clicked on save button
            if (args?.type === 'QuickInfo') {
                const button: any = args?.event?.target;
                if (button?.classList.contains('e-event-create')) {
                    this.updateEntryHeader(data);
                }
            } else {
                this.updateEntryHeader(data);
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
            item: data?.subject,
            services: data?.services,
            description: data?.description,
            end_date: data?.endTime,
            start_date: data?.startTime,
            start_timezone: data?.StartTimezone,
            end_timezone: data?.EndTimezone,
            // repeat: data?.RecurrenceRule,
            owner: data?.employeeId,
            location: data?.location,
            repeat: data?.RecurrenceID,
        };

        this.cache.reCacheBoardData(this.boardsComponent.boardId, false);
        this.httpService.bulkActionsRows(formData).subscribe((res: any) => {
            this.cache.reCacheBoardData(this.boardsComponent.boardId);
        });
    }

    public getDateHeaderText(value: Date): string {
        // console.log('value date', value);
        return '';
        // return this.intl.formatDate(value, { skeleton: 'Ed' });
    }

    // public getWeatherImage(value: Date): string {
    //
    //     return this.loadWeather(value);
    //
    //     // switch (value.getDay()) {
    //     //     case 0:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-clear.svg"/><div class="weather-text">25°C</div>';
    //     //     case 1:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-clouds.svg"/><div class="weather-text">18°C</div>';
    //     //     case 2:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-rain.svg"/><div class="weather-text">10°C</div>';
    //     //     case 3:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-clouds.svg"/><div class="weather-text">16°C</div>';
    //     //     case 4:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-rain.svg"/><div class="weather-text">8°C</div>';
    //     //     case 5:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-clear.svg"/><div class="weather-text">27°C</div>';
    //     //     case 6:
    //     //         return '<img class="weather-image" src="./assets/schedule/images/weather-clouds.svg"/><div class="weather-text">17°C</div>';
    //     //     default:
    //     //         return '';
    //     // }
    //
    //     return '';
    // }

    changeSelection() {
        this.populateData();

        // update selected users to local storage
        this.localStore.set('selectedStaff', this.selectedStaff);
        this.localStore.set('selectedServices', this.selectedServices);
    }

    changeSelectAll(type = 'users', categoryIndex = -1) {
        switch (type) {
            case 'users':
                if (categoryIndex >= 0) {
                    // this.selectedStaff['userId_' + user.ID] = this.usersArray[categoryIndex].selected;
                    this.usersArray[categoryIndex].users.forEach((user: any) => {
                        // this.selectedStaff['userId_' + user.ID] = this.usersArray[categoryIndex].selected;
                        user.selected = this.usersArray[categoryIndex].selected;
                    });
                } else {
                    this.usersArray.forEach((cat: any) => {
                        cat.selected = this.selectedStaff.all;
                        cat.users.forEach((user: any) => {
                            user.selected = this.selectedStaff.all;
                        });
                    });
                }
                break;
            case 'services':
                this.services.forEach((service: any) => {
                    if (categoryIndex >= 0) {
                        if (this.servicesArray[categoryIndex].entries.find((entry: any) => entry.id == service.id) !== undefined) {
                            this.selectedServices['service_' + service.id] = this.servicesArray[categoryIndex].selected;
                        }
                    } else {
                        this.selectedServices['service_' + service.id] = this.selectedServices.all;
                        this.servicesArray.forEach((category: any) => {
                            category.selected = this.selectedServices.all;
                        });
                    }
                });
                break;
        }

        setTimeout(() => {
            this.changeSelection();
        }, 100);
    }

    // loadWeather(date: Date) {
    //     // Get date from date in yyyy-MM-dd format
    //     // Add 0 to month and date if less than 10
    //     const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //     const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    //     const dateString = date.getFullYear() + '-' + month + '-' + day;
    //
    //     // Check if weather data is already loaded
    //     if (this.weatherData[dateString] === undefined && this.weatherData[dateString] !== 'loading...') {
    //         this.weatherData[dateString] = 'loading...';
    //
    //         // check if date is future date
    //         let today = new Date();
    //         const todayDate = today.setDate(today.getDate());
    //         // const dateDate = date.setDate(date.getDate() - 14);
    //
    //         const future = today < date;
    //
    //         console.log('dateString', dateString);
    //
    //         // weather API call
    //         this.httpService.getWeatherForecast(dateString, this.weatherLocation, future).subscribe((res: any) => {
    //             this.weatherData[dateString] = res;
    //             console.log('weather data', this.weatherData[dateString])
    //         });
    //     }
    //
    //     return this.weatherData[dateString];
    // }

    getServices() {
        this.cache.getAllBoards().then((res: any) => {
            // get services board
            const servicesBoardId = res.find((board: any) => board.type === 'service')?.id;

            if (servicesBoardId === undefined) {
                return;
            }

            const servicesBoard = this.cache.getBoardCache(servicesBoardId);
            if (servicesBoard) {
                this.buildServicesList(servicesBoard);
                // this.services = servicesBoard.rows;
            } else {
                this.httpService.getSingleBoard(servicesBoardId).subscribe((res: any) => {
                    this.cache.setBoardCache(servicesBoardId, res);
                    this.getServices();
                });
            }
        });
    }

    buildServicesList(boardData: any) {
        this.services = [];

        // Convert board group entries to array
        boardData.groups.forEach((group: any) => {
            group.entries.forEach((entry: any) => {
                this.services.push(entry);
            });
        });

        // Convert this.services to object with categories as keys
        const servicesArray = this.services.reduce(function (r: any, a: any) {
            r[a.categories] = r[a.categories] || [];
            r[a.categories].push(a);
            return r;
        }, Object.create(null));

        // Convert this.servicesArray to array
        Object.keys(servicesArray).forEach((key: any) => {
            this.servicesArray.push({cat: key, selected: true, entries: servicesArray[key]});
        });

        this.areServices = true;

        this.buildSelectedServices();
    }

    /**
     * Add extra fields to editor
     * @param args
     */
    onPopupOpen(args: PopupOpenEventArgs): void {
        if (args.type === 'Editor') {
            // Create required custom elements in initial time

            // Activity type field
            if (this.areServices && !args.element.querySelector('.custom-field-row')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'custom-field-container'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'services'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);
                let drowDownList: DropDownList = new DropDownList({
                    dataSource: this.services || [],
                    fields: {text: 'item', value: 'id'},
                    value: (args.data as { [key: string]: Object; })['services'] as string,
                    floatLabelType: 'Always', placeholder: 'Services'
                });
                drowDownList.appendTo(inputEle);
                inputEle.setAttribute('name', 'services');
            }

            // Add Id hidden field
            if (!args.element.querySelector('.custom-field-row1')) {
                let row: HTMLElement = createElement('div', {className: 'custom-field-row1 d-none'});
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement?.firstChild?.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', {className: 'e-float-input e-control-wrapper custom-field-container1'});
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: {name: 'id', class: 'e-organization e-field', type: 'number'}
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                const label: HTMLElement = createElement('label', {className: 'e-float-text e-label-top', attrs: {}});
                label.innerHTML = 'id';
                container.appendChild(label);
                row.appendChild(container);
            }
        }
    }

}
