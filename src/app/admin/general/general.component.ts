import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  excludeFiles:boolean = true;
  inpLoading:boolean = true;
  headerCollapsed = false;
  profSaveBtnLoad:boolean = false;
  accSaveBtnLoad:boolean = false;
  taxBtnLoad:boolean = false;
  activeTab:number = 1;
  anglePos = 'down';
  saveProfBtnDisableChk:boolean = true;
  saveAccBtnDisableChk:boolean = true;
  defaultUrl:string = this.router.url
  accountModel:any = {account_name: '', account_url: '', first_day_of_week:'', timelin_weekend_show: 'hide'};
  initialAccountModel:any = {account_name: '', account_url: '', first_day_of_week:'', timelin_weekend_show: 'hide'};
  taxes: any = [{name: '', tax: ''}];

  constructor(private httpService:HttpService, private location:Location, private router:Router) { }

  ngOnInit(): void {
    const keys = Object.keys(this.accountModel).join(',') + ',tax';
    this.getAccounts(keys);
  }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  /**
   *
   * for switching url when tabs change
   */
  urlChange(url:string){
    let urlArr = this.defaultUrl.split('/');
    let urlToChange = urlArr[urlArr.length - 1];
    this.location.go(this.defaultUrl.replace(urlToChange, url));
    if(url==='profile') this.activeTab = 1;
    if(url==='account') this.activeTab = 2;
    if(url==='tax') this.activeTab = 3;
  }

  /**
   *
   * For Changing The Disabled state of saveChanges button on account tab
   */
  saveAcctChangeBtnValid(accountOptions:any):void{

    if(
      this.initialAccountModel.first_day_of_week !== accountOptions.first_day_of_week ||
      this.initialAccountModel.timelin_weekend_show !== accountOptions.timelin_weekend_show
      ){
        this.saveAccBtnDisableChk = false;
        return;
    }
    this.saveAccBtnDisableChk = true;
  }

  /**
   *
   * For Changing The Disabled state of saveChanges button on profile tab
   */
  saveProfChangeBtnValid(accountOptions:any):void{

    if(this.initialAccountModel.account_name !== accountOptions.account_name ||
      this.initialAccountModel.account_url !== accountOptions.account_url
      ){
        this.saveProfBtnDisableChk = false;
        return;
    }
    this.saveProfBtnDisableChk = true;
  }

/**
 *
 * For getting account options
 */
  getAccounts(optionName:any): void{
    this.httpService.getProfileOPtions(optionName).subscribe((res:any) => {
      this.initialAccountModel.account_name = res.account_name;
      this.initialAccountModel.account_url = res.account_url;
      this.initialAccountModel.first_day_of_week = res.first_day_of_week;
      this.initialAccountModel.timelin_weekend_show = res.timelin_weekend_show;
      this.accountModel.account_name = res.account_name;
      this.accountModel.account_url = res.account_url;
      this.accountModel.first_day_of_week = res.first_day_of_week;
      this.accountModel.timelin_weekend_show = res.timelin_weekend_show;
      this.taxes = res.tax || [{name: '', tax: ''}];
      this.inpLoading = false;
    })
  }

  /**
   *
   * for updating Profile options
   */
  updateProfOptions(options:any): void {
    this.saveProfBtnDisableChk = true;
    this.profSaveBtnLoad = true;
    this.inpLoading = true;
    let option:any = {};
    let optionToUpdate:string[] = [];
    let {account_name, account_url } = options

    // for detecting which Key has been changed and needed to get sent for update
    Object.keys({account_name, account_url }).forEach((key:string) => {
      if(this.initialAccountModel[key] !== this.accountModel[key]) {
        option[key] = this.accountModel[key];
        optionToUpdate.push(key);
      }
    });

    this.httpService.updateProfileOPtionsBulk(option).subscribe((res:any) => {
      this.profSaveBtnLoad = false;
      this.inpLoading = false;
      optionToUpdate.forEach( (key: string) => {
        this.initialAccountModel[key] = res[key];
        this.accountModel[key] = res[key];
      });
      this.saveProfChangeBtnValid(this.accountModel);
    });
  }

  /**
   *
   * for updating account options
   */
  updateAccOptions(options:any) : void{
    this.saveAccBtnDisableChk = true;
    this.accSaveBtnLoad = true;
    let option:any = {};
    let optionToUpdate:string[] = [];
    let {first_day_of_week, timelin_weekend_show } = options

    // for detecting which Key has been changed and needed to get sent for update
    Object.keys({first_day_of_week, timelin_weekend_show }).forEach((key:string) => {
      if(this.initialAccountModel[key] !== this.accountModel[key]) {
        option[key] = this.accountModel[key];
        optionToUpdate.push(key);
      }
    });

    this.httpService.updateProfileOPtionsBulk(option).subscribe((res:any) => {
      this.accSaveBtnLoad = false;
      optionToUpdate.forEach( (key: string) => {
        this.initialAccountModel[key] = res[key];
        this.accountModel[key] = res[key];
      });
      this.saveAcctChangeBtnValid(this.accountModel)
    });
  }

  addNewTax() {
    this.taxes.push({name: '', tax: ''});
  }

  removeTax(index: number) {
    this.taxes.splice(index, 1);
  }

  /**
   *
   * for updating tax options
   */
  updateTaxOptions(): void {
    this.taxBtnLoad = true;
    const option: any = {
      tax: this.taxes?.filter((ele: any) => { return !!ele?.name && !!ele?.tax}),
    }

    this.httpService.updateProfileOPtionsBulk(option).subscribe((res:any) => {
      this.taxes = res?.tax;
      this.taxBtnLoad = false;
    });
  }

}
