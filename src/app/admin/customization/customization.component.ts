import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import { SettingsService } from '../../settings.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss']
})
export class CustomizationComponent implements OnInit {

  headerCollapsed = false;
  featureSaveBtnActive = false;
  featureSaveBtnLoad = false;
  featureRadioLoad = true;
  anglePos = 'down';
  activeTab: number = 1;
  boardSubTab: string = 'status';
  defaultUrl: string = this.router.url;
  featuresModel: any = { enable_gif: 'no', display_link: 'no', file_prev: 'no', premade_due: 'no', premade_status: 'no', online_activity: 'no', auto_login: 'no', boards_email: 'no' };
  initialFeaturesModel: any = { enable_gif: 'no', display_link: 'no', file_prev: 'no', premade_due: 'no', premade_status: 'no', online_activity: 'no', auto_login: 'no', boards_email: 'no' };
  email_header_logo: string = './assets/img/atmos-logo.svg';
  isMenuLogoUploading = false;
  isEmailLogoUploading = false;
  userProfileData: any = {}
  isBoardStatusesLoading = false;
  isBoardPriorityLoading = false;
  isBoardLabelLoading = false;
  isBoardCategoryLoading = false;
  isBoardDropdownLoading = false;
  isUserProfileFieldsLoading = false;
  isUserProfileFieldsUploading = false;

