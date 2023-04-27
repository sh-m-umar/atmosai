import { HttpService } from '../http.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { LocalService } from '../local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OneSignal } from 'onesignal-ngx';
import { TIME_ZONES } from './../constants/time-zones.const';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  headerCollapsed = false;
  anglePos = 'down';
  public currentUser: any = {};
  public userMetaData: any = {};
  public savingMetaData: boolean = false;
  public pageLoading: boolean = false;
  public editing: any = '';
  public isPushEnabled: boolean = false;

  public resetPasswordMessage: string = '';
  public resettingPassword: boolean = false;
  public timeZones: any = TIME_ZONES;

  public workingStatus: any = {
    status: '',
    status_end_time: '',
    disable_ooo_notifications: false,
    disable_online_indication: false,
  };
  public resetPassword: any = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };
  public securityQuestions: any = {
    question_1: '',
    answer_1: '',
    question_2: '',
    answer_2: '',
    question_3: '',
    answer_3: '',
  };
  public manageNotifications: any = {
    email_notifications: {
      assigns_to_item: true,
      mentions_reply_item: true,
      writes_update_item_owner: true,
      writes_update_item_subscribed: true,
      replies_or_likes_conversation: true,
      replies_to_update: true,
      signs_up_after_invite: true,
      does_not_sign_up_after_invite: true,
      subscribes_board_item_team: true,
      notifies_automations: true,
      subscribes_new_item: true,
      highlights: true,
      highlights_type: "all-dates"
    },
    in_app_notifications: {
      likes_my_update: true,
      replies_to_update: true,
      replies_or_likes_conversation: true,
      subscribes_board_item_team: true,
      assigns_to_item: true,
      writes_update_item_subscribed: true
    }
  };
  public documents: any = [];
  public language_region: any = {
    language: "EN",
    timezone: "",
    date_format: "",
    time_format: "",
  };

  public socialLinks: any = {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  };

  isLoading: any = {
    workingStatus: false,
    securityQuestions: false,
    documents: false,
    manageNotifications: false,
    language_region: false,
  }

  constructor(
    public settings: SettingsService,
    private localStore: LocalService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private oneSignal: OneSignal,
  ) {
    this.route.queryParams.subscribe((queryParams: any) => {
      if(queryParams['tab'] && queryParams['tab'] === 'notifications') {
        setTimeout(() => {
          const element: any = document.getElementById('manage-notifications-tab');
          element.click();
        }, 500);
      }
    });
  }

  ngOnInit(): void {

    // set data for the page
    this.setData();
    this.getData();

    this.oneSignal.isPushNotificationsEnabled().then((isEnabled) => {
        this.isPushEnabled = isEnabled;
    });
  }

  getData() {
    // get user profile fields
    this.settings.getProfileFields();

    // get user meta data
    this.getUserMetaData();
    this.getSocialLinks();
    this.getManageDocuments();
    this.getLanguageRegion();
  }

  setData() {
    this.setWorkingStatus();
    this.setSecurityQuestions();
    this.setManageNotifications();

    // set current user data
    this.currentUser = this.localStore.get( 'userData' );
  }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  // update meta data in the database
  updateUserMetaData() {

    // exit editing mode for the element
    this.editing = '';

    //set the save button to loading
    this.savingMetaData = true;

    // set user id
    this.userMetaData.user_id = this.currentUser.ID;

    // convert array to object
    this.userMetaData = Object.assign( {}, this.userMetaData );

    // save prepared data in the database
    this.httpService.updateUserMeta( this.userMetaData ).subscribe( ( res: any ) => {

      // update meta data in local store
      this.localStore.set( 'userMetaData', res, false );

      // remove save button loading
      this.savingMetaData = false;
    } );
  }

  getUserMetaData() {

    // check if data available in local store
    this.userMetaData = this.localStore.get( 'userMetaData', false );

    if(this.userMetaData) {
      // reset email field value
      this.userMetaData.email = this.currentUser.user_email;
    }

    // if data doesn't exists in the local store then get from the database
    if( typeof this.userMetaData != 'object' || this.userMetaData.length < 1 ) {

      // set page loading
      this.pageLoading = true;

      // prepare meta keys to get data from the database
      let meta_keys = this.settings.user_profile_fields.map( ( field: any ) => {
        return field.field_key;
      } );
      meta_keys = meta_keys.join( ',' );

      // get data from the database
      this.httpService.getUserMeta( meta_keys, this.currentUser.ID ).subscribe( ( res: any ) => {
        this.userMetaData = res;

        // reset email field value
        this.userMetaData.email = this.currentUser.user_email;

        // save meta data in the local store
        this.localStore.set( 'userMetaData', res, false );

        // remove page loader
        this.pageLoading = false;
      } );
    }
  }

  // check if field is in edit mode
  isEditing( key = '' ) {
    return key == this.editing;
  }

  // change field to editing mode
  updateEditing( key = '' ) {

    // do not enable editing mode for email field
    if( key != 'email' ) {
      this.editing = key;

      // focus the input element
      setTimeout( () => {
        const field = document.getElementById( 'profile-field-' + key );
        field?.focus();
      }, 100 );
    }
  }

  getSocialLinks() {
    this.httpService.getUserInfo('?tab=account').subscribe( (res: any) => {
      this.socialLinks.facebook = res?.facebook || '';
      this.socialLinks.instagram = res?.instagram || '';
      this.socialLinks.linkedin = res?.linkedin || '';
      this.socialLinks.twitter = res?.twitter || '';
    });
  }

  getLanguageRegion() {
    this.isLoading.language_region = true;
    this.httpService.getUserMetaData('?meta_key=app_user_settings').subscribe( (res: any) => {
      if(res) {
        const data: any = JSON.parse(res);
        this.language_region.language  = data?.language || '';
        this.language_region.timezone = data?.timezone || '';
        this.language_region.date_format = data?.date_format || '';
        this.language_region.time_format = data?.time_format || '';
      }
      this.isLoading.language_region = false;
    });
  }

  setWorkingStatus() {
    this.isLoading.workingStatus = true;
    this.httpService.updateWorkingStatus({}).subscribe((res: any) => {
      this.workingStatus = {
        ...this.workingStatus,
        ...res?.data
      };
      this.isLoading.workingStatus = false;
    });
  }
  setSecurityQuestions() {
    this.isLoading.securityQuestions = true;
    this.httpService.updateSecurityQuestions({}).subscribe((res: any) => {
      this.securityQuestions = {
        question_1: res?.question_1?.question || '',
        answer_1: res?.question_1?.answer || '',
        question_2: res?.question_2?.question || '',
        answer_2: res?.question_2?.answer || '',
        question_3: res?.question_3?.question || '',
        answer_3: res?.question_3?.answer || '',
      }
      this.isLoading.securityQuestions = false;
    });
  }
  setManageNotifications() {
    this.isLoading.manageNotifications = true;
    this.httpService.updateManageNotifications({}).subscribe((res: any) => {
      this.manageNotifications = {
        ...this.manageNotifications,
        ...res
      };
      this.isLoading.manageNotifications = false;
    });
  }


  getManageDocuments() {
    this.isLoading.documents = true;
    this.httpService.updateManageDocuments({}).subscribe((res: any) => {
      this.documents = Object.values(res);
      this.isLoading.documents = false;
    });
  }

  updateWorkingStatus() {
    this.httpService.updateWorkingStatus(this.workingStatus).subscribe((res: any) => {
    });
  }

  updateLanguageRegion() {
    const data: any = {
      meta_key: 'app_user_settings',
      meta_value: JSON.stringify(this.language_region),
    };

    this.httpService.updateUserMetaData(data).subscribe((res: any) => {
    });
  }

  changePassword() {
    this.resetPasswordMessage = '';
    // check if password don't match
    if( this.resetPassword.confirm_password !== this.resetPassword.new_password ) {
      this.resetPasswordMessage = 'New password and confirm password does not match.';
      return;
    }

    this.resettingPassword = true;

    this.httpService.changePassword(this.resetPassword).subscribe((res: any) => {
      this.resettingPassword = false;
      this.resetPasswordMessage = res.message;
      this.resetPassword.old_password = '';
      this.resetPassword.new_password = '';
      this.resetPassword.confirm_password = '';
    },
    (error: any) => {
      this.resettingPassword = false;
      this.resetPasswordMessage = error.error.message;
    });
  }

  updateSecurityQuestions() {
    this.httpService.updateSecurityQuestions(this.securityQuestions).subscribe((res: any) => {
    });
  }

  updateManageNotifications() {
    this.httpService.updateManageNotifications(this.manageNotifications).subscribe((res: any) => {
    });
  }

  onEditSocialLinks() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['get-started'], {queryParams: {tab: 'account', subTab: 'socialLinks'}}));
    window.open(url, '_blank');
  }

  async uploadPhoto(file: any) {
    if(file) {
      let formData: any = new FormData();
      formData.append('action', 'upload');
      formData.append('type', 'file');
      formData.append('content', file);

      const uploadFile$ = this.httpService.uploadFile('crm-settings', formData);
      const response = await lastValueFrom(uploadFile$);

      return response;
    }
  }

  async uploadFile(input: any) {
    if(input.srcElement.files[0]) {
      this.isLoading.documents = true;
      const file = await this.uploadPhoto(input.srcElement.files[0]);
      if(file?.data?.id) {
        const document = await this.updateManageDocument(file?.data?.id);

        this.documents = Object.values(document);
      }
      this.isLoading.documents = false;
    }
  }

  async updateManageDocument(document_id: number) {
    let data = {
      document_id,
    }
    const uploadManageDocument$ = this.httpService.updateManageDocuments(data);
    const response = await lastValueFrom(uploadManageDocument$);

    return response;
  }

  /**
   * Subscribe or unsubscribe onesignal push notifications
   */
  subscribePushNotifications() {
    this.oneSignal.setSubscription(!this.isPushEnabled).then(() => {
      this.isPushEnabled = !this.isPushEnabled;
    });
  }

}
