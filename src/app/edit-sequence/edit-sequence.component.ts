import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-edit-sequence',
  templateUrl: './edit-sequence.component.html',
  styleUrls: ['./edit-sequence.component.scss']
})
export class EditSequenceComponent implements OnInit {
  @Input() data: any;
  headerCollapsed = false;
  anglePos = 'down';
  isTrigger = '';
  isSrarch = false;
  isNewSequence = false;
  templateLoadingTxt = '';
  public user = this.localStore.get('userData');
  public emailData = {
    id: 0,
    activityId: 0,
    fromConfig: '',
    to: '',
    sender: 'global',
    toCc: '',
    toBcc: '',
    subject: '',
    templateType: '',
    template: '',
    content: '',
    file: '',
    ifNoReply: '',
    noReplyDate: '',
    remindMeFollowup: '',
    reminder: 0,
    reminderDate: '',
    reminderType: '',
    sequence: '',
    schedule: '',
    scheduleTime: '',
    scheduleTimezone: '',
    sendLater: false
  };
  public defaultEmailData = {...this.emailData};
  public emailSettings: any = false;
  public showLoadSetting = false;
  public showLoadSettingBtnTxt = 'Reload connected accounts';
  public acc = false;
  public bcc = false;
  public shortcode = '';
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
  public newActivityType: string = '';

  constructor(private localStore: LocalService, private httpService: HttpService,) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  useSequenceType(type:string){
    this.isTrigger = type;
  }

  ccShowHide() {
    this.acc = !this.acc;
  }

  bccShowHide() {
      this.bcc = !this.bcc;
  }

  /**
     * Select shortcode from dropdown and
     * Copy to clipboard
     */
   selectShortcode(){
    if (this.shortcode === '') {
        return;
    }

    // copy string to clipboard
    navigator.clipboard.writeText(this.shortcode).then(() => {
        this.shortcode = '';
        alert('Copied to clipboard');
    });
  }

  /**
   * Select email template to load in editor
  */
  selectEmailTemplate() {
    this.templateLoadingTxt = 'Loading template...';
    const local = this.localStore.get(`emailTemplate_${this.emailData.templateType}_${this.emailData.template}`);

    // Check if already available in local storage
    if (local) {
        this.emailData.subject = local.subject;
        this.emailData.content = local.body;
        this.attachEmailSignature();
        this.templateLoadingTxt = '';
    } else {
        // Get it from server
        const args = `email_template&type=${this.emailData.templateType}&id=${this.emailData.template}`;
        this.httpService.getCrmSettings(args).subscribe((res: any) => {
            this.emailData.subject = res.subject;
            this.emailData.content = res.body;
            this.attachEmailSignature();
            this.localStore.set(`emailTemplate_${this.emailData.templateType}_${this.emailData.template}`, res);
            this.templateLoadingTxt = '';
            console.log(res);
        });
    }
  }

  getEmailTemplateList(templates = []) {
    if (templates === undefined || this.emailData.templateType === undefined || this.emailData.templateType === '') {
        return [];
    }

    // filter email templates by type
    return <any>templates.filter((template: any) => {
        return template.type === this.emailData.templateType;
    });
  }

  /**
     * Get email settings
  */
  getEmailSettings(forceLoad = false) {
    this.emailSettings = false;
    this.emailData.templateType = 'text';
    const localSettings = this.localStore.get('emailSettings');
    if (localSettings && !forceLoad) {
        this.emailSettings = localSettings;
        this.attachEmailSignature();
        this.showLoadSetting = false;
        this.showLoadSettingBtnTxt = 'Reload connected accounts';
    } else {
        this.httpService.getCrmSettings().subscribe((res: any) => {
            this.emailSettings = res;
            this.localStore.set('emailSettings', res);
            this.attachEmailSignature();
            this.showLoadSetting = false;
            this.showLoadSettingBtnTxt = 'Reload connected accounts';
        });
    }
  }

