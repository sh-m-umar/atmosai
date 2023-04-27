import { Router, ActivatedRoute } from '@angular/router';
import { LocalService } from './../local.service';
import { CacheService } from './../cache.service';
import { HttpService } from './../http.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-left-notification-tray',
  templateUrl: './left-notification-tray.component.html',
  styleUrls: ['./left-notification-tray.component.scss']
})
export class LeftNotificationTrayComponent implements OnInit {
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() unreadNotificationCount: EventEmitter<any> = new EventEmitter();

  public currentUser: any = this.localStore.get('userData');

  public allNotifications: any = [];
  public filteredNotifications: any = [];
  public selectedTab: string = 'all';

  public showNotificationModal: boolean = false;
  public boardIdForModal: string = '';
  public notificationSettings: any = {
    entity_id: "",
    entity_type: "",
    id: "",
    type: "",
    user: {fname: "", lname: "", photo: ''},
    user_id: '',
  }

  public isLoading: boolean = true;
  public isNotificationSettingsLoading: boolean = false;

  constructor(
    private httpService: HttpService,
    private cache: CacheService,
    private localStore: LocalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.getNotifications();
    setInterval(() => {
      this.getNotifications();
    }, 60000);
  }

  getNotifications() {
    const data = {
      user_id: '',
      status: 0,
      type: '',
      limit: 10,
      offset: 0,
    };

    let queryParams = '';

    Object.entries(data).forEach(([key, value]: any) => {
      if(!!value || value === 0) {
        let param = `${key}=${value}`;
        queryParams = queryParams + (queryParams? `&${param}`: param);
      }
    });

    this.httpService.getNotifications( queryParams ).subscribe((notifications: any) => {
      const tempNotifications: any = [];
      const tempFilteredNotifications: any = [];
      notifications?.forEach((notification: any) => {
        notification.created_on = moment(notification.created_on).format('MMM Do');
        tempNotifications.push(notification);
        tempFilteredNotifications.push(notification);
      });
      this.allNotifications = tempNotifications;
      this.filteredNotifications = tempFilteredNotifications;
      this.setUnreadNotificationCount();

      this.isLoading = false;
    });
  }

  showNotification(action: string) {
    this.hide.emit(action);
  }

  markNotificationsReadUnread(notificationId: string) {
    let status: any;
    this.allNotifications.forEach((ele: any) => {
      if(ele.id === notificationId) {
        ele.status = ele.status === '1'? '0': '1';
        status = ele.status;
      }
    });

    this.filterNotifications(this.selectedTab);
    this.setUnreadNotificationCount();

    this.httpService.markNotificationsReadUnread(notificationId, status).subscribe((res: any) => {
      // console.log('markNotificationsReadUnread res:', res);
    });
  }

  deleteNotifications(notificationId: string) {
    const index = this.allNotifications.map((ele: any) => ele.id).indexOf(notificationId);

    this.allNotifications.splice(index, 1);
    this.filterNotifications(this.selectedTab);

    this.httpService.deleteNotifications(notificationId).subscribe((res: any) => {
      // console.log('delete res:', res);
    });
  }

  filterNotifications(filter: string) {
    this.selectedTab = filter;
    this.filteredNotifications = [];

    if(filter === 'all') {
      this.filteredNotifications = this.allNotifications;
      return;
    }

    this.allNotifications?.forEach((notification: any) => {
      if(filter === 'mentioned' && notification.type === 'mentioned') {
        this.filteredNotifications.push(notification);
      } else if(filter === 'unread' && notification.status === '0') {
        this.filteredNotifications.push(notification);
      } else if(filter === 'assigned' && notification.entity_type === "entry" && notification.notif_type === 'assigned') {
        this.filteredNotifications.push(notification);
      }
    });
  }

  setUnreadNotificationCount() {
    let count = 0;
    this.allNotifications?.forEach((notification: any) => {
      if(notification.status === '0') {
        count++;
      }
    });
    this.unreadNotificationCount.emit(count);
  }

  onNotificationClick(notification: any, notificationsType: string) {
    this.showNotification('hide');
    this.markNotificationsReadUnread(notification?.id);
    if(notification?.settings?.board_id) {
      if(notification?.entity_type === 'updates') {
        this.router.navigate([`/boards/${notification?.settings?.board_id}${notification?.settings?.entry_id? "/main/"+notification?.settings?.entry_id+"/updates": "" }`]);
      } else {
        this.router.navigate([`/boards/${notification?.settings?.board_id}${notification?.settings?.entry_id? "/main/"+notification?.settings?.entry_id: "" }`]);
      }
    }
  }

  addNotificationSubscriber( type = '' ) {
    const data = {
      user_id: this.currentUser.ID,
      type: type,
      entity_type: 'board',
      entity_id: this.boardIdForModal,
    }

    this.httpService.addNotificationSubscriber(data).subscribe((res: any) => {
      // console.log('addNotificationSubscriber res:', res);
    });
  }

  getNotificationSubscriber() {
    this.isNotificationSettingsLoading = true;
    const queryParams = `entity_type=board&entity_id=${this.boardIdForModal}`;

    this.httpService.getNotificationSubscriber(queryParams).subscribe((res: any) => {
      res[0] && (this.notificationSettings = res[0]);
      this.isNotificationSettingsLoading = false;
    });
  }

  openNotificationModal(notification: any) {
    this.boardIdForModal = notification?.settings?.board_id;
    this.getNotificationSubscriber();
    this.showNotificationModal = true;
  }

  closeNotificationModal() {
    this.boardIdForModal = '';
    this.showNotificationModal = false;
  }

  markAllNotificationsAsRead() {
    this.allNotifications?.forEach((notification: any) => {
      notification.status = '1';
    });
    this.filterNotifications(this.selectedTab);
    this.setUnreadNotificationCount();

    this.httpService.markAllNotificationsAsRead().subscribe(() => {});
  }

  deleteAllNotifications() {
    this.allNotifications = [];
    this.filteredNotifications = [];

    this.httpService.deleteAllNotifications().subscribe(() => {});
  }
}