  constructor(
    private router: Router, 
    private location: Location, 
    private httpService: HttpService,
    public settings: SettingsService,
    ) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.getFeatures(Object.keys(this.featuresModel).join(','));
    this.settings.getBoardData();
  }

  ngAfterViewInit() {

    // get branding data from local store
    this.settings.getBrandingData();

    // get user profile fields data
    this.settings.getProfileFields();
  }

  /**
   *
   * for switching url when tabs change
   */
  urlChange(url: any) {
    let urlArr = this.defaultUrl.split('/');
    let urlToChange = urlArr[urlArr.length - 1];
    this.location.go(this.defaultUrl.replace(urlToChange, url));
    if (url === 'branding') this.activeTab = 1;
    if (url === 'features') this.activeTab = 2;
    if (url === 'boards') this.activeTab = 3;
    if (url === 'user-profile') this.activeTab = 4;
  }

  /**
   *
   * For getting account options
   */
  getFeatures(optionName: any): void {
    this.httpService.getProfileOPtions(optionName).subscribe((res: any) => {

      Object.keys(this.initialFeaturesModel).forEach((key: any) => {
        this.initialFeaturesModel[key] = res[key];
        this.featuresModel[key] = res[key];
      });

      this.featureRadioLoad = false;
    })
  }

  /**
   * for updating features options
   */
  saveFeatureChangeBtnValid(accountOptions: any): void {
    let terminate = false;

    Object.keys(accountOptions).forEach((key: string) => {
      if (this.initialFeaturesModel[key] !== this.featuresModel[key]) {

        this.featureSaveBtnActive = true;
        terminate = true;
        return;
      }
    });

    if (terminate) return;
    this.featureSaveBtnActive = false;
  }

  /**
 *
 * for updating Profile options
 */
  updateFeatureOptions(options: any): void {
    this.featureSaveBtnActive = false;
    this.featureSaveBtnLoad = true;
    this.featureRadioLoad = true;
    let option: any = {};
    let optionToUpdate: string[] = [];
    // for detecting which Key has been changed and needed to get sent for update
    Object.keys(this.initialFeaturesModel).forEach((key: string) => {
      if (this.initialFeaturesModel[key] !== this.featuresModel[key]) {
        option[key] = this.featuresModel[key];
        optionToUpdate.push(key);
      }
    });

    this.httpService.updateProfileOPtionsBulk(option).subscribe((res: any) => {
      this.featureSaveBtnLoad = false;
      this.featureRadioLoad = false;
      optionToUpdate.forEach((key: string) => {
        this.initialFeaturesModel[key] = res[key];
        this.featuresModel[key] = res[key];
      });
      this.saveFeatureChangeBtnValid(this.featuresModel);
    });
  }

  /**
   * File upload
   */
  fileUpload(input: any, type: string) {
    const files = input.srcElement.files;
    if (files.length) {
      type === 'main_menu_logo' && (this.isMenuLogoUploading = true);
      type === 'email_header_logo' && (this.isEmailLogoUploading = true);
      let formData: any = new FormData();
      formData.append('action', 'upload');
      formData.append('type', 'file');
      formData.append('content', files[0]);

      this.httpService.uploadFile('crm-settings', formData).subscribe((res) => {
        if (res.status) {
          if (type === 'main_menu_logo') {
            //this.main_menu_logo = res?.data.url; 
            const option = { name: 'main_menu_logo', value: res?.data.url }; 
            this.httpService.updateProfileOPtions(option).subscribe();
            this.isMenuLogoUploading = false;
          } else if (type === 'email_header_logo') {
            const option = { name: 'email_header_logo', value: res?.data.url };
            this.email_header_logo = res?.data.url;
            this.httpService.updateProfileOPtions(option).subscribe();
            this.isEmailLogoUploading = false;
          }

          // update data in local storage
          this.settings.updateData( type, res?.data.url );
        }
      });
    }
  }

  changeBoardSubTab(tab: string) {
    this.boardSubTab = tab;
  }

  onBoardValueChange(event: any, item: any) {
    let inputValue = event.target.value;
  }

  onBoardStatusSave() {
    this.isUserProfileFieldsUploading = true;
    const option: any = {
      name: 'board_default_statues',
      value: this.settings.boardStatusData,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.boardStatusData = res;

      // update data in local storage
      this.settings.updateData( 'board_default_statues', res );
    });
  }

  onBoardPrioritySave() {
    this.isUserProfileFieldsUploading = true;
    const option: any = {
      name: 'board_priority_statuses',
      value: this.settings.boardPriorityData,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.boardPriorityData = res;

      // update data in local storage
      this.settings.updateData( 'board_priority_statuses', res );
    });
  }

  onBoardLabelSave() {
    this.isUserProfileFieldsUploading = true;
    const option: any = {
      name: 'board_label_statuses',
      value: this.settings.boardLabelData,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.boardLabelData = res;

      // update data in local storage
      this.settings.updateData( 'board_label_statuses', res );
    });
  }

  onBoardCategorySave() {
    this.isUserProfileFieldsUploading = true;
    const option: any = {
      name: 'board_category_statuses',
      value: this.settings.boardCategoryData,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.boardCategoryData = res;

      // update data in local storage
      this.settings.updateData( 'board_category_statuses', res );
    });
  }

  onBoardDropdownSave() {
    this.isUserProfileFieldsUploading = true;
    const option: any = {
      name: 'board_dropdown_statuses',
      value: this.settings.boardDropdownData,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.boardDropdownData = res;

      // update data in local storage
      this.settings.updateData( 'board_dropdown_statuses', res );
    });
  }

  setFlag(index: number) {
    this.settings.user_profile_fields[index].is_flag = this.settings.user_profile_fields[index].is_flag === 'yes' ? 'no' : 'yes';
  }

  setIcon(index: number, icon: string) {
    this.settings.user_profile_fields[index].field_icon = icon;
  }

  addNewCustomField() {
    const newField = {
      field_icon: "fa-pencil",
      field_key: "Field Title",
      field_required: "no",
      field_title: "Edit field placeholder text",
      field_type: "text",
      is_flag: "no",
      placeholder: "Add a title",
      is_custom: "yes",
    }
    this.settings.user_profile_fields.push(newField);
  }

  removeCustomField(index: number) {
    this.settings.user_profile_fields.splice(index, 1);
  }

  onUserProfileFieldsSave() {
    this.isUserProfileFieldsUploading = true;
    const option = {
      name: 'user_profile_fields',
      value: this.settings.user_profile_fields,
    }
    this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
      this.isUserProfileFieldsUploading = false;
      this.settings.user_profile_fields = res;

      // update data in local store
      this.settings.updateData( 'user_profile_fields', res );
    });
  }

  // sort color options
  sortColorOptions( event: CdkDragDrop<{ title: string; poster: string }[]>, tab = '' ) {

    // sort array accordingly
    switch( tab ) {
      case 'status': {
        moveItemInArray(this.settings.boardStatusData, event.previousIndex, event.currentIndex);
        //this.onBoardStatusSave();
        break;
      }
      case 'priority': {
        moveItemInArray(this.settings.boardPriorityData, event.previousIndex, event.currentIndex);
        //this.onBoardPrioritySave();
        break;
      }
      case 'label': {
        moveItemInArray(this.settings.boardLabelData, event.previousIndex, event.currentIndex);
        //this.onBoardLabelSave();
        break;
      }
      case 'category': {
        moveItemInArray(this.settings.boardCategoryData, event.previousIndex, event.currentIndex);
        //this.onBoardCategorySave();
        break;
      }
      case 'dropdown': {
        moveItemInArray(this.settings.boardDropdownData, event.previousIndex, event.currentIndex);
        //this.onBoardDropdownSave();
        break;
      }
    }
    
  }

}
