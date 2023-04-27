import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // customization fields keys
  public keys: any = [
    'main_menu_logo',
    'email_header_logo',
    'board_default_statues',
    'board_priority_statuses',
    'board_label_statuses',
    'board_category_statuses',
    'board_dropdown_statuses',
    'user_profile_fields'
  ]

  public main_menu_logo: string = '';
  public email_header_logo: string = '';
  public boardStatusData: any = {};
  public boardPriorityData: any = {};
  public boardLabelData: any = {};
  public boardCategoryData: any = {};
  public boardDropdownData: any = {};
  public user_profile_fields: any = {};

  public defaultColors: any = [
    { name:'', color:'#FF0000' },
    { name:'', color:'#03818A' },
    { name:'', color:'#2600FF' },
    { name:'', color:'#00FF4C' },
    { name:'', color:'#00C3FF' },
    { name:'', color:'#FF009D' },
    { name:'', color:'#9E1280' },
    { name:'', color:'#666666' },
    { name:'', color:'#000000' },
    { name:'', color:'#F719EB' },
    { name:'', color:'#00B36E' },
    { name:'', color:'#BCCCA6' },
    { name:'', color:'#3A46E9' },
    { name:'', color:'#330B0B' },
    { name:'', color:'#FFC4C4' },
  ];

  constructor(
    private httpService: HttpService,
    private localStore: LocalService,
     ) { }

  // get branding data from local storage
  getBrandingData() {

    // get data from local storage
    const data = this.localStore.get( 'customizationData', false );

    // set branding data
    this.main_menu_logo = data?.main_menu_logo || './assets/img/atmos-logo-sidebar.png';
    this.email_header_logo = data?.email_header_logo || './assets/img/atmos-logo.svg';
  }

  // get boards data from local storage
  getBoardData() {

    // get data from local storage
    const data = this.localStore.get( 'customizationData', false );

    // set board data
    this.boardStatusData = data?.board_default_statues || this.defaultColors;
    this.boardPriorityData = data?.board_priority_statuses || this.defaultColors;
    this.boardLabelData = data?.board_label_statuses || this.defaultColors;
    this.boardCategoryData = data?.board_category_statuses || this.defaultColors;
    this.boardDropdownData = data?.board_dropdown_statuses || this.defaultColors;
  }

  // get user profile fields data from local storage
  getProfileFields() {

    // get data from local storage
    const data = this.localStore.get( 'customizationData', false );

    // set user profile fields data
    this.user_profile_fields = data?.user_profile_fields || '';
  }

  // get all customization data from database and store in local store
  setData() {

    // check if data is already set
    const data = this.localStore.get( 'customizationData', false );

    if( !data ) {

      // set keys for the api call
      const keys = this.keys.join( ',' );

      // get data from database
      this.httpService.getProfileOPtions( keys ).subscribe( ( res: any ) => {

        // store data in local storage
        this.localStore.set( 'customizationData', res, false );
      });
    }
  }

  // update properties after update data
  updateVars() {
    this.getBrandingData();
    this.getBoardData();
  }

  // update data in local store
  updateData( key = '', val: any = '' ) {

    // check for key
    if( key ) {

      // get stored data from local storage
      let data = this.localStore.get( 'customizationData', false );

      // update the data object
      data[ key ] = val;

      // store updated data in the local storage
      this.localStore.set( 'customizationData', data, false );

      // update the property value
      this.updateVars();
    }
  }

}
