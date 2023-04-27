import { Component } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {HttpService} from "../../http.service";
import {CacheService} from "../../cache.service";
import {LocalService} from "../../local.service";
import { thisWeek } from '@igniteui/material-icons-extended';

@Component({
  selector: 'app-edit-email-sequence',
  templateUrl: './edit-email-sequence.component.html',
  styleUrls: ['./edit-email-sequence.component.scss']
})
export class EditEmailSequenceComponent {

  headerCollapsed = false;
    assignScoring = 2;
    anglePos = 'down';
    isNameEdit = false;
    isTopicEdit = false;
    isSubjectEdit = false;
    isSenderEdit = false;
    isReReply = false;
    isRecipientEdit = false;
    advandedOptions = false;
    showList = false;
    showBroadcast = false;
    showSequence = false;
    showifList = false;
    showifSequence = false;
    showClearView: boolean = false;
    showPreview = false;
    showSegments = false;
    configureResponse = false;
    responseRowAdded = false;
    recipientType = '';
    templateType = '';
    boardID: number = 37;
    boardData: any;
    groupID: number = 0;
    entryID: number = 0;
    isProcessing: boolean = false;
    currentTab: number = 1;
    clearViews: any = [];
    segmentsBoard: any;
    segmentBoardId: number = 38;
    hasSegment: boolean = false;
    pageLoading = true;
    errorMessage: string = '';
    editEntry: any = {};
    showEmailContent: boolean = false;
    previewKey: number = 0;

    public emailRow: any = {
      title: '',
      topic: '',
      subject: '',
      preheader: '',
      sender: '',
      reply_tracking: '',
      reply_to: '',
      recipients: '',
      content: '',
      start_date: '',
      end_date: '',
      timezone: '-5'
    };
  acc = false;
  bcc = false;
  emailSequence = false;
  sendLater = false;
  connectedAccounts: any = {};
  emailSettings: any = {};
  shortcode: string = '';
  activeEmailTab: number = 0;
  public shortcodes = [
    'first_name',
    'full_name',
    'company_name',
    'phone_number',
    'email',
    'company_email',
    'company_url',
    'user_email',
    'user_full_name',
    'user_first_name',
    'user_company_name',
    'user_company_url',
];
  
  // email template editor
  contentData: any = [
    {
      startFrom: 'immediately',
      sendAs: 'global',
      subject: '',
      emailType: 'text',
      emailTemplate: '',
      templateLoadingTxt: '',
      emailContent: '',
      delay: 1
    }
  ];

  emptyContentRow: any = {
    startFrom: 'immediately',
    sendAs: 'global',
    subject: '',
    emailType: 'text',
    emailTemplate: '',
    templateLoadingTxt: '',
    emailContent: '',
    delay: 1
  };

  constructor(
      private router: Router,
      private http: HttpService,
      private cache: CacheService,
      private localStore: LocalService,
      private activatedRoute: ActivatedRoute) {

    // set board data
    this.boardData = this.cache.getBoardCache( this.boardID );

    // if board cache doesn't exists then get form the database
    if( !this.boardData ) {
      this.http.getSingleBoard( this.boardID ).subscribe( ( data: any ) => {
        this.boardData = data;

        // set group ID to first group
        this.groupID = this.boardData.groups[0].id;

        // add board cache in the local store
        this.cache.setBoardCache( this.boardID, data );            
      });
    } else {

      // set group ID to first group
      this.groupID = this.boardData.groups[0].id;
    }
  }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ccShowHide() {
    this.acc = !this.acc;
  }

  bccShowHide() {
    this.bcc = !this.bcc;
  }

  onEmailActionChange(event:any){
    if(event.target.value == "email_sequence"){
      this.emailSequence = true;
    }else{
      this.emailSequence = false;
    }
  }

  increment(){
    this.assignScoring -= 1;
  }
  decrement(){
    this.assignScoring += 1;
  }

  selectTemplateType(type:string = ''){
    this.templateType = type;
  }

  ngOnInit(): void {

    // set data for the page
    this.setData();
  }

  // set data
  setData() {

    // set clear views
    this.getFilterViews();

    // get segment board data
    this.getSegmentBoard();

    // check if edit entry request
    this.checkForEdit();

    // set connected accounts
    this.setConnectedAccounts();
  }

