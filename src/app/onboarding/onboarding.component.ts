import { Component, OnInit } from '@angular/core';
import { LocalService } from '../local.service';
import { HttpService } from '../http.service';
import { CacheService } from '../cache.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  public userMetaData: any = {};
  public tabLoading: boolean = false;
  public user: any = {};
  public countriesList: any = [ 
    {"name": "Afghanistan", "code": "AF"}, 
    {"name": "land Islands", "code": "AX"}, 
    {"name": "Albania", "code": "AL"}, 
    {"name": "Algeria", "code": "DZ"}, 
    {"name": "American Samoa", "code": "AS"}, 
    {"name": "AndorrA", "code": "AD"}, 
    {"name": "Angola", "code": "AO"}, 
    {"name": "Anguilla", "code": "AI"}, 
    {"name": "Antarctica", "code": "AQ"}, 
    {"name": "Antigua and Barbuda", "code": "AG"}, 
    {"name": "Argentina", "code": "AR"}, 
    {"name": "Armenia", "code": "AM"}, 
    {"name": "Aruba", "code": "AW"}, 
    {"name": "Australia", "code": "AU"}, 
    {"name": "Austria", "code": "AT"}, 
    {"name": "Azerbaijan", "code": "AZ"}, 
    {"name": "Bahamas", "code": "BS"}, 
    {"name": "Bahrain", "code": "BH"}, 
    {"name": "Bangladesh", "code": "BD"}, 
    {"name": "Barbados", "code": "BB"}, 
    {"name": "Belarus", "code": "BY"}, 
    {"name": "Belgium", "code": "BE"}, 
    {"name": "Belize", "code": "BZ"}, 
    {"name": "Benin", "code": "BJ"}, 
    {"name": "Bermuda", "code": "BM"}, 
    {"name": "Bhutan", "code": "BT"}, 
    {"name": "Bolivia", "code": "BO"}, 
    {"name": "Bosnia and Herzegovina", "code": "BA"}, 
    {"name": "Botswana", "code": "BW"}, 
    {"name": "Bouvet Island", "code": "BV"}, 
    {"name": "Brazil", "code": "BR"}, 
    {"name": "British Indian Ocean Territory", "code": "IO"}, 
    {"name": "Brunei Darussalam", "code": "BN"}, 
    {"name": "Bulgaria", "code": "BG"}, 
    {"name": "Burkina Faso", "code": "BF"}, 
    {"name": "Burundi", "code": "BI"}, 
    {"name": "Cambodia", "code": "KH"}, 
    {"name": "Cameroon", "code": "CM"}, 
    {"name": "Canada", "code": "CA"}, 
    {"name": "Cape Verde", "code": "CV"}, 
    {"name": "Cayman Islands", "code": "KY"}, 
    {"name": "Central African Republic", "code": "CF"}, 
    {"name": "Chad", "code": "TD"}, 
    {"name": "Chile", "code": "CL"}, 
    {"name": "China", "code": "CN"}, 
    {"name": "Christmas Island", "code": "CX"}, 
    {"name": "Cocos (Keeling) Islands", "code": "CC"}, 
    {"name": "Colombia", "code": "CO"}, 
    {"name": "Comoros", "code": "KM"}, 
    {"name": "Congo", "code": "CG"}, 
    {"name": "Congo, The Democratic Republic of the", "code": "CD"}, 
    {"name": "Cook Islands", "code": "CK"}, 
    {"name": "Costa Rica", "code": "CR"}, 
    {"name": "Cote D\"Ivoire", "code": "CI"}, 
    {"name": "Croatia", "code": "HR"}, 
    {"name": "Cuba", "code": "CU"}, 
    {"name": "Cyprus", "code": "CY"}, 
    {"name": "Czech Republic", "code": "CZ"}, 
    {"name": "Denmark", "code": "DK"}, 
    {"name": "Djibouti", "code": "DJ"}, 
    {"name": "Dominica", "code": "DM"}, 
    {"name": "Dominican Republic", "code": "DO"}, 
    {"name": "Ecuador", "code": "EC"}, 
    {"name": "Egypt", "code": "EG"}, 
    {"name": "El Salvador", "code": "SV"}, 
    {"name": "Equatorial Guinea", "code": "GQ"}, 
    {"name": "Eritrea", "code": "ER"}, 
    {"name": "Estonia", "code": "EE"}, 
    {"name": "Ethiopia", "code": "ET"}, 
    {"name": "Falkland Islands (Malvinas)", "code": "FK"}, 
    {"name": "Faroe Islands", "code": "FO"}, 
    {"name": "Fiji", "code": "FJ"}, 
    {"name": "Finland", "code": "FI"}, 
    {"name": "France", "code": "FR"}, 
    {"name": "French Guiana", "code": "GF"}, 
    {"name": "French Polynesia", "code": "PF"}, 
    {"name": "French Southern Territories", "code": "TF"}, 
    {"name": "Gabon", "code": "GA"}, 
    {"name": "Gambia", "code": "GM"}, 
    {"name": "Georgia", "code": "GE"}, 
    {"name": "Germany", "code": "DE"}, 
    {"name": "Ghana", "code": "GH"}, 
    {"name": "Gibraltar", "code": "GI"}, 
    {"name": "Greece", "code": "GR"}, 
    {"name": "Greenland", "code": "GL"}, 
    {"name": "Grenada", "code": "GD"}, 
    {"name": "Guadeloupe", "code": "GP"}, 
    {"name": "Guam", "code": "GU"}, 
    {"name": "Guatemala", "code": "GT"}, 
    {"name": "Guernsey", "code": "GG"}, 
    {"name": "Guinea", "code": "GN"}, 
    {"name": "Guinea-Bissau", "code": "GW"}, 
    {"name": "Guyana", "code": "GY"}, 
    {"name": "Haiti", "code": "HT"}, 
    {"name": "Heard Island and Mcdonald Islands", "code": "HM"}, 
    {"name": "Holy See (Vatican City State)", "code": "VA"}, 
    {"name": "Honduras", "code": "HN"}, 
    {"name": "Hong Kong", "code": "HK"}, 
    {"name": "Hungary", "code": "HU"}, 
    {"name": "Iceland", "code": "IS"}, 
    {"name": "India", "code": "IN"}, 
    {"name": "Indonesia", "code": "ID"}, 
    {"name": "Iran, Islamic Republic Of", "code": "IR"}, 
    {"name": "Iraq", "code": "IQ"}, 
    {"name": "Ireland", "code": "IE"}, 
    {"name": "Isle of Man", "code": "IM"}, 
    {"name": "Israel", "code": "IL"}, 
    {"name": "Italy", "code": "IT"}, 
    {"name": "Jamaica", "code": "JM"}, 
    {"name": "Japan", "code": "JP"}, 
    {"name": "Jersey", "code": "JE"}, 
    {"name": "Jordan", "code": "JO"}, 
    {"name": "Kazakhstan", "code": "KZ"}, 
    {"name": "Kenya", "code": "KE"}, 
    {"name": "Kiribati", "code": "KI"}, 
    {"name": "Korea, Democratic People\"S Republic of", "code": "KP"}, 
    {"name": "Korea, Republic of", "code": "KR"}, 
    {"name": "Kuwait", "code": "KW"}, 
    {"name": "Kyrgyzstan", "code": "KG"}, 
    {"name": "Lao People\"S Democratic Republic", "code": "LA"}, 
    {"name": "Latvia", "code": "LV"}, 
    {"name": "Lebanon", "code": "LB"}, 
    {"name": "Lesotho", "code": "LS"}, 
    {"name": "Liberia", "code": "LR"}, 
    {"name": "Libyan Arab Jamahiriya", "code": "LY"}, 
    {"name": "Liechtenstein", "code": "LI"}, 
    {"name": "Lithuania", "code": "LT"}, 
    {"name": "Luxembourg", "code": "LU"}, 
    {"name": "Macao", "code": "MO"}, 
    {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"}, 
    {"name": "Madagascar", "code": "MG"}, 
    {"name": "Malawi", "code": "MW"}, 
    {"name": "Malaysia", "code": "MY"}, 
    {"name": "Maldives", "code": "MV"}, 
    {"name": "Mali", "code": "ML"}, 
    {"name": "Malta", "code": "MT"}, 
    {"name": "Marshall Islands", "code": "MH"}, 
    {"name": "Martinique", "code": "MQ"}, 
    {"name": "Mauritania", "code": "MR"}, 
    {"name": "Mauritius", "code": "MU"}, 
    {"name": "Mayotte", "code": "YT"}, 
    {"name": "Mexico", "code": "MX"}, 
    {"name": "Micronesia, Federated States of", "code": "FM"}, 
    {"name": "Moldova, Republic of", "code": "MD"}, 
    {"name": "Monaco", "code": "MC"}, 
    {"name": "Mongolia", "code": "MN"}, 
    {"name": "Montenegro", "code": "ME"},
    {"name": "Montserrat", "code": "MS"},
    {"name": "Morocco", "code": "MA"}, 
    {"name": "Mozambique", "code": "MZ"}, 
    {"name": "Myanmar", "code": "MM"}, 
    {"name": "Namibia", "code": "NA"}, 
    {"name": "Nauru", "code": "NR"}, 
    {"name": "Nepal", "code": "NP"}, 
    {"name": "Netherlands", "code": "NL"}, 
    {"name": "Netherlands Antilles", "code": "AN"}, 
    {"name": "New Caledonia", "code": "NC"}, 
    {"name": "New Zealand", "code": "NZ"}, 
    {"name": "Nicaragua", "code": "NI"}, 
    {"name": "Niger", "code": "NE"}, 
    {"name": "Nigeria", "code": "NG"}, 
    {"name": "Niue", "code": "NU"}, 
    {"name": "Norfolk Island", "code": "NF"}, 
    {"name": "Northern Mariana Islands", "code": "MP"}, 
    {"name": "Norway", "code": "NO"}, 
    {"name": "Oman", "code": "OM"}, 
    {"name": "Pakistan", "code": "PK"}, 
    {"name": "Palau", "code": "PW"}, 
    {"name": "Palestinian Territory, Occupied", "code": "PS"}, 
    {"name": "Panama", "code": "PA"}, 
    {"name": "Papua New Guinea", "code": "PG"}, 
    {"name": "Paraguay", "code": "PY"}, 
    {"name": "Peru", "code": "PE"}, 
    {"name": "Philippines", "code": "PH"}, 
    {"name": "Pitcairn", "code": "PN"}, 
    {"name": "Poland", "code": "PL"}, 
    {"name": "Portugal", "code": "PT"}, 
    {"name": "Puerto Rico", "code": "PR"}, 
    {"name": "Qatar", "code": "QA"}, 
    {"name": "Reunion", "code": "RE"}, 
    {"name": "Romania", "code": "RO"}, 
    {"name": "Russian Federation", "code": "RU"}, 
    {"name": "RWANDA", "code": "RW"}, 
    {"name": "Saint Helena", "code": "SH"}, 
    {"name": "Saint Kitts and Nevis", "code": "KN"}, 
    {"name": "Saint Lucia", "code": "LC"}, 
    {"name": "Saint Pierre and Miquelon", "code": "PM"}, 
    {"name": "Saint Vincent and the Grenadines", "code": "VC"}, 
    {"name": "Samoa", "code": "WS"}, 
    {"name": "San Marino", "code": "SM"}, 
    {"name": "Sao Tome and Principe", "code": "ST"}, 
    {"name": "Saudi Arabia", "code": "SA"}, 
    {"name": "Senegal", "code": "SN"}, 
    {"name": "Serbia", "code": "RS"}, 
    {"name": "Seychelles", "code": "SC"}, 
    {"name": "Sierra Leone", "code": "SL"}, 
    {"name": "Singapore", "code": "SG"}, 
    {"name": "Slovakia", "code": "SK"}, 
    {"name": "Slovenia", "code": "SI"}, 
    {"name": "Solomon Islands", "code": "SB"}, 
    {"name": "Somalia", "code": "SO"}, 
    {"name": "South Africa", "code": "ZA"}, 
    {"name": "South Georgia and the South Sandwich Islands", "code": "GS"}, 
    {"name": "Spain", "code": "ES"}, 
    {"name": "Sri Lanka", "code": "LK"}, 
    {"name": "Sudan", "code": "SD"}, 
    {"name": "Suriname", "code": "SR"}, 
    {"name": "Svalbard and Jan Mayen", "code": "SJ"}, 
    {"name": "Swaziland", "code": "SZ"}, 
    {"name": "Sweden", "code": "SE"}, 
    {"name": "Switzerland", "code": "CH"}, 
    {"name": "Syrian Arab Republic", "code": "SY"}, 
    {"name": "Taiwan, Province of China", "code": "TW"}, 
    {"name": "Tajikistan", "code": "TJ"}, 
    {"name": "Tanzania, United Republic of", "code": "TZ"}, 
    {"name": "Thailand", "code": "TH"}, 
    {"name": "Timor-Leste", "code": "TL"}, 
    {"name": "Togo", "code": "TG"}, 
    {"name": "Tokelau", "code": "TK"}, 
    {"name": "Tonga", "code": "TO"}, 
    {"name": "Trinidad and Tobago", "code": "TT"}, 
    {"name": "Tunisia", "code": "TN"}, 
    {"name": "Turkey", "code": "TR"}, 
    {"name": "Turkmenistan", "code": "TM"}, 
    {"name": "Turks and Caicos Islands", "code": "TC"}, 
    {"name": "Tuvalu", "code": "TV"}, 
    {"name": "Uganda", "code": "UG"}, 
    {"name": "Ukraine", "code": "UA"}, 
    {"name": "United Arab Emirates", "code": "AE"}, 
    {"name": "United Kingdom", "code": "GB"}, 
    {"name": "United States", "code": "US"}, 
    {"name": "United States Minor Outlying Islands", "code": "UM"}, 
    {"name": "Uruguay", "code": "UY"}, 
    {"name": "Uzbekistan", "code": "UZ"}, 
    {"name": "Vanuatu", "code": "VU"}, 
    {"name": "Venezuela", "code": "VE"}, 
    {"name": "Viet Nam", "code": "VN"}, 
    {"name": "Virgin Islands, British", "code": "VG"}, 
    {"name": "Virgin Islands, U.S.", "code": "VI"}, 
    {"name": "Wallis and Futuna", "code": "WF"}, 
    {"name": "Western Sahara", "code": "EH"}, 
    {"name": "Yemen", "code": "YE"}, 
    {"name": "Zambia", "code": "ZM"}, 
    {"name": "Zimbabwe", "code": "ZW"} 
    ];

    // define user meta keys
    public metaKeys: any = [
      'phone',
      'website',
      'address',
      'city',
      'zip',
      'country',
      'state',
      'user_photo',
      'license_number',
      'license_expiry',
      'real_estate_license',
      'driving_license',
      'car_insurance',
    ];

    // if current logged in user is an admin this will be true
    public isAdmin: boolean = false;

    /* 
    * user id to get and set user meta data 
    */
    public userID: number = 0;

    /*  
    * this will be changed when admin user select a user
    */
    public selectedUserID: number = 0;

    // this property will contain all users
    public users: any = [];

  customEmail = false;
  emailAccountType = 'microsoft';
  payWith = 'atmos';
  isProfileComplete = true;
  constructor( public localStore: LocalService, public httpService: HttpService, private cache: CacheService ) {
    this.setData();
   }

  emailConnect(type:string = ''){
    (type == 'custom' ? this.customEmail = true : this.customEmail = false);
    this.emailAccountType = type;
  }

  paymentMethod(type:string = ''){
    this.payWith = type;
  }

  ngOnInit(): void {
  }

  // setup initial data for the page
  setData() {
    this.user = this.localStore.get( 'userData' );

    // get all users form cache service
    this.users = this.cache.getUsersCache();
    
    // set userID to current user id
    this.userID = this.user.ID;
    
    // set user meta data
    this.setupUserData();

    // check if current user is an admin
    const currentUser = this.getUserById( this.user.ID );
    if( currentUser && currentUser.user_roles?.administrator == "Admin" ) {
      this.isAdmin = true;
    }

  }

  // check if required fields filled for welcome tab
  activateWelcomeNext() {
    
    // check if any required field is missing
    if( 
      ( this.userMetaData.phone == undefined || !this.userMetaData.phone )
      || ( this.userMetaData.address == undefined || !this.userMetaData.address )
      || ( this.userMetaData.city == undefined || !this.userMetaData.city )
      || ( this.userMetaData.zip == undefined || !this.userMetaData.zip )
      || ( this.userMetaData.country == undefined || !this.userMetaData.country )
      || ( this.userMetaData.state == undefined || !this.userMetaData.state )
      ) {
        return true;
      } else {
        return false;
      }

  }

  // process welcome tab data
  saveWelcomeData() {

    // set loading on the button
    this.tabLoading = true;

    // setup user data
    const data = {
      phone: this.userMetaData.phone,
      website: this.userMetaData.website,
      address: this.userMetaData.address,
      city: this.userMetaData.city,
      zip: this.userMetaData.zip,
      country: this.userMetaData.country,
      state: this.userMetaData.state,
      user_photo: this.userMetaData.user_photo,
    }

    // update user data in the database
    this.httpService.updateUserMeta( data ).subscribe( ( res: any ) => {
      
      // update data in local store
      this.updateData();

      // remove the loader
      this.tabLoading = false;

      // move to next tab
      const nextTab = document.getElementById( 'pills-connect-tab' );
      nextTab?.click();
    } );
  }

  // check if required fields filled for license tab
  activateLicenseNext() {
    
    // check if any required field is missing
    if( 
      ( this.userMetaData.license_number == undefined || !this.userMetaData.license_number )
      || ( this.userMetaData.license_expiry == undefined || !this.userMetaData.license_expiry )
      || ( this.userMetaData.real_estate_license == undefined || !this.userMetaData.real_estate_license )
      ) {
        return true;
      } else {
        return false;
      }

  }

  // process license tab data
  saveLicenseData() {

    // set loading on the button
    this.tabLoading = true;

    // setup user data
    const data = {
      license_number: this.userMetaData.license_number,
      license_expiry: this.userMetaData.license_expiry,
      real_estate_license: this.userMetaData.real_estate_license,
    }

    // update user data in the database
    this.httpService.updateUserMeta( data ).subscribe( ( res: any ) => {
      
      // update data in local store
      this.localStore.set( 'userMetaData', this.userMetaData );

      // remove the loader
      this.tabLoading = false;

      // move to next tab
      const nextTab = document.getElementById( 'pills-banking-tab' );
      nextTab?.click();
    } );
    
  }

  // open previous tab
  previousTab( tabButton = '' ) {
    if( tabButton ) {
      const tabTrigger = document.getElementById( tabButton );
      tabTrigger?.click();
    }
  }

  // check if required fields filled for Driver's license tab
  activateDriversNext() {
    console.log(this.userMetaData);
    // check if any required field is missing
    if( 
      ( this.userMetaData.driving_license == undefined || !this.userMetaData.driving_license )
      || ( this.userMetaData.car_insurance == undefined || !this.userMetaData.car_insurance )
      ) {
        return true;
      } else {
        return false;
      }

  }

  // process driver's license tab data
  saveDriversData() {
    
    // set loading on the button
    this.tabLoading = true;

    // setup user data
    const data = {
      driving_license: this.userMetaData.driving_license,
      car_insurance: this.userMetaData.car_insurance,
    }

    // update user data in the database
    this.httpService.updateUserMeta( data ).subscribe( ( res: any ) => {
      
      // update data in local store
      this.localStore.set( 'userMetaData', this.userMetaData );

      // remove the loader
      this.tabLoading = false;

      // move to next tab
      const nextTab = document.getElementById( 'pills-telephony-tab' );
      nextTab?.click();
    } );
    
  }

  /**
  * File upload
  */
  fileUpload( input: any, metaKey = '' ) {

    // set loader
    this.tabLoading = true;

    const files = input.srcElement.files;
    if (files.length) {
        let formData: any = new FormData();
        formData.append('action', 'upload');
        formData.append('type', 'file');
        formData.append('content', files[0]);

        this.httpService.uploadFile('crm-settings', formData).subscribe(( res: any ) => {
            if (res.status) {
                this.userMetaData[ metaKey ] = res.data.url;
            }
            
            // remove loader
            this.tabLoading = false;
        });
    }
  }

  // get user data from db and setup
  setupUserData() {

    // check if data exists in local store
    const localData = this.localStore.get( 'userMetaData' );
    
    if( localData?.phone && !this.selectedUserID ) {
      this.userMetaData = localData;
    } else {

      // generate meta keys to get data
      const keys = this.metaKeys.join( ',' );
      
      this.httpService.getUserMeta( keys, this.selectedUserID ).subscribe( ( res: any ) => {
        this.userMetaData = res;
        this.localStore.set( 'userMetaData', res );
      } );
    }
    
  }

  // check if url is an image
  isImage( url = '' ) {
    return( url.match(/\.(jpeg|jpg|gif|png)$/) != null );
  }

  // check onboarding progress
  dataProgress() {
    let progress = 20;

    // check if user filled Welcome tab data
    if( !this.activateWelcomeNext() ) {
      progress += 20;
    }

    // check if user filled License tab data
    if( !this.activateLicenseNext() ) {
      progress += 20;
    }

    // check if user filled driving License tab data
    if( !this.activateDriversNext() ) {
      progress += 20;
    }

    return progress;
  }

  // get user by id
  getUserById( userID = 0 ) {

    // return empty if userID is missing
    if( userID < 1 ) {
      return {};
    }

    // filter user from all users
    const user = this.users.filter( ( userObj: any ) => {
      return userObj.ID == userID;
    } );

    // check if user found
    if( user ) {
      return user[0];
    } else {
      return {};
    }

  }

  // set user id and data for the selected user
  setUser( userID = 0 ) {
    
    // check for userID
    if( userID > 0 ) {

      // update selectedUserID property of this class
      this.selectedUserID = userID;

      // update userMetaData property with the selected user meta data
      this.setupUserData();
    }
  }

  // update user meta data in local store
  updateData() {

    // do not update data in local store if the user is selected one
    if( this.selectedUserID < 1 ) {
      this.localStore.set( 'userMetaData', this.userMetaData );
    }
  }

}
