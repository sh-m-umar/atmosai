import { HttpService } from '../../http.service';
import { Component, OnInit, enableProdMode } from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  headerCollapsed = false;
  anglePos = 'down';
  isEditEmail = true;
  isSso = false;
  activeTab: string = 'login';
  twoFactorAuth: any = {
    enable_two_factor_auth: 'no',
    two_factor_auth_method: 'email',
  };
  password_policy: string = '';
  authorized_domain: string = '';
  authorized_domain_check: boolean = false;
  sso_provider: string = '';
  login_restrictions: string = '';

  constructor(
    private httpService:HttpService,
  ) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.getProfileOPtions();
    this.get2FA();
  }

  get2FA() {
    this.httpService.get2FA().subscribe( (res: any) => {
      this.twoFactorAuth = res;
    });
  }

  getProfileOPtions() {
    this.httpService.getProfileOPtions('password-policy,authorized_domain,sso_provider,login_restrictions').subscribe( (res: any) => {
      this.password_policy = res['password-policy'];
      this.authorized_domain = res?.authorized_domain;
      this.authorized_domain_check = res?.authorized_domain? true: false;
      this.sso_provider = res?.sso_provider;
      this.login_restrictions = res?.login_restrictions;
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  disable2FA() {
    this.twoFactorAuth.enable_two_factor_auth = 'no';
    this.update2FA();
  }

  enable2FA() {
    this.twoFactorAuth.enable_two_factor_auth = 'yes';
    this.update2FA();
  }

  update2FA() {
    this.httpService.update2FA(this.twoFactorAuth).subscribe( (res: any) => {
      this.twoFactorAuth = res;
    });
  }

  updatePasswordPolicy() {
    const option = {
      'password-policy': this.password_policy,
      'authorized_domain': this.authorized_domain,
    }
    this.httpService.updateProfileOPtionsBulk(option).subscribe( (res: any) => {
      this.password_policy = res['password-policy'];
      this.authorized_domain = res?.authorized_domain;
    });
  }

  updateSSO() {
    const option = {
      'sso_provider': this.sso_provider,
      'login_restrictions': this.login_restrictions,
    }
    this.httpService.updateProfileOPtionsBulk(option).subscribe( (res: any) => {
      this.sso_provider = res.sso_provider;
      this.login_restrictions = res?.login_restrictions;
    });
  }

}
