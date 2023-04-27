import { Component, OnInit } from '@angular/core';
import {LocalService} from "../../local.service";
import {HttpService} from "../../http.service";

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  headerCollapsed = false;
  anglePos = 'down';
  public isCopied = false;
  public ApiToken: string = '';
  public apiTokenButton: string = 'Generate';
  public user: any = this.localStore.get('userData');

  constructor(
    public httpService: HttpService,
    private localStore: LocalService,
  ) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ngOnInit(): void {
    this.getApiToken();
  }

  getApiToken() {
    this.httpService.getApiToken(this.user.ID).subscribe( (res: any) => {
      this.ApiToken = res;
      this.ApiToken && (this.apiTokenButton = 'Regenerate');
    });
  }

  generateApiToken() {
    this.apiTokenButton = 'Generating...'
    this.httpService.generateApiToken().subscribe( (res: any) => {
      this.ApiToken = res;
      this.ApiToken && (this.apiTokenButton = 'Generated');
      setTimeout(() => {
        this.apiTokenButton = 'Regenerate';
      }, 2000);
    });
  }

  makeApiVisible() {
    let apiInput: any = document.getElementById('apiInput');
    if(apiInput) {
      apiInput.style.color = 'black';
      apiInput.style.textShadow = '0 0 black';
    }
  }

  onCopy() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }
}