  /**
     * Attach email signature
     */
  attachEmailSignature() {
    this.emailData.content += '<br /><br />' + this.emailSettings.email_signature;
  }

  /**
     * Send email
     *
     * @param action
  */
  sendEmail(action = 'send_email') {
        // Add some validation checks
        if (this.emailData.to == '') {
            alert('Please enter email address.');
            return;
        }

        if (this.emailData.subject == '') {
            alert('Please enter email subject.');
            return;
        }

        this.newActivityType = '';

        const data: any = new FormData();

        const subject = this.processShortcodes(this.emailData.subject);
        const content = this.processShortcodes(this.emailData.content);

        data.append('action', action);
        data.append('email_id', this.emailData.id);
        data.append('activity_id', this.emailData.activityId);
        data.append('entry_id', this.data.id);
        data.append('recipients', this.emailData.to);
        data.append('subject', subject);
        data.append('sender', this.emailData.sender);
        data.append('body', content);
        data.append('cc', this.emailData.toCc);
        data.append('bcc', this.emailData.toBcc);
        data.append('email_template', this.emailData.template);
        data.append('attachments', this.emailData.file);
        data.append('reminder', this.emailData.reminder);
        data.append('reminder_date', this.emailData.reminderDate);
        data.append('reminder_type', this.emailData.reminderType);
        data.append('email_sequence', this.emailData.sequence);
        data.append('schedule', this.emailData.schedule);
        data.append('schedule_time', this.emailData.scheduleTime);
        data.append('schedule_timezone', this.emailData.scheduleTimezone);

        let index = 0;

        if (this.emailData.id > 0 && this.emailData.activityId > 0) {
            index = this.data.activities.findIndex((activity: any) => activity.id == this.emailData.activityId);
        }

        // add data to activity
        this.data.activities.splice(index, 0, {created: {fname: '', lname: '', date: '', time: 'Just now'}, date: '', entry_id: this.data.id, type_id: '', user_id: 1, id: 0, type: 'email', description: this.emailData.content, email: {subject: subject, from: this.emailData.sender, to: this.emailData.to, cc: this.emailData.toCc, status: 'pending', bcc: this.emailData.toBcc, body: content}});

        this.resetEmailForm();
        this.hideEmail();

        this.httpService.bulkActionsActivities(data).subscribe((res: any) => {
            this.data.activities[index] = res;
            this.localStore.set('entry_' + this.data.id, this.data);
        });
  }

  resetEmailForm() {
    this.emailData = {...this.defaultEmailData};
  }

  hideEmail() {
    this.newActivityType = '';
  }

  /**
   * Send email later with schedule
   */
  sendEmailLater() {
      this.sendEmail('email_schedule');
  }

  /**
     * Process shortcodes in content
     * @param content
     */
   processShortcodes(content = ''){
    this.shortcodes.forEach((shortcode) => {
        content = content.replace(`[${shortcode}]`, this.getShortcodeValue(shortcode));
    });

    return content;
  }

  processAttachment(input: any) {
    this.emailData.file = input.srcElement.files[0];
  }

  /**
     * Pick shortcode value and return
     *
     * @param shortcode
     */
   getShortcodeValue(shortcode = ''){
    let value = '';

    switch (shortcode) {
        case 'first_name':
             return this.data.row?.item.split(' ')[0];
        case 'full_name':
            return this.data.row?.item;
        case 'company_name':
            return this.data.row?.company;
        case 'phone_number':
            return this.data.row?.phone;
        case 'email':
            return this.data.row?.email;
        case 'company_email':
            return this.data.row?.company_email;
        case 'company_url':
            return this.data.row?.company_url;
        case 'user_email':
            return this.user?.user_email;
        case 'user_full_name':
            return this.user?.full_name;
        case 'user_first_name':
            return this.user?.fname;
        case 'user_company_name':
            return this.user?.company;
        case 'user_company_url':
            return this.user?.company_url;
    }

    return value;
  }

  ngOnInit(): void {
  }

}
