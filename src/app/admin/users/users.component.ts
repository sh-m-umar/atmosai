import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../http.service";
import {CacheService} from "../../cache.service";
import { ModuleItemsService } from '../../module-items.service';
import { LocalService } from '../../local.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public inviteObject: any = { emails: [], products: ['crm', 'cms'], user_kind: 'member', isLoading: false, showModal: false };
  public modules: any[] = [];

  public currentUser: any = {};

  headerCollapsed = false;
  anglePos = 'down';
  users: any = [];
  activeTab: string = 'users';
  boardOwnership: any = {
    current_owner: '',
    new_owner: '',
    type: 'board',
  }
  automationOwnership: any = {
    current_owner: '',
    new_owner: '',
    type: 'automation',
  }
  assignBoardOwnershipTo: any = {
    current_owner: '',
    new_owner: '',
  }
  assignAutomationOwnershipTo: any = {
    current_owner: '',
    new_owner: '',
  }

  public showEditCategories: number = -1;
  public editUserCategories: any[] = [];
  public userCategories: any[] = [];
  public isUpdatingOwnership = false;
  public filteredUsers: Array<any> = [];
  public usersToInvite: any[] = [];
  public sendingInviteToUsers = false;
  public changeCurrentOwner: any = {};
  public changeNewOwner: any = {};
  public automationCurrentOwner: any = {};
  public automationNewOwner: any = {};
  public ownerChanged: boolean = false;

  // users filter variables
  public userTypes: any = [ 'Admin', 'Member', 'Viewer' ];
  public userStatuses: any = [ 'Active', 'Inactive' ];
  public searchTerm: any = '';
  public filterValues: any = [];

  constructor(
    public cache: CacheService,
    public httpService: HttpService,
    private moduleService: ModuleItemsService,
    private localStore: LocalService,
  ) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ngOnInit(): void {
    this.getData();

    // Get modules
    this.modules = this.moduleService.getAllModules();
  }

  getData() {
    this.getUsers();
    this.getUserCategories();

    // set current user data
    this.currentUser = this.localStore.get( 'userData' );
  }

  getUsers() {
    const users = this.cache.getUsersCache();

    if (users) {
        this.users = users;
      } else {
        this.httpService.getUsers().subscribe((res: any) => {
          this.cache.setUsersCache(res);
          this.users = res;
        });
      }
    this.resetFilteredUsers();
    console.log('users', this.users);
  }

  getUserCategories() {
    this.httpService.getUserCategories().subscribe((res: any) => {
      this.userCategories = Object.entries(res).map(([slug, name]) => {
        return {
          slug,
          name,
        }
      });
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;

    // reset users filter on tab change
    this.resetFilterValues();

    this.resetOwnerChangeData();
  }

  onDealLeadChange(text: string) {
    if(text) {
      this.filteredUsers = this.users.filter( (user: any) => {
        return user.display_name.includes(text)
        && user?.user_roles?.administrator?.toLowerCase() == "admin"
        && ( this.changeCurrentOwner?.ID != user.ID )
        && ( this.changeNewOwner?.ID != user.ID );
      });
    } else {
      this.filteredUsers = this.users.filter( (user: any) => {
        return user?.user_roles?.administrator?.toLowerCase() === "admin"
          && ( this.changeCurrentOwner?.ID != user.ID )
          && ( this.changeNewOwner?.ID != user.ID );
      });
    }
  }

  onUserSelect(user: any, ownershipType: string, userType: string) {
    if(ownershipType === 'board') {
      this.boardOwnership[userType] = user.ID;
      if( userType == 'current_owner' ) {
        this.changeCurrentOwner = user;
      } else {
        this.changeNewOwner = user;
      }
    } else if(ownershipType === 'automation') {
      this.automationOwnership[userType] = user.ID;
      if( userType == 'current_owner' ) {
        this.changeCurrentOwner = user;
      } else {
        this.changeNewOwner = user;
      }
    }
    this.resetFilteredUsers();
  }

  resetFilteredUsers() {
    this.filteredUsers = this.users?.filter( (user: any) => {
      return user?.user_roles?.administrator?.toLowerCase() === "admin"
        && ( this.changeCurrentOwner?.ID != user.ID )
        && ( this.changeNewOwner?.ID != user.ID );
    });
  }

  updateOwnership(type: string) {
    this.isUpdatingOwnership = true;
    const data = type === 'board'? this.boardOwnership : type === 'automation'? this.automationOwnership: {};
    this.httpService.updateOwnership(data).subscribe( () => { this.isUpdatingOwnership = false; this.ownerChanged = true; });
  }

  addAllUserToInviteList(event: any) {
    if(event.target.checked) {
      this.usersToInvite = this.users.map((user: any) => { return user.user_email});
    } else {
      this.usersToInvite = [];
    }
  }

  addUserToInviteList(event: any, user: any) {
    if(event.target.checked) {
      this.usersToInvite.push(user.user_email);
    } else {
      const index = this.usersToInvite.indexOf(user.user_email);
      this.usersToInvite.splice(index, 1);
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

  // change user status
  changeUserRole( event: any, userID: number ) {
    const status = event.target.value;
    const user = this.getUserById( userID );

    // prepare api parameters
    let data: any = {
      action: 'change_role',
      user_ids: user.ID,
    }

    // change user role accordingly
    switch( status ) {
      case 'Admin': {
          this.users[ user.indexNumber ].user_roles = { 'administrator': status };
          data.role = 'administrator';
        break;
      }
      case 'Member': {
          this.users[ user.indexNumber ].user_roles = { 'atmos_member': status };
          data.role = 'atmos_member';
        break;
      }
      case 'Viewer': {
          this.users[ user.indexNumber ].user_roles = { 'atmos_viewer': status };
          data.role = 'atmos_viewer';
        break;
      }
    }

    // update user role in the database
    this.httpService.userBulkAction( data ).subscribe( ( res: any ) => {

      // update users in local store
      this.cache.setUsersCache( this.users );
    } );

  }

  // change user status active/inactive
  changeUserStatus( userID: number ) {

    // current user can not deactivate own account
    if( userID == this.currentUser.ID ) {
      return;
    }

    const user = this.getUserById( userID );

    // prepare api parameters
    let data: any = {
      user_ids: user.ID,
    }

    // change user status in users array
    if( user.status == 'active' ) {
      this.users[ user.indexNumber ].status = 'inactive';
      data.action = 'deactivate';
    } else {
      this.users[ user.indexNumber ].status = 'active';
      data.action = 'activate';
    }

    // update user status in the database
    this.httpService.userBulkAction( data ).subscribe( ( res: any ) => {

      // update users in local store
      this.cache.setUsersCache( this.users );
    } );
  }

  // delete user details
  deleteUserDetail( userID: number ) {
    const user = this.getUserById( userID );

    // prepare api parameters
    const data: any = {
      action: 'delete_details',
      user_ids: user.ID,
    }

    delete this.users[ user.indexNumber ];

    // re-index users
    this.users = this.users.filter( ( user: any ) => user );

    // delete user details from the database
    this.httpService.userBulkAction( data ).subscribe( ( res: any ) => {

      // update users in local store
      this.cache.setUsersCache( this.users );
    } );
  }

  // reset user two factor authentication
  resetTwoFactorAuth( userID: number ) {
    const user = this.getUserById( userID );

    // prepare api parameters
    const data: any = {
      action: 'reset_two_factor',
      user_ids: user.ID,
    }

    // reset two factor authentication in the database
    this.httpService.userBulkAction( data ).subscribe( ( res: any ) => {

      // notify admin about the success
      alert( 'Two factor authentication has been reset for ' + user.display_name );
    } );

  }

  // get user by id
  getUserById( userID: number ) {
    const foundUser = this.users.filter( ( user: any, index: any ) => {
      if( user.ID == userID ) {

        // store user row index in the user object
        user.indexNumber = index;
        return user;
      }
      return false;
    } );

    return foundUser[0];
  }

  // get module icon by module key
  getModuleIcon( moduleKey = '' ) {

    // check if moduleKey present
    if( moduleKey ) {
      const module = this.modules.filter( ( moduleObj: any ) => {
        if( moduleObj.module == moduleKey ) {
          return true;
        }
        return false;
      } );

      // check if module exists
      if( module.length > 0 ) {
        return module[0].icon;
      }

      // return false if module not found
      return false;
    }
  }

  // change filter values
  updateFilterValues( type = '', value = '' ) {

    // lowercase value to fix case sensitive issue
    value = value.toLowerCase();

    // if filter type is not defined make it array
    if( this.filterValues[ type ] == undefined ) {
      this.filterValues[ type ] = [];
    }

    // update filter values array
    const index = this.filterValues[ type ].indexOf( value );

    // remove value from array if already exists
    if (index > -1) {
      this.filterValues[ type ].splice( index, 1 );
    } else {

      // add value if not exists in the array
      this.filterValues[ type ].push( value );
    }

    // filter is prepared now filter users
    this.filterUsers();
  }

  // users filter functionality
  filterUsers() {
    const users = this.cache.getUsersCache();

    // filter out users
    this.users = users.filter( ( user: any ) => {

      let userMatch = true;

      // user type filter
      if( this.filterValues[ 'type' ] != undefined && this.filterValues[ 'type' ].length ) {
        if( !this.userTypeMatch( user.user_roles ) ) {
          userMatch = false;
        }
      }

      // user status filter
      if( this.filterValues[ 'status' ] != undefined && this.filterValues[ 'status' ].length ) {
        if( !this.userStatusMatch( user.status ) ) {
          userMatch = false;
        }
      }

      // filter users by modules
      if( this.filterValues[ 'modules' ] != undefined && this.filterValues[ 'modules' ].length ) {
        if( !this.userModuleMatch( user.activated_products ) ) {
          userMatch = false;
        }
      }

      // filter users by search term
      if( this.searchTerm ) {
        if( !this.userSearchMatch( user ) ) {
          userMatch = false;
        }
      }

      return userMatch;
    } );
  }

  // match user type in the filter data
  userTypeMatch( roles: any ) {

    let match = false;
    for( let key in roles ) {

      // check if role exists in the filter
      if( this.filterValues[ 'type' ].includes( roles[ key ].toLowerCase() ) ) {
        match = true;
      }
    }

    return match;
  }

  // match user status in the filter data
  userStatusMatch( status: any ) {
    return this.filterValues[ 'status' ].includes( status.toLowerCase() );
  }

  // match user activated products in the filter data
  userModuleMatch( userProducts: any ) {

    // check if user don't have product activated
    if( userProducts.length < 1 ) {
      return false;
    }

    let match = false;

    // loop the user activated products
    userProducts.forEach( ( module: any ) => {
      if( this.filterValues[ 'modules' ].includes( module.toLowerCase() ) ) {
        match = true;
      }
    } );

    return match;
  }

  // match user name and email address with search term
  userSearchMatch( user: any ) {
    const searchTerm = this.searchTerm.toLowerCase();

    // match display name, full name, first name, last name, and email address with the search term
    if(
      user.display_name.toLowerCase().indexOf( searchTerm ) > -1
      || user.full_name.toLowerCase().indexOf( searchTerm ) > -1
      || user.fname.toLowerCase().indexOf( searchTerm ) > -1
      || user.lname.toLowerCase().indexOf( searchTerm ) > -1
      || user.user_email.toLowerCase().indexOf( searchTerm ) > -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  // reset users filter
  resetFilterValues() {
    this.filterValues = [];

    // reset search term as well
    this.searchTerm = '';

    // update users table data
    this.filterUsers();
  }

  // reset variable for owner change
  resetOwnerChangeData() {

    // set filtered users to all admin users
    this.filteredUsers = this.users.filter( ( user: any ) => {
      return user?.user_roles?.administrator?.toLowerCase() === "admin";
    });

    this.changeCurrentOwner = {};
    this.changeNewOwner = {};
    this.boardOwnership = {
      current_owner: '',
      new_owner: '',
      type: 'board',
    };
    this.assignBoardOwnershipTo = {
      current_owner: '',
      new_owner: '',
    };
    this.ownerChanged = false;
    this.assignAutomationOwnershipTo = {
      current_owner: '',
      new_owner: '',
    };
  }

  async addUpdateUserCategories(name: string) {
    const category = {
      name,
      slug: name?.split(' ').join('-'),
    }

    const addUpdateUserCategories$ = this.httpService.addUpdateUserCategories(category);
    const res = await lastValueFrom(addUpdateUserCategories$);
    this.userCategories = Object.entries(res).map(([slug, name]) => {
      return {
        slug,
        name,
      }
    });
  }

  setEditCategories(user: any, index: number) {
    this.editUserCategories = [];
    this.showEditCategories = index;
    user?.categories?.forEach((cat: any) => {
      this.editUserCategories.push({
        name: cat?.split('-').join(' '),
        slug: cat,
        display: cat?.split('-').join(' '),
        value: cat,
      });
    });
  }

  async saveUserCategories(user: any, index: number) {
    for await (const cat of this.editUserCategories) {
      if(!cat.slug) {
        await this.addUpdateUserCategories(cat.value);
      }
    };

    let data: any =[];

    this.users[index].categories = [];
    this.editUserCategories.forEach((cat: any) => {
      if(!cat.slug) {
        cat.slug = cat.name?.split(' ').join('-');
      }
      this.users?.[index].categories.push(cat.slug);
      data.push(cat.slug);
    });

    data = data.join(',');

    this.assignUserCategory(data, user);

    this.showEditCategories = -1;
  }

  cancelUserCategories() {
    this.showEditCategories = -1;
    this.editUserCategories = [];
  }

  assignUserCategory(slugs: any, user: any) {
    let option = {
      action: 'assign-category',
      user_ids: user.ID,
      slugs,
    }

    this.httpService.userBulkAction(option).subscribe(() => {
      this.cache.setUsersCache(this.users);
    });
  }

}