  // check if page is in edit mode
  checkForEdit() {
    this.activatedRoute.queryParams.subscribe( ( params: any ) => {
        if( params.id != undefined && params.id > 0 ) {
          
          // get the entry from database
          this.http.getSingleEntry( params.id, false, true ).subscribe( ( entryData: any ) => {
            
            // check if entry not found
            if( !entryData || entryData.item == undefined || !entryData.item ) {

              // set error message
              this.errorMessage = "Campaign id is invalid.";
              
              // remove the loader
              this.pageLoading = false;

            } else {
              this.editEntry = entryData;

              // set entryID
              this.entryID = this.editEntry.id;

              // map the emailRow data
              this.mapEmailRow();

              // remove the loader
              this.pageLoading = false;
            }
          } );
        } else {

          // if not in edit mode then remove page loader
          this.pageLoading = false;
        }
    });
  }

  // map edit entry data with emailRow
  mapEmailRow() {

    // map the data
    for( let key in this.emailRow ) {
      
      // check if key exists on the edit entry object
      if( this.editEntry[ key ] != undefined ) {
        this.emailRow[ key ] = this.editEntry[ key ];
      }

      // title key is item in the editEntry object so map it manually ;)
      this.emailRow.title = this.editEntry.item;

      // map email content data
      this.contentData = JSON.parse( this.editEntry.sequence_steps );
    }
  }

  // get segment board data from local store or database
  getSegmentBoard() {

    // set board data
    this.segmentsBoard = this.cache.getBoardCache( this.segmentBoardId );

    // if board cache doesn't exists then get form the database
    if( !this.segmentsBoard ) {
      this.http.getSingleBoard( this.segmentBoardId ).subscribe( ( data: any ) => {
        this.segmentsBoard = data;

        // add board cache in the local store
        this.cache.setBoardCache( this.segmentBoardId, data );
        
        // check segment entries availability 
        this.isSegmentAvailable();
      });
    } else {
      
      // check segment entries availability 
      this.isSegmentAvailable();
    }
  }

  useTemplate(id = '', type = 'custom'){
    this.router.navigate(['/page-builder'], {queryParams: {template_id: id, type: type, entry_id: 48, ref: 'campaigns/email?type=broadcast'}});
  }

  /**
   * Get sub board column status options
   *
   * @param columns
   * @param key
   * @param from
   */
  getSubBoardColumnStatus(columns: any, key = 'stage', from = 'statuses') {
    let options = [];

    // find column with key
    let column = columns.find((column: any) => column?.key === key || column?.field === key);

    switch (from) {
      case 'statuses':
        options = column[from] !== undefined ? column[from] : column.cellRendererParams[from];
        break;
      case 'settings':
        try {
          options = column[from] !== undefined ? JSON.parse(column[from]) : JSON.parse(column.cellRendererParams[from]);
        } catch (e) {
        }
    }

    return options;
  }

  // check if step is completed
  isStepCompleted( number: number ) {

    let completed = false;

    switch( number ) {
      case 1: {

        // check for step 1 required fields also check for entry id
        if( this.emailRow.title  && this.entryID ) {
          completed = true;
        }
        break;
      }
      case 2: {

        // check for step 2 required fields
        if( this.emailRow.title  && this.entryID ) {
          completed = true;
        }
        break;
      }
      case 3: {
        if( this.emailRow.title  && this.entryID ) {
          completed = true;
        }
        break;
      }
      case 4: {
        if( this.emailRow.title  && this.entryID ) {
          completed = true;
        }
        break;
      }
      case 5: {
        if( this.emailRow.title  && this.entryID ) {
          completed = true;
        }
        break;
      }
    }

    // return boolean
    return completed;
  }

  // check for progress
  progress() {
      
    // set progress to 0
    let progress = 0;
    
    // check if entry not created
    if( !this.entryID ) {
      //return 0;
    }

    return this.currentTab * 20;

    // check for steps
    if( this.isStepCompleted( 1 ) ) {
      progress += 20;
    }
    if( this.isStepCompleted( 2 ) ) {
      progress += 20;
    }
    if( this.isStepCompleted( 3 ) ) {
      progress += 20;
    }
    if( this.isStepCompleted( 4 ) ) {
      progress += 20;
    }
    if( this.isStepCompleted( 5 ) ) {
      progress += 20;
    }

    // return the progress percentage
    return progress;
  }

