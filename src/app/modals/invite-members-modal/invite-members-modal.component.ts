import { CacheService } from 'src/app/cache.service';
import { ModuleItemsService } from './../../module-items.service';
import { HttpService } from '../../http.service';
import { LocalService } from '../../local.service';
import { Component, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite-members-modal',
  templateUrl: './invite-members-modal.component.html',
  styleUrls: ['./invite-members-modal.component.scss'],
})
export class InviteMembersModalComponent implements OnInit {
  @Input() board: any;

  public guestEmails: string = '';
  public user: string = '';
  public users: any[] = [];
  public filteredUsers: any[] = [];
  public selectedModuleIndex: number = 0;
  public modules: any[] = [];
  public subscribers: any[] = [];
  public isAddingSubscriber: boolean = false;

  constructor(
    private httpService: HttpService,
    private localStore: LocalService,
    private moduleService: ModuleItemsService,
    public cache: CacheService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.getModules();
    this.getUsers();
    this.getSubscribers();
  }

  getUsers() {
    const users = this.cache.getUsersCache();
    if (users) {
      this.users = users;
      this.filteredUsers = users;
    } else {
      this.httpService.getUsers().subscribe((res: any) => {
        this.cache.setUsersCache(res);
        this.users = res;
        this.filteredUsers = res;
      });
    }
  }

  async getModules() {
    this.modules = await this.moduleService.getModuleItemsFromServerOrLocal();
  }

  onInviteSend(userType: string, email: string) {
    this.selectedModuleIndex = this.localStore.get('currentModuleIndex');

    let data: any = {
      products: this.modules[this.selectedModuleIndex]?.name || 'crm',
      user_kind: userType,
      emails: email,
    };

    if (!data.emails) {
      alert(`Add email to invite.`);
      return;
    }

    this.guestEmails = '';

    this.httpService.sendInvite(data).subscribe((res: any) => {
      alert(`Invite sent to user(s).`);
    });
  }

  // add subscriber
  addSubscriber(userID: any) {
    let data = {
      user_id: userID,
      type: '',
      entity_type: 'board',
      entity_id: this.board.id,
    };

    // set loader
    this.isAddingSubscriber = true;

    this.httpService.addSubscriber(data).subscribe((res: any) => {
      if (res) {
        this.subscribers = res;

        // reset input field
        this.user = '';
        this.filteredUsers = this.users;

        // remove loader
        this.isAddingSubscriber = false;
      }
    });
  }

  onUserChange(text: string) {
    if (text) {
      this.filteredUsers = this.users.filter((user) => {
        return user.display_name.includes(text);
      });
    } else {
      this.filteredUsers = this.users.filter((user) => {
        return user.ID;
      });
    }
  }

  onUserSelect(user: any) {
    if (!user?.ID) {
      alert(`User don't have ID.`);
      this.user = '';
      this.filteredUsers = this.users;
      return;
    }
    this.addSubscriber(user.ID);
  }

  setSubscriberAsOwner(userId: any, type = '', index: number) {
    let count = 0;
    this.subscribers.forEach((ele: any) => {
      ele?.type === 'owner' && count++;
    });

    if (userId && (type === 'owner' || (type === '' && count > 1))) {
      const data = {
        entity_type: 'board',
        entity_id: this.board.id,
        type,
        user_id: userId,
      };

      this.subscribers[index].type = type;

      this.httpService.addNotificationSubscriber(data).subscribe((res: any) => {
        this.subscribers = res;
      });
    }
  }

  // delete subscriber
  deleteSubscriber(subscriberID: any) {
    // remove subscriber from
    const subscribers = this.subscribers;
    this.subscribers = subscribers.filter((subscriber: any) => {
      return subscriber.id != subscriberID;
    });

    this.httpService.deleteSubscriber(subscriberID).subscribe((res: any) => {
      if (res) {
        this.subscribers = res.subscribers;
      }
    });
  }

  // convert subscriber short name
  getShortName(subscriber: any) {
    if (subscriber == undefined || !subscriber) {
      return '';
    }
    if (!isNaN(subscriber)) {
      const user = this.users?.filter((userObj: any) => {
        return userObj.ID == subscriber;
      });
      return user[0]?.fname?.substring(0, 1) + user[0]?.lname?.substring(0, 1);
    } else {
      return (
        subscriber?.user?.fname?.substring(0, 1) +
        subscriber?.user?.lname?.substring(0, 1)
      );
    }
  }

  // get subscribers
  getSubscribers() {
    if (this.board.id) {
      const data = {
        entity_type: 'board',
        entity_id: this.board.id,
      };
      this.httpService.getSubscribers(data).subscribe((res: any) => {
        if (res) {
          this.subscribers = res;
        }
      });
    }
  }
}
