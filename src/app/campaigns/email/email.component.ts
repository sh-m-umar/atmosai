import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService } from '../../local.service';
import { HttpService } from '../../http.service';
import { CacheService } from '../../cache.service';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})

export class EmailComponent implements OnInit {

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
    boardID: number = 36;
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
    timezone: string = '';
    start: string = '';

    parentScoring = 'opens-by-country';
    parentScoringType = 'country';
    countryList = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    addRow = false;
    
    public emailRow: any = {
      title: '',
      topic: '',
      subject: '',
      preheader: '',
      sender: '',
      reply_tracking: '',
      reply_to: '',
      recipients: '',
      content: ''
    };

    acc = false;
    bcc = false;
    emailSequence = false;
    sendLater = false;

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

    selectParentScoring(){
      if(this.parentScoring == 'opens-by-country' || this.parentScoring == 'clicks-by-country'){
        this.parentScoringType = 'country';
      }
      if(this.parentScoring == 'campaign-forwarded'){
        this.parentScoringType = 'bool';
      }
      if(this.parentScoring == 'opens-by-time' || this.parentScoring == 'clickes-by-time' || this.parentScoring == 'forwards-by-time'){
        this.parentScoringType = 'time';
      }
      if(this.parentScoring == 'opens-count' || this.parentScoring == 'clicks-count' || this.parentScoring == 'comments-count'){
        this.parentScoringType = 'count';
      }
      console.log(this.parentScoringType);
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
        this.router.navigate(['/page-builder'], {queryParams: {template_id: id, type: type, entry_id: this.entryID, ref: 'campaigns/email?type=broadcast&id=' + this.entryID}});
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
          if( this.emailRow.subject && this.emailRow.preheader ) {
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
    updateCampaign( next: number ) {

      // check for campaign ID && validate data
      if( this.entryID && this.isStepCompleted( next -1 ) ) {

        // set entry id
        this.emailRow.entry_id = this.entryID;

        this.http.updateRow( this.emailRow ).subscribe( ( res: any ) => {
          console.log( 'Campaign updated:', res );
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

    // set email content
    setEmailContent( event: any, key = '' ) {

    }

}
