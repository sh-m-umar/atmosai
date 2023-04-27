import { LocalService } from './../../local.service';
import { CacheService } from './../../cache.service';
import { HttpService } from './../../http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss'],
})
export class EmailSettingsComponent implements OnInit {
  headerCollapsed = false;
  activeTab: number = 1;
  anglePos = 'down';
  btnTxt = 'Update';

  public emailSettings: any = false;
  public showLoadSettingBtnTxt = 'Reload connected accounts';
  public showLoadSetting = false;
  public emailSettingsEditorType = {one: 'simple', two: 'simple'};

  userInfo: any = {
    update_email_smtp: {
      google: {},
      microsoft: {},
      smtp: {
        email: '',
        connected: '',
        settings: {
          action: 'update_email_smtp',
          email_syncing: false,
          smtp_host: '',
          smtp_username: '',
          smtp_password: '',
          smtp_secure: false,
          imap_host: '',
          imap_username: '',
          imap_password: '',
          imap_secure: false,
        },
      },
    }
  };

  headerToggle() {
    !this.headerCollapsed
      ? (this.headerCollapsed = true)
      : (this.headerCollapsed = false);
    !this.headerCollapsed ? (this.anglePos = 'down') : (this.anglePos = 'up');
  }

  urlChange(url: string) {
    if (url === 'manage') this.activeTab = 1;
    if (url === 'outgoing') this.activeTab = 2;
    if (url === 'tax') this.activeTab = 3;
    if (url === 'sharing') this.activeTab = 4;
    if (url === 'signature') this.activeTab = 5;
    if (url === 'branding') this.activeTab = 6;
    if (url === 'log') this.activeTab = 7;
  }

  constructor(
    private httpService: HttpService,
    private cache: CacheService,
    private localStore: LocalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getEmailSettings(true);
  }

  getUserInfo() {
    this.httpService.getUserInfo().subscribe( (res: any) => {
      this.userInfo = {
        update_email_smtp: {
          google: res.google || {},
          microsoft: res.microsoft || {},
          smtp: {...this.userInfo.update_email_smtp.smtp, ...res.smtp},
        }
      };
    });
  }

  /**
   * Connect accounts with Google/Microsoft
   * @param type
   */
  connectAccount(type = 'google') {
    // Get user from local
    const user = this.localStore.get('userData');
    this.showLoadSetting = true;
    this.showLoadSettingBtnTxt = 'Getting connect accounts...';

    const myWindow: any = window.open(
      this.userInfo.update_email_smtp[type].connect_url,
      '',
      'width=700,height=800'
    );

    const that = this;
    const timer = setInterval(function () {
      if (myWindow.closed) {
        clearInterval(timer);
        that.getEmailSettings(true);
      }
    }, 1000);
  }

  /**
   * Delete connected account
   *
   * @param account
   */
  deleteConnectedAccount(account: string = '') {
    // Delete array item by search
    this.emailSettings.connected_accounts =
      this.emailSettings.connected_accounts.filter((item: any) => {
        return item.type !== account;
      });

    this.updateEmailSettings(
      'delete_settings',
      account + '_account_connection'
    );
  }

  /**
   * Update email settings
   *
   * @param type
   */
  updateEmailSettings(type = '', args: any = null) {
    if (type === '') {
      return;
    }

    this.btnTxt = 'Updating..';

    let data = {};

    switch (type) {
      case 'delete_settings':
        data = { action: 'delete_settings', key: args };
        break;
      case 'signature':
        data = {
          action: 'update_email_signature',
          user_signature: this.emailSettings.email_signature,
          global_signature: this.emailSettings.global_email_signature,
        };
        break;
      default:
        data = {
          action: 'update_usermeta',
          key: type,
          content: this.emailSettings[type],
        };
    }

    this.httpService.updateCrmSettings(data).subscribe((res: any) => {
      this.btnTxt = 'Update';
      if (res.data !== undefined) {
        this.emailSettings = res.data;
        this.localStore.set('emailSettings', this.emailSettings);
      }
    });
  }

  /**
     * Get email settings
     */
  getEmailSettings(forceLoad = false) {
    this.emailSettings = false;
    const localSettings = this.localStore.get('emailSettings');
    if (localSettings && !forceLoad) {
        this.emailSettings = localSettings;
        this.showLoadSetting = false;
        this.showLoadSettingBtnTxt = 'Reload connected accounts';
    } else {
        this.httpService.getCrmSettings().subscribe((res: any) => {
            this.emailSettings = res;
            this.localStore.set('emailSettings', res);
            this.showLoadSetting = false;
            this.showLoadSettingBtnTxt = 'Reload connected accounts';
        });
    }
    return true;
  }

  openNotificationSettings() {
    this.router.navigate(['/my-profile'], {queryParams:{tab: 'notifications'}})
  }
}
