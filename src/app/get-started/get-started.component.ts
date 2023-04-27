import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { lastValueFrom } from 'rxjs';
import {AuthService} from "../auth.service";
import {LocalService} from "../local.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit {

  blasting = true;
  customEmail = false;
  emailConfigure = false;
  public modules: any[] = [];
  public inviteObject: any = { emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false };
  public menuItems: any[] = [];
  public selectedModuleIndex = 0;
  public percentageCompletion = 15;
  currentTab = 'account';
  emailAccountType = 'microsoft';
  payWith = 'atmos';
  connectTwilio = false;
  isProfileComplete = true;
  crmSetup = false;
  public greetingTxt:string = 'Hello';
  public currentDate = new Date();
  public userData:any;

  userInfo: any = {
    account: {
      tab: 'account',
      first_name: '',
      last_name: '',
      email: '',
      address_1: '',
      address_2: '',
      zip: '',
      phone: '',
      home_phone: '',
      work_phone: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    business: {
      tab : 'business',
      business_logo: '',
      business_name: '',
      website_url: '',
      admin_email: '',
      business_address: '',
      company_size: '',
      timezone: '',
    },
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
    },
    enable_telephony: {
      tab: 'enable_telephony',
      connect_twilio: {
        public_key: '',
        secret: '',
        api_key: '',
        api_token: '',
        outgoing_application_sid: '',
        phone_number: '',
      }
    },
    setup_banking: {
      stripe_settings: {
        tab: 'setup_banking',
        key: 'stripe_settings',
        testmode: false,
        test_publishable_key: '',
        test_secret_key: '',
        publishable_key: '',
        secret_key: '',
        test_webhook_secret: '',
        webhook_secret: '',
      },
      paypal_settings: {
        tab: 'setup_banking',
        key: 'paypal_settings',
        enabled: '',
        title: '',
        description: '',
        email: '',
        testmode: '',
        api_username: '',
        api_password: '',
        api_signature: '',
        sandbox_api_username: '',
        sandbox_api_password: '',
        sandbox_api_signature: '',
        client_id: '',
        client_secret: '',
      },
      nmi_settings: {
        tab: 'setup_banking',
        key: 'nmi_settings',
        enabled: '',
        title: '',
        description: '',
        testmode: 'yes',
        api_keys: '',
        private_key: '',
        public_key: '',
        username: '',
        password: '',
        capture: '',
        saved_cards: '',
        add_customer_method: '',
        logging: '',
      },
    }
  };

  tempImage: any = {
    image: null,
    preview: null,
    isLoading: false,
  };

  constructor(
      private auth: AuthService,
      private httpService: HttpService,
      private localStore: LocalService,
      private router: Router,
      private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      if(queryParams['tab'] && queryParams['tab'] === 'account') {
        if(queryParams['subTab'] && queryParams['subTab'] === 'socialLinks') {
          this.crmSetup = true;
          this.openSocialProfilesTab(queryParams['subTab']);
        }
      } else if(queryParams['tab'] && queryParams['tab'] === 'connect-email') {
        this.crmSetup = true;
        this.currentTab ='connect_email';
      }
    });
  }

  ngOnInit(): void {
    // Remove onboarding from local storage
    this.localStore.remove('onboarding');
    this.getData();

    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.blasting = false;
  }, 5000);
  }

  switchTab(tab: string) {
    this.currentTab = tab;

    // Update the percentage completion based on the current tab
    switch (tab) {
        case 'account':
            this.percentageCompletion = 15;
            break;
        case 'business':
            this.percentageCompletion = 30;
            break;
            case 'connect_email':
            this.percentageCompletion = 45;
            break;
        case 'setup_banking':
            this.percentageCompletion = 60;
            break;
        case 'enable_telephony':
            this.percentageCompletion = 75;
            break;
    }
  }

  emailConnect(type:string = ''){
    (type == 'custom' ? this.customEmail = true : this.customEmail = false);
    this.emailAccountType = type;
  }

  paymentMethod(type:string = ''){
    this.payWith = type;
  }

  getData() {
    this.getUserInfo();
    this.userData = this.auth.getUserData();

    // say good morning, good afternoon, good evening based on time
    // const today = new Date();
    // const curHr: any = today.getHours();
    // switch (curHr) {
    //   case curHr < 12:
    //     this.greetingTxt = 'Good morning';
    //     break;
    //   case curHr < 18:
    //     this.greetingTxt = 'Good afternoon';
    //     break;
    //   default:
    //     this.greetingTxt = 'Good evening';
    // }
  }

  getUserInfo() {
    this.httpService.getUserInfo().subscribe( (res: any) => {
      this.userInfo = {
        account: {
          tab: 'account',
          first_name: res.first_name || '',
          last_name: res.last_name || '',
          email: res.email || '',
          address_1: res.address_1 || '',
          address_2: res.address_2 || '',
          zip: res.zip || '',
          phone: res.phone || '',
          home_phone: res.home_phone || '',
          work_phone: res.work_phone || '',
          facebook: res.facebook || '',
          twitter: res.twitter || '',
          instagram: res.instagram || '',
          linkedin: res.linkedin || '',
        },
        business: {
          tab : 'business',
          business_logo: res.business_logo || '',
          business_name: res.business_name || '',
          website_url: res.website_url || '',
          admin_email: res.admin_email || '',
          business_address: res.business_address || '',
          company_size: res.company_size || '',
          timezone: res.timezone || '',
        },
        update_email_smtp: {
          google: res.google || {},
          microsoft: res.microsoft || {},
          smtp: {...this.userInfo.update_email_smtp.smtp, ...res.smtp},
        },
        enable_telephony: {
          tab: 'enable_telephony',
          connect_twilio: {...this.userInfo.enable_telephony.connect_twilio, ...res.connect_twilio},
        },
        setup_banking: {
          stripe_settings: {...this.userInfo.setup_banking.stripe_settings, ...res.stripe_settings},
          paypal_settings: {...this.userInfo.setup_banking.paypal_settings, ...res.paypal_settings},
          nmi_settings: {...this.userInfo.setup_banking.nmi_settings, ...res.nmi_settings},
        }
      };
    });
  }

  async onFileChange(input: any) {
    this.tempImage.isLoading = true;
    this.tempImage.image = input.srcElement.files[0];
    const file = await this.uploadPhoto(this.tempImage.image);
    this.tempImage.isLoading = false;
    if(file.status === true) {
      this.userInfo.business.business_logo = file.data.url;
    }
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

  setNewLocation(event: any) {
    if (event.formatted_address) {
      this.userInfo.business.business_address = event.formatted_address;
    }
  }

  onChangeInviteModules(event: any, product: any) {
    if(event.target.checked) {
      this.inviteObject.products.push(product.module);
    } else {
      const index = this.inviteObject.products.indexOf(product.module);
      this.inviteObject.products.splice(index, 1);
    }
  }

  toggleInviteModel(state: Boolean) {
    this.inviteObject.showModal = state;
    !state && (this.inviteObject = { emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false });
  }

  onInviteSend(){
    if(!this.inviteObject.emails.length) {
      alert('Add email(s) to send invite(s).');
      return;
    }
    if(!this.inviteObject.products.length) {
      alert('Add product(s) to send invite(s).');
      return;
    }

    this.inviteObject.isLoading = true;

    const data: any = {
      emails: this.inviteObject.emails.join(','),
      products: this.inviteObject.products.join(','),
      user_kind: this.inviteObject.user_kind,
    }
    this.httpService.sendInvite(data).subscribe( (res: any) => {
      // const invitations = {
      //   sent: response?.filter((invite: any) => invite.status === true).map((invite: any) => invite.email).join(', '),
      //   notSent: response?.filter((invite: any) => invite.status === true).map((invite: any) => invite.email).join(', '),
      // }
      alert(`Invite sent to user(s).`);
      this.inviteObject.isLoading = false;
      this.toggleInviteModel(false);
    });
  }

  getMenuItems(switchModule = false) {
    const local = this.localStore.get('menuItems');

    if (local) {
        this.menuItems = local[this.selectedModuleIndex].items;
        this.modules = local;
    } else {
        this.httpService.getMenuItems().subscribe((data: any) => {
            this.menuItems = data[0].items;
            this.modules = data;
        });
    }

    // load first menu item
    if (switchModule) {
        this.loadFirstItem();
    }
  }

  /**
   * Load first item in the menu
   */
  loadFirstItem() {
    if (this.menuItems.length > 0 && !['', '#'].includes(this.menuItems[0].link)) {
        this.router.navigate([this.menuItems[0].link]);
    }
  }


  onSaveEmailConnection(emailAccountType: string) {
    if((emailAccountType == 'google' && !this.userInfo.update_email_smtp.google.connect_url) || (emailAccountType == 'microsoft' && !this.userInfo.update_email_smtp.microsoft.connect_url)){
      return
    }

    let connectUrl = '';

    if(emailAccountType === 'custom') {
      const data: any = {
        ...this.userInfo.update_email_smtp.smtp.settings,
        email: this.userInfo.update_email_smtp.smtp.email,
        action: 'update_email_smtp',
      }
      this.httpService.updateCrmSettings(data).subscribe( (res: any) => {
      });
    } else if(emailAccountType === 'google' || emailAccountType === 'microsoft') {
      const myWindow:any = window.open(this.userInfo.update_email_smtp[emailAccountType].connect_url, '', 'width=700,height=800');

      // On close window, go to the next step
      const that = this;
      const timer = setInterval(function() {
        if(myWindow.closed) {
          clearInterval(timer);
          that.currentTab = 'setup_banking';
        }
      }, 1000);
    }
  }

  onSaveTelephony() {
    const data: any = {
      ...this.userInfo.enable_telephony.connect_twilio,
      tab: 'enable_telephony',
    }
    this.httpService.saveUserInfo(data).subscribe( (res: any) => {
    });
  }

  onSaveInfo(tab: string) {
    switch (tab) {
        case 'account':
          this.switchTab('business');
            break;
        case 'business':
          this.switchTab('connect_email');
            break;
        // case 'connect_email':
        //     this.currentTab = 'setup_banking';
        //     break;
        // case 'setup_banking':
        //     this.currentTab = 'enable_telephony';
        //     break;
        // case 'enable_telephony':
            //this.currentTab = 'account';
           // break;
    }

    this.httpService.saveUserInfo(this.userInfo[tab]).subscribe( (res: any) => {
    });
  }

  onSaveBankingInfo(tabKey: string) {
    this.httpService.saveUserInfo(this.userInfo.setup_banking[tabKey]).subscribe( (res: any) => {
    });
  }

  /**
   * Connect accounts with Google/Microsoft
   * @param type
   */
  connectAccount(type = 'google') {
    // Get user from local
    const user = this.localStore.get('userData');
    const myWindow:any = window.open(this.userInfo.update_email_smtp[type].connect_url, '', 'width=700,height=800');

    const that = this;
    const timer = setInterval(function() {
      if(myWindow.closed) {
        clearInterval(timer);
        //that.getEmailSettings(true);
      }
    }, 1000);

  }

  OnImportLeadsConfigure() {
    this.router.navigate(['boards/1/main'], {queryParams: {import: 'leads'}});
  }

  openSocialProfilesTab(tab: string) {
    setTimeout(() => {
      const tabElement = document.getElementById(tab);
      console.log('tabElement', tabElement);
      tabElement?.click();
    }, 100);
  }
}