  // create campaign and store ID on emailRow object
  createCampaign() {

    // check for title and also check entry is not created already
    if( this.emailRow.title && !this.entryID ) {
      this.emailRow.board_id = this.boardID;
      this.emailRow.group_id = this.groupID;
      this.emailRow.parent_id = 0;

      // data is ready create the entry
      this.createEntry( this.emailRow );
    }

    // if entry id exists update the entry and move to step 2
    if( this.emailRow.title && this.entryID ) {

      // update the campaign and move to second tab
      this.updateCampaign( 2 );
    }
  }

  // create entry
  createEntry( data: any ) {

    // set loading
    this.isProcessing = true;

    this.http.addNewRow( data ).subscribe( ( data: any ) => {

      // Set row id to this newly created row
      if( data.id !== undefined ) {
        if( this.boardData.groups[ 0 ].entries == undefined || !this.boardData.groups[ 0 ].entries ) {
          this.boardData.groups[ 0 ].entries = [];
        }
        this.boardData.groups[ 0 ].entries.push( data );

        // update entryID object with newly created entry
        this.entryID = data.id;

        // update local store with new board data
        this.cache.setBoardCache( this.boardID, this.boardData );

        // remove loader
        this.isProcessing = false;

        // move to second tab
        this.currentTab = 2;
      }
    });
  }

  // change tab on click
  changeTab( number: number ) {

    // check if tab is active
    if( number > 1 ) {
      if( this.isStepCompleted( number -1 ) ) {
        this.currentTab = number;
      }
    } else {
      this.currentTab = number;
    }
  }

  // update the campaign and move to next tab
  updateCampaign( next: number, message = false ) {

    // set loading
    this.isProcessing = true;

    // add email content before update
    this.emailRow.sequence_steps = JSON.stringify( this.contentData );

    // check for campaign ID && validate data
    if( this.entryID && this.isStepCompleted( next -1 ) ) {

      // set entry id
      this.emailRow.entry_id = this.entryID;

      this.http.updateRow( this.emailRow ).subscribe( ( res: any ) => {
        console.log( 'Campaign updated:', res );

        // alert on last step
        if( message ) {
          alert( 'Sequence saved successfully.' );
        }

        // remove loader
        this.isProcessing = false;
      } );

      // move to next tab
      this.currentTab = next;
    }
  }

  // get sender email address and name @email = false will send sender name
  getSender( email: boolean ) {
      
    // check if sender details available
    if( this.emailRow.sender ) {
      const data = this.emailRow.sender.split( ',' );

      if( email ) {
        return data[ 0 ];
      } else {

        // check if sender name exists
        if( data.length > 1 ) {
          return data[ 1 ];
        } else {
          return '';
        }
      }
    }

    // return empty if information not available
    return '';
  }

  // set sender email address and name
  setSender( event: any, email: boolean ) {

    // get sender data
    const sender = this.emailRow.sender.split( ',' );

    // update sender email address
    if( email && this.validateEmail( event.target.value ) ) {

      if( sender.length > 1 ) {
        this.emailRow.sender = event.target.value + ',' + sender[ 1 ];
      } else {
        this.emailRow.sender = event.target.value
      }
    }

    // update sender name
    if( !email ) {
      this.emailRow.sender = sender[ 0 ] + ',' + event.target.value;
    }
  }

  // validate email address
  validateEmail(email: string) {
    if (email === undefined) return '';

      return email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  // get clear views
  getFilterViews() {
    const query = '';

    // First check if already available in cache
    const local = this.localStore.get( 'filterViews' );
    if ( local.length ) {
      this.clearViews = JSON.parse( local );
    } else {
        this.http.getFilterView( query ).subscribe( ( res: any ) => {
            this.clearViews = res;

            // update clear views in local store
            this.localStore.set( 'filterViews', JSON.stringify( this.clearViews ) );
        });
    }
  }

  // select view
  selectView( event: any, id: number ) {
    const isChecked = event.target.checked;

    // if checked then add to selected views
    if( isChecked ) {
      this.addToView( id );
    } else {
      this.removeView( id );
    }
  }

  // check if view is selected
  isViewSelected( id: number ) {
    let recipients: any = {};

    // check if recipients available
    if( !this.emailRow.recipients ) {
      return false;
    }

    recipients = JSON.parse( this.emailRow.recipients );

    // check if clear_views available
    if( recipients.clear_views == undefined || !recipients.clear_views.length ) {
      return false;
    }

    // check if clear view selected
    return recipients.clear_views.includes( id );
  }

  // add view to selected views
  addToView( id: number ) {
    let recipients: any = {};

    if( this.emailRow.recipients ) {
      recipients = JSON.parse( this.emailRow.recipients );

      // if clear views doesn't exists make it an empty array
      if( !recipients.clear_views ) {
        recipients.clear_views = [];
      }

      recipients.clear_views.push( id );

      this.emailRow.recipients = JSON.stringify( recipients );
    } else {
      recipients.clear_views = [];
      recipients.clear_views.push( id );
      
      this.emailRow.recipients = JSON.stringify( recipients );
    }
  }

  // remove view from recipients
  removeView( id: any ) {
    let recipients: any = {};

    // check if recipients exists
    if( this.emailRow.recipients ) {
      recipients = JSON.parse( this.emailRow.recipients );
      
      // check if views exists on recipients key
      if( recipients.clear_views ) {

        // removes view from the clear_views key
        recipients.clear_views = recipients.clear_views.filter( ( viewId: any ) => { return viewId != id } );

        this.emailRow.recipients = JSON.stringify( recipients );
      }
    }
  }

  // check if no segment available
  isSegmentAvailable() {
    
    // check if board data available
    if( this.segmentsBoard ) {
      
      // loop through the groups
      for( let i = 0; i < this.segmentsBoard.groups.length; i++ ) {
        if( this.segmentsBoard.groups[ i ].entries.length ) {
          this.hasSegment = true;
        }
      }
    }
  }

  // check if segment is selected
  isSegmentSelected( id: number ) {
    let recipients: any = {};

    // check if recipients available
    if( !this.emailRow.recipients ) {
      return false;
    }

    recipients = JSON.parse( this.emailRow.recipients );

    // check if segments available
    if( recipients.segments == undefined || !recipients.segments.length ) {
      return false;
    }

    // check if segment is selected
    return recipients.segments.includes( id );
  }

  // on select segment
  selectSegment( event: any, id: number ) {
    const isChecked = event.target.checked;

    // if checked then add to selected segments
    if( isChecked ) {
      this.addToSegments( id );
    } else {
      this.removeSegment( id );
    }
  }

  // add segment to the selected segments
  addToSegments( id: number ) {
    let recipients: any = {};

    if( this.emailRow.recipients ) {
      recipients = JSON.parse( this.emailRow.recipients );

      // if segments doesn't exists make it an empty array
      if( !recipients.segments ) {
        recipients.segments = [];
      }

      recipients.segments.push( id );

      this.emailRow.recipients = JSON.stringify( recipients );
    } else {
      recipients.segments = [];
      recipients.segments.push( id );
      
      this.emailRow.recipients = JSON.stringify( recipients );
    }
  }

  // remove segment from the selected segments
  removeSegment( id: number ) {
    let recipients: any = {};

    // check if recipients exists
    if( this.emailRow.recipients ) {
      recipients = JSON.parse( this.emailRow.recipients );
      
      // check if segments exists on recipients key
      if( recipients.segments ) {

        // removes segment from the segments key
        recipients.segments = recipients.segments.filter( ( segmentId: any ) => { return segmentId != id } );

        this.emailRow.recipients = JSON.stringify( recipients );
      }
    }
  }

  // set connected accounts
  setConnectedAccounts() {
    const localSettings = this.localStore.get( 'emailSettings' );
    if( localSettings ) {
      this.connectedAccounts = localSettings.connected_accounts;
      this.emailSettings = localSettings;
    } else {
        this.http.getCrmSettings().subscribe( ( res: any ) => {
          this.connectedAccounts = res.connected_accounts;
          this.emailSettings = res;

          // save response in local store
          this.localStore.set( 'emailSettings', res, false );
        });
    }
  }

  /**
     * Select email template to load in editor
     */
  selectEmailTemplate( key = 0 ) {
    this.contentData[key].templateLoadingTxt = 'Loading template...';
    const local = this.localStore.get(`emailTemplate_${this.contentData[key].emailType}_${this.contentData[key].emailTemplate}`);

    // Check if already available in local storage
    if (local) {
        this.contentData[key].subject = local.subject;
        this.contentData[key].emailContent = local.body;
        this.attachEmailSignature( key );
        this.contentData[key].templateLoadingTxt = '';
    } else {
        // Get it from server
        const args = `email_template&type=${this.contentData[key].emailType}&id=${this.contentData[key].emailTemplate}`;
        this.http.getCrmSettings(args).subscribe((res: any) => {
            this.contentData[key].subject = res.subject;
            this.contentData[key].emailContent = res.body;
            this.attachEmailSignature( key );
            this.localStore.set(`emailTemplate_${this.contentData[key].emailType}_${this.contentData[key].emailTemplate}`, res);
            this.contentData[key].templateLoadingTxt = '';
        });
    }
  }

  /**
     * Attach email signature
     */
  attachEmailSignature( key = 0 ) {
    if( this.emailSettings.email_signature ) {
        this.contentData[key].emailContent += '<br /><div style="margin-top:50px;">' + this.emailSettings.email_signature + '</div>';
    }
  }

  getEmailTemplateList( templates = [], key = 0 ) {
    if (templates === undefined || this.contentData[key].emailType === undefined || this.contentData[key].emailType === '') {
        return [];
    }

    // filter email templates by type
    return <any>templates.filter((template: any) => {
        return template.type === this.contentData[key].emailType;
    });
  }

  /**
     * Select shortcode from dropdown and
     * Copy to clipboard
     */
  selectShortcode() {
    if (this.shortcode === '') {
        return;
    }

    // copy string to clipboard
    navigator.clipboard.writeText(this.shortcode).then(() => {
        this.shortcode = '';
        alert('Copied to clipboard');
    });
  }

  // trigger email media buttons
  triggerMedia( type: any ) {

    // select the more options button
    const clickMore: any = document.querySelector("[title='More...'");

    switch ( type ) {

        // click preview button for email body
        case 'preview':
            let clickPreview: any = document.querySelector("[title='Preview']");
            if( !clickPreview ) {
                clickMore.click();
                setTimeout( () =>{
                    clickPreview = document.querySelector("[title='Preview']");
                    clickPreview?.click();
                    clickMore?.click();
                }, 10 );
            } else {
                clickPreview?.click();
            }
        break;

        case 'image':
            let clickImage: any = document.querySelector("[title='Insert/edit image']");
            if( !clickImage ) {
                clickMore.click();
                setTimeout( () =>{
                    clickImage = document.querySelector("[title='Insert/edit image']");
                    clickImage?.click();
                    clickMore?.click();
                }, 10 );
            } else {
                clickImage?.click();
            }
        break;

        case 'media':
            let clickMedia: any = document.querySelector("[title='Insert/edit media']");
            if( !clickMedia ) {
                clickMore.click();
                setTimeout( () =>{
                    clickMedia = document.querySelector("[title='Insert/edit media']");
                    clickMedia?.click();
                    clickMore?.click();
                }, 10 );
            } else {
                clickMedia?.click();
            }
        break;
    }
  }

  // get number of days when email will be sent
  getNumberOfDays( key = 0 ) {
    let days = 0;
    for( let i = 0; i <= key; i++ ) {
      days += parseInt( this.contentData[i].delay );
    }
    return days;
  }

  // remove email content row
  removeContent( key = 0 ) {
    
    // don't delete all the rows
    if( this.contentData.length > 1 ) {
      this.contentData = this.contentData.filter( ( row: any, index: any ) => { return index != key } );
    }
  }

  // add new now in email content data
  addEmailContent() {

    // update subject with the global one
    if( this.emailRow.subject ) {
      this.emptyContentRow.subject = this.emailRow.subject;
    }

    // update sender with the global one
    if( this.getSender( true ) ) {
      this.emptyContentRow.sendAs = this.getSender( true );
    } 

    this.contentData.push( this.emptyContentRow );
    
    // update current editing tab
    this.changeEmailTab( ( this.contentData.length - 1 ) );
  }

  // collapse and expand email content editor
  changeEmailTab( key = 0 ) {

    // check if current tab then collapse the current open tab
    if( key == this.activeEmailTab ) {
      this.activeEmailTab = 999;
    } else {
      this.activeEmailTab = key;
    }
  }

  // check if string is a number
  is_numeric( str: any ) {
    return !isNaN( str );
  }

  // html entities decode for preview
  previewBody() {
    var txt = document.createElement("textarea");
    txt.innerHTML = this.contentData[ this.previewKey ].emailContent;
    return txt.value;
  }

  // preview previous email
  previewPrevious() {
    this.previewKey -= 1;
  }

  // preview next email
  previewNext() {
    this.previewKey += 1;
  }

  // reset preview key on click of finish button
  resetPreview() {
    setTimeout(() => {
      this.previewKey = 0;
    }, 200);
  }

}
