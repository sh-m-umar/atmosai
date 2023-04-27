import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {BoardsComponent} from '../boards/boards.component';
import {CacheService} from '../cache.service';
import {HttpService} from '../http.service';
import {LocalService} from "../local.service";
import {MatStepper} from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-form-invoice',
    templateUrl: './form-invoice.component.html',
    styleUrls: ['./form-invoice.component.scss']
})
export class FormInvoiceComponent implements OnInit {
    @ViewChild('stepper') stepper!: MatStepper;
    @Input() recurring: boolean = false;
    @Input() data: any = {};
    @Input() cols: any = {};
    @Input() type: any = '';
    @Input() boardType: string = 'estimate';
    isShowServices = false;
    headerCollapsed = false;
    isLoading = false;
    stepContentPos = 'left';
    step1 = false;
    step2 = false;
    showInvoiceSec = false;
    pageTitle = '';
    showStepper = false;
    newCustomer = false;
    billTo: any = '';
    shipTo: any = '';
    boardId = 0;
    invoiceItemsSubTotal = 0;
    totalDiscount = 0;
    totalPrice = 0;
    totalTax = 0;
    invoiceItems: Array<any> = [];
    users: Array<any> = [];
    addresses: Array<any> = [];
    editBillAddress: boolean = false;
    editShipAddress: boolean = false;
    filteredUsers: Array<any> = [];
    assignTo: any = '';
    filteredCustomers: Array<any> = [];
    customer: any;
    customerID: any;
    isLoadingCustomer = true;
    invoiceResponse: any;
    invoiceCurrentStatus: any = {id: '', name: ''};
    completed: boolean = false;
    state: string = '';
    stateData: any;
    customerInvoiceUrl: string = '';
    invoiceStatuses: any[] = [];
    estimateStatuses: any[] = [];
    quoteStatuses: any[] = [];

    invoice: any = {
        action: 'add-full-entry',
        item: '',
        board_id: null,
        //board_type: '',
        ship_to: '',
        billed_to: '',
        assign_to: '',
        date: '',
        reference: '',
        due_date: '',
        pay_via: 'PayPal',
        contract_signed: 'No',
        notes: '',
        terms: '',
        sub_total: 0,
        discount: 0,
        tax: 0,
        total_price: 0,
        status: '',
        logo: null,
        file: null,
    }

    invoiceItem: any = {
        item: '',
        category: '',
        quantity: 0,
        price: 0,
        tax: 0,
        discount: 0,
        total_price: 0,
        description: '',
        type: 'Product'
    }

    recurringInvoiceOptions = {
      is_recurring: 'Yes',
      recurring_start_date: '',
      recurring_end_date: '',
      recurring_sending_frequency: '',
      recurring_type: 'Standard',
      recurring_repeat_every: '',
      recurring_repeat_frequency: '',
    }

    firstFormGroup: FormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
    });

    secondFormGroup: FormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
    });

    public notificationUser: any = '';
    public emailNotificationData: any = {
      send_me_notification: 'no',
      send_notification_to: '',
    }

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
        sendLater: false,
        pdf_html: '',
    }

    public customerLoading: boolean = false;
    public toInvoiceLoading: boolean = false;
    public customerObj: any = {};
    public customerEmailAddress: any = '';

    constructor(
        private httpService: HttpService,
        private cache: CacheService,
        private boardComponent: BoardsComponent,
        private activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private localStore: LocalService,
        private router: Router,
        private _snackBar: MatSnackBar,
        ) {
    }

    done() {
        this.completed = true;
        this.state = 'done';
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => this.boardId = params['id']);
        this.setData();
      }

    setData() {
        this.stateData = this.data;
        this.setUsers();
        (this.type == 'quotes-invoices') && this.setFormValues();
        this.getInvoiceStatuses();
        this.getEstimateStatuses();
        this.getQuoteStatuses();
        this.setCustomers();
        this.setStepper();
        this.setInvoiceProducts();
        this.setInvoiceData();
        this.setRecurringOptions();
        this.setCustomerName( this.data.row.customer );

        // set invoice url
        if (this.data?.row?.id && this.data?.row?.token) {
          this.setCustomerInvoiceUrl(this.data.row.id, this.data.row.token);
        }

        // set page title
        this.pageTitle = 'Add ' + this.ucFirst( this.boardType );

        // set invoice status to draft
        const status = this.getStatusByName( 'Draft' );
        if( status && !this.invoice.status ) {
          this.invoice.status = status?.id;
        }
      }

      setUsers() {
        if (this.boardComponent.users?.length) {
          this.users = this.boardComponent.users;
        } else {
          this.httpService.getUsers().subscribe((res: any) => {
            this.users = res;
          });
        }
        this.filteredUsers = this.users;
      }

    setRecurringOptions() {
      if(this.data?.row?.is_recurring) {
        this.recurring = this.data?.row?.is_recurring === 'Yes';
        if(this.recurring) {
          this.recurringInvoiceOptions = {
            is_recurring: this.data?.row?.is_recurring,
            recurring_start_date: this.data?.row?.recurring_start_date,
            recurring_end_date: this.data?.row?.recurring_end_date,
            recurring_sending_frequency: this.data?.row?.recurring_sending_frequency,
            recurring_type: this.data?.row?.recurring_type,
            recurring_repeat_every: this.data?.row?.recurring_repeat_every,
            recurring_repeat_frequency: this.data?.row?.recurring_repeat_frequency,
          }
        }
      }
    }

    setInvoiceProducts() {
        if (this.data?.row?.products) {
            this.invoiceItems = JSON.parse(this.data?.row?.products);
        }
    }

    // set invoice data for current row
    setInvoiceData() {

        // set invoice data if invoice row exists
        if( this.data?.row?.status ) {

            // set invoice status
            this.invoiceCurrentStatus = this.getStatusById( this.data?.row?.status );

            // set invoice properties
            //this.customer = this.data.row?.billed_to;
            this.invoice.billed_to = this.data.row?.billed_to;
            this.invoice.ship_to = this.data.row?.ship_to;
            this.invoice.date = this.data.row?.date;
            this.invoice.reference = this.data.row?.reference;
            this.invoice.due_date = this.data.row?.due_date;
            this.invoice.contract_signed = this.data.row?.contract_signed;
            this.invoice.notes = this.data.row?.notes;
            this.invoice.terms = this.data.row?.terms;
            this.invoice.payVia = this.data.row?.payVia;
            this.invoice.logo = this.data.row?.logo;
            this.invoice.item = this.data.row?.item;

            this.setEditAddress('billing');
            this.setEditAddress('shipping');

            // calculate subTotal
            this.calculateSubTotal();

            // calculate discount
            this.calculateDiscount();

            // calculate tax
            this.calculateTax();

            // calculate total price
            this.calculateTotalPrice();

            // set assigned user name
            this.setUserName( this.data.row?.assign_to );

            // set customer invoice url
            this.setCustomerInvoiceUrl( this.data?.row?.id, this.data.row?.token );
        }
    }

    setFormValues() {
        this.invoice.item = this.data?.row?.item;

        this.cols.forEach((col: any) => {
          if (col.cellRendererParams?.typeCol === "location") {
            if (col.field in this.data.row && this.data?.row[col.field]) {
              this.addresses.push([col.headerName, this.data.row[col.field]]);
            }
          }
        });
    }

    setCustomers() {
        const queryParams = `?search=&board_types=lead,account,contact`
        this.httpService.searchEntries(queryParams).subscribe((res: any) => {
            this.isLoadingCustomer = false;
            this.filteredCustomers = res;
        });
    }

    setStepper() {
        if (this.data?.row && this.data?.row?.item && this.type === 'invoice-form') {
            this.showStepper = true;
            const status = this.getStatusById(this.data?.row?.status);
            if( status?.name != undefined ) {
                setTimeout(() => {
                  if (status.name.toLowerCase() === 'approved') {
                    this.stepper.next();
                  } else if (['sent', 'customer declined'].includes(status.name.toLowerCase())) {
                    this.stepper.next();
                    this.stepper.next();
                  } else if (status.name.toLowerCase() === 'customer approved') {
                    this.stepper.next();
                    this.stepper.next();
                    this.stepper.next();
                  }
                }, 500);
            }
        }
    }

    onCustomerChange() {
        const text = this.customer;
        if (text) {
            const queryParams = `?search=${text}&board_types=lead,account,contact`
            this.httpService.searchEntries(queryParams).subscribe((res: any) => {
                this.filteredCustomers = res;
            });
        }
    }

    onCustomerSelect(customer: any) {
        //this.invoice.item = customer.id;
        this.customerID = customer.id;
        this.invoice.billed_to = customer?.billing_address || '';
        this.invoice.ship_to = customer?.shipping_address || '';
        this.setEditAddress('billing');
        this.setEditAddress('shipping');
    }

    onDealLeadChange(text: string) {
        if (text) {
            this.filteredUsers = this.users.filter((user) => {
                return user.display_name.includes(text);
            });
        } else {
          this.filteredUsers = this.users.filter((user) => {
            return user.ID;
          });
        }
    }

    onUserSelect(user: any) {
        this.invoice.assign_to = user.ID;
    }

    /**
     * Get address from location field
     * @param event
     */
    getAddress(event: any, type: string) {
        if (event.formatted_address != undefined) {
            if (type === 'billing') {
                this.billTo = event.formatted_address;
                this.invoice.billed_to = event.formatted_address;
                this.setEditAddress('billing');
            } else if (type === 'shipping') {
                this.shipTo = event.formatted_address;
                this.invoice.ship_to = event.formatted_address;
                this.setEditAddress('shipping');
            }
        }
    }

    setEditAddress(type: string) {
      if(type === 'billing') {
        this.editBillAddress = this.invoice.billed_to?.length? false : true;
      } else if (type === 'shipping') {
        this.editShipAddress = this.invoice.ship_to?.length? false : true;
      }
    }

    processAttachment(input: any, key: string) {
        const files = input.srcElement.files;
        if (files?.length) {
            let formData: any = new FormData();
            formData.append('action', 'upload');
            formData.append('type', 'file');
            formData.append('content', files[0]);

            this.httpService.uploadFile('crm-settings', formData).subscribe((res) => {
                if (res.status) {
                    this.invoice[key] = res.data.url;
                }
            });
        }
    }

    onPaymentClick() {
        const state: NavigationExtras = {
            state: {
                data: this.invoiceResponse
            }
        };
        this.router.navigate([`/revenue/${this.invoiceResponse.id}/pay`], state);
    }

    onInvoiceFormSubmit() {
        if (this.invoice?.assign_to == '') {
            alert('Select Assign to');
            return;
        }
        if (this.invoice?.reference == '') {
            alert('Add Reference');
            return;
        }
        if (this.invoice?.date == '') {
            alert('Select Date');
            return;
        }
        if (this.invoice?.due_date == '') {
            alert('Select Due Date');
            return;
        }
        if (this.invoiceItems?.length == 0) {
            alert('Add a Product');
            return;
        }
        if (this.invoice?.billed_to == '') {
            alert('Add Billing Address');
            return;
        }

        //this.invoice.board_type = this.boardType;

        this.addInvoice();
    }

    addInvoice() {

        // set invoice.item
        this.invoice.item = this.invoice?.reference;

        this.isLoading = true;

        const board: any = this.getBoardByType(this.boardType);
        const boardId: number = board?.id;
        this.clearBoardCache(boardId);

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        let invoiceData = {
          ...this.invoice,
          board_id: boardId,
          total_price: this.totalPrice,
          tax: this.totalTax,
          discount: this.totalDiscount,
          subtotal: this.invoiceItemsSubTotal,
          products: JSON.stringify(this.invoiceItems),
          skip_column_check: true,
          token,
          customer: this.customerID,
          is_recurring: 'No',
          ...(this.recurring && this.recurringInvoiceOptions),
          status: this.getStatusByName('Draft')?.id,
        }

        this.httpService.bulkActionsRows(invoiceData)
            .subscribe(res => {
                    this.isLoading = false;
                    this.cache.reCacheBoardData(this.boardId, true);
                    this.boardComponent.getBoardData();
                    this.invoiceResponse = res;
                    this.data.row = res;
                    this.setCustomerInvoiceUrl(res.id, token);
                    this.invoiceCurrentStatus = this.getStatusById(res?.status);
                    if(res.is_recurring === 'Yes') {
                      this.recurringInvoiceOptions = {
                        is_recurring: 'Yes',
                        recurring_start_date: res?.recurring_start_date,
                        recurring_end_date: res?.recurring_end_date,
                        recurring_sending_frequency: res?.recurring_sending_frequency,
                        recurring_type: res?.recurring_type,
                        recurring_repeat_every: res?.recurring_repeat_every,
                        recurring_repeat_frequency: res?.recurring_repeat_frequency,
                      }
                    }
                    if (this.invoiceResponse) {
                        this.showStepper = true;
                    }

                    // set customer on this.customerObj to send invoice
                    this.setCustomerName( this.invoiceResponse.customer );
                }
            );
    }

    setCustomerInvoiceUrl(invoiceId: string, token: string) {

        // get host from current url
        const url = location.href;
        this.customerInvoiceUrl = url.split( '/board' )[0] + `/app/public/invoice/${invoiceId}/${token}`;
    }

    getBoardByType(type: string) {
      return this.boardComponent.allBoards?.find((board: any) => board.type === type);
    }

    // get products
    getProducts() {
        try {
            const parsedProducts = this.invoiceResponse.products ? JSON.parse(this.invoiceResponse.products) : [];
            const products: any = [];
            parsedProducts.forEach((ele: any) => {
                products.push(ele[1]);
            });
            return products;
        } catch {
            return [];
        }
    }

    // Clear board cache
    clearBoardCache(boardId: number) {
        this.cache.reCacheBoardData(boardId, false);
    }

    showNewCustomer() {
        this.newCustomer = !this.newCustomer;
    }

    getStatuses() {
        if (this.cols?.length) {
            const statusColumns = this.cols.filter((col: any) => {
                return col.cellRendererParams.typeCol == 'status';
            });

            if (statusColumns[0]?.cellRendererParams?.statuses?.length) {
                const statuses = statusColumns[0].cellRendererParams.statuses.filter((status: any) => {
                    return status.name.trim() !== '';
                });
                return statuses;
            }
        }
        return [];
    }

    getInvoiceStatuses() {
      let localBoard = this.cache.getBoardCache(58);

      if (!localBoard) {
        this.httpService.getSingleBoard(58).subscribe((data:any) => {
          localBoard = data;
          this.cache.setBoardCache(58, data);
        });
      }

      if (localBoard?.columns?.length) {
          const statusColumns = localBoard?.columns.filter((col: any) => {
              return col.key == 'status';
          });

          if (statusColumns[0]?.statuses?.length) {
              const statuses = statusColumns[0].statuses.filter((status: any) => {
                  return status.name.trim() !== '';
              });
              this.invoiceStatuses = statuses;
          }
      }
    }

    getEstimateStatuses() {
      let localBoard = this.cache.getBoardCache(29);

      if (!localBoard) {
        this.httpService.getSingleBoard(29).subscribe((data:any) => {
          localBoard = data;
          this.cache.setBoardCache(29, data);
        });
      }

      if (localBoard?.columns?.length) {
          const statusColumns = localBoard?.columns.filter((col: any) => {
              return col.key == 'status';
          });

          if (statusColumns[0]?.statuses?.length) {
              const statuses = statusColumns[0].statuses.filter((status: any) => {
                  return status.name.trim() !== '';
              });
              this.estimateStatuses = statuses;
          }
      }
    }

    getQuoteStatuses() {
      let localBoard = this.cache.getBoardCache(48);

      if (!localBoard) {
        this.httpService.getSingleBoard(48).subscribe((data:any) => {
          localBoard = data;
          this.cache.setBoardCache(48, data);
        });
      }

      if (localBoard?.columns?.length) {
          const statusColumns = localBoard?.columns.filter((col: any) => {
              return col.key == 'status';
          });

          if (statusColumns[0]?.statuses?.length) {
              const statuses = statusColumns[0].statuses.filter((status: any) => {
                  return status.name.trim() !== '';
              });
              this.quoteStatuses = statuses;
          }
      }
    }

    // change the status
    changeStatus(name: string) {
        this.invoice.status = 'Approved';
        this.invoiceCurrentStatus = this.getStatusByName(name);
        const rowData = {
            key: 'status',
            content: this.invoiceCurrentStatus.id,
            entry_id: this.data.row.id,
            //board_id: (this.invoice.board_type === 'estimate') ? 27 : 28,
            board_id: this.data.boardId
        }

        // get group index by ID
        const groupIndex = this.boardComponent.boardData.groups.findIndex((group: any) => {
            return group.id == this.data?.row?.group_id;
        });

        if (groupIndex >= 0) {
            // get row index by ID
            const rowIndex = this.boardComponent.boardData.groups[groupIndex].entries.forEach((row: any) => {
                if(row.id == this.data?.row?.id) {
                  // Update status
                  row.status = this.invoiceCurrentStatus.id;
                }
            });

            // this.boardComponent.boardData.groups[groupIndex].entries[rowIndex].status = this.invoiceCurrentStatus.id;

            // Update board cache
            this.cache.setBoardCache(this.data.boardId, this.boardComponent.boardData);

            // Build board data again
            this.boardComponent.buildBoardData();
        }

        this.httpService.updateRowMeta(rowData)
            .subscribe((data: any) => {
                //this.cache.reCacheBoardData((this.invoice.board_type === 'estimate') ? 27 : 28);
                // this.stepContentPos = 'text-center';
                this.step1 = true;
                this.setStepper();

                if (groupIndex === -1){
                    this.cache.reCacheBoardData(this.data.boardId);
                }
            });
    }

    approved() {
        this.stepContentPos = 'text-end';
        this.step1 = true;
        this.step2 = true;
    }

    // send email
    sendEmail( formAction = 'send_email' ) {
        // Add some validation checks
        if (this.emailData.to == '' || !this.validateEmail(this.emailData.to)) {
            alert('Please enter valid email address.');
            return false;
        }
        if (this.emailData.subject == '') {
            alert('Please enter email subject.');
            return false;
        }

        const data = {
            action: formAction,
            email_id: this.emailData.id,
            activity_id: this.emailData.activityId,
            entry_id: this.data.row.id,
            recipients: this.emailData.to,
            subject: this.emailData.subject,
            sender: this.emailData.sender,
            body: this.emailData.content,
            cc: this.emailData.toCc,
            bcc: this.emailData.toBcc,
            email_template: this.emailData.template,
            attachments: this.emailData.file,
            ...this.emailNotificationData
        }

        this.httpService.bulkActionsActivities(data).subscribe((res: any) => {
            this.localStore.set('entry_' + this.data.row.id, this.data);
            this.changeStatus('Sent');
        });

        return true;
    }

    // send invoice email
    sendInvoice() {

        // set invoice url
        if (this.data?.row?.id && this.data?.row?.token) {
            this.setCustomerInvoiceUrl(this.data.row.id, this.data.row.token);
        }

        let emailIds = this.customerEmailAddress?.split(',');
        emailIds?.forEach((emailId: string) => {
          this.emailData.to = emailId; //this.customerObj?.meta?.email?.split( ',' )[0]; //this.data?.row?.email?.split(',')[0];
          this.emailData.subject = this.ucFirst( this.boardType );
          this.emailData.content = 'Find your ' + this.boardType + ' in the link below<br>';
          this.emailData.content += `<a href="${this.customerInvoiceUrl}">Click Here</a>`;

          this.emailData.pdf_html = `<div class="row">
        <div class="col-sm-12">
            <div class="action-bttons mb-1 text-end">
                <button (click)="showInvoice('hide')" class="btn btn-sm btn-primary me-2"><i class="fa-light fa-print me-2"></i>Temp go back</button>
                <button class="btn btn-sm btn-primary me-2"><i class="fa-light fa-print me-2"></i>Print</button>
                <button class="btn btn-sm btn-primary"><i class="fa-light fa-download me-2"></i>Download</button>
            </div>
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between">
                    <div>Reference:<strong># ${this.invoiceResponse?.reference || this.invoice.reference}</strong></div>
                    <div>Due Date: <strong>${this.invoiceResponse?.due_date || this.invoice.due_date}</strong></div>
                </div>
                <div class="card-body">
                    <div class="invoice-amount">
                        <span><strong>Amount Due</strong></span>
                        <h2>$ ${this.invoiceResponse?.total_price || this.invoice.total_price}</h2>
                    </div>
                    <div class="payment-methods">
                        <button class="btn-sm btn btn-primary me-2"><i class="fa-light fa-credit-card me-2"></i>Credit card payment</button>
                        <span class="other-method me-2"><i class="fa-brands fa-cc-visa"></i></span>
                        <span class="other-method me-2"><i class="fa-brands fa-cc-mastercard"></i></span>
                        <span class="other-method me-2"><i class="fa-brands fa-cc-amex"></i></span>
                        <span>and more...</span>
                    </div>
                </div>
            </div>
            <div class="card bt-1 view-invoice">
                <div class="card-body px-5">
                    <div class="invoice-header d-flex justify-content-between align-items-center">
                        <div>
                            <h2 class="mb-0">ATMOSai</h2>
                            <span>your company tag line.</span>
                        </div>
                        <div><span class="invoice-text">${ this.ucFirst( this.boardType ) }</span></div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-sm-3 my-auto">
                            <img src="./assets/img/atmos-logo-sidebar.png" width="200px">
                        </div>
                        <div class="col-sm-3">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1">Date: <span>${this.invoiceResponse?.date || this.invoice.date}</span></li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1">${ this.ucFirst( this.boardType ) }#: <span>${this.invoiceResponse?.reference || this.invoice.reference}</span></li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1">Customer Id: <span>${this.data.id}</span></li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1">Purchase order#: <span>1234556</span></li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1">Payment due by: <span>${this.invoiceResponse?.due_date || this.invoice.due_date}</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="row justify-content-between mt-3">
                        <div class="col-sm-3">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item invoice-heading">Bill to:</li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.invoiceResponse?.item">
                                  ${this.invoiceResponse?.item || this.invoice.item}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.data?.row?.company">
                                  ${this.data?.row?.company}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.invoiceResponse?.billed_to">
                                  ${this.invoiceResponse?.billed_to || this.invoice.billed_to}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.data?.row?.phone">
                                  ${this.data?.row?.phone}
                                </li>
                            </ul>
                        </div>
                        <div class="col-sm-3">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item invoice-heading">Ship to (if different):</li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.invoiceResponse?.item">
                                  ${this.invoiceResponse?.item || this.invoice.item}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.data?.row?.company">
                                  ${this.data?.row?.company}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.invoiceResponse?.billed_to">
                                  ${this.invoiceResponse?.billed_to || this.invoice.billed_to}
                                </li>
                                <li class="list-group-item d-flex align-items-center justify-content-between p-1" *ngIf="this.data?.row?.phone">
                                  ${this.data?.row?.phone}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <table class="table table-sm table-striped mt-3 table-bordered">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Items</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Category A</td>
                                    <td>Product</td>
                                    <td>1</td>
                                    <td>$10</td>
                                    <td>5</td>
                                    <td>$5</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-sm-8">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Special note and instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="height:130px">
                                              ${this.invoiceResponse?.notes || this.invoice.notes}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-4">
                                <table class="table price table-bordered">
                                    <tr>
                                        <th>Subtotal</th>
                                        <td>$ ${this.invoiceResponse?.sub_total || this.invoice.sub_total}</td>
                                    </tr>
                                    <tr>
                                        <th>Sale tax rate</th>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <th>Sales tax</th>
                                        <td>$ ${this.invoiceResponse?.tax || this.invoice.tax}</td>
                                    </tr>
                                    <tr>
                                        <th>Discount</th>
                                        <td>$ ${this.invoiceResponse?.discount || this.invoice.discount}</td>
                                    </tr>
                                    <tr>
                                        <th><strong>Total</strong></th>
                                        <td><strong>$ ${this.invoiceResponse?.total_price || this.invoice.total_price}</strong></td>
                                    </tr>
                                </table>
                                <div>Here is the link for you online ${ this.boardType }: ${this.customerInvoiceUrl}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 invoice-footer">
                        <p>Make all checks payable to my company name</p>
                        <h3>Thanks for your Business!</h3>
                        <p>Should you have any query concerning to this ${ this.boardType }, Please contact John Doe on 00-000-000-0000</p>
                        <hr>
                        <p>111 street Town/City, County, ST, 0000</p>
                        <p>tell: 000-000-000-00, Fax: 000-000-000-0000, Email:abc@companyname.com, Web: yourcompany.com</p>
                    </div>
                </div>
            </div>
          </div></div>`;

          if( this.sendEmail() ) {
            // if email sent then move to next step
            this.stepper.next();
          }
        });
    }

    onChangeSendNotification(event: any) {
      if(event.target.checked) {
        this.emailNotificationData.send_me_notification = 'yes';
      } else {
        this.emailNotificationData.send_me_notification = 'no';
      }
    }

    onNotificationUserSelect(user: any) {
      this.emailNotificationData.send_notification_to = user.ID;
    }

    validateEmail(email: string) {
        if (email === undefined) return '';

        return email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }

    showServices(event: any) {
        (event == 'show' ? this.isShowServices = true : this.isShowServices = false);
    }

    showInvoice(event: any) {
        (event == 'show' ? this.showInvoiceSec = true : this.showInvoiceSec = false);
    }

    stepReset() {
        this.stepContentPos = 'left';
        this.step1 = false;
        this.step2 = false;
    }

    onInvoiceItemTypeSelect(type: string) {
      this.clearInvoiceItemTray();
      this.invoiceItem.type = type;
    }

    /**
     * Get the product data by id on the selection and assign that data to invoiceItem for auto-filling the other cells
     * @param id productId
     */
    onProductSelect(id: any) {
        const product = this.stateData.products.find((product: any) => product.id === id);
        this.invoiceItem = {...product, category: product?.categories, quantity: 1, discount: 0, type: this.invoiceItem.type};
        this.productTotalPrice();
    }

    /**
     * Get the service data by id on the selection and assign that data to invoiceItem for auto-filling the other cells
     * @param id serviceId
     */
    onServiceSelect(id: any) {
        const service = this.stateData.services.find((service: any) => service.id === id);
        this.invoiceItem = {...service, category: service?.categories, quantity: 1, discount: 0, type: this.invoiceItem.type};
        this.productTotalPrice();
    }

    onInvoiceItemCreate(e: Event): void {
        const invoiceTableItem = {
            'id': this.invoiceItem?.id,
            'item': this.invoiceItem?.item,
            'category': this.invoiceItem?.category,
            'quantity': this.invoiceItem?.quantity,
            'price': this.invoiceItem?.price,
            'tax': this.invoiceItem?.tax,
            'discount': this.invoiceItem?.discount,
            'total_price': this.invoiceItem?.total_price,
            'type': this.invoiceItem?.type
        }

        if (invoiceTableItem.item == '') {
            alert('Select product item');
            return;
        }
        if (invoiceTableItem.quantity == '') {
            alert('Select product quantity');
            return;
        }
        if (invoiceTableItem.price == '') {
            alert('Select product price');
            return;
        }

        this.invoiceItems.push(invoiceTableItem);
        this.showServices('hide');
        this.calculateSubTotal();
        this.calculateDiscount();
        this.calculateTotalPrice();
        this.calculateTax();
        this.clearInvoiceItemTray();
    }

    deleteInvoiceItem(item: string) {
        this.invoiceItems = this.invoiceItems.filter(x => x.item != item);
        this.calculateSubTotal();
        this.calculateDiscount();
        this.calculateTotalPrice();
        this.calculateTax();
    }

    clearInvoiceItemTray() {
        this.invoiceItem = {
            item: '',
            category: '',
            quantity: 1,
            price: 0,
            tax: '',
            discount: 0,
            total_price: 0,
            description: '',
            type: 'Product',
        }
    }

    // total price in product table
    productTotalPrice() {
        let totalProductPrice = 0
        totalProductPrice = (this.invoiceItem.quantity * this.invoiceItem.price);
        totalProductPrice += +this.invoiceItem.tax;
        this.invoiceItem.total_price = Math.floor(totalProductPrice - (totalProductPrice * (this.invoiceItem.discount / 100)));
    }

    calculateSubTotal() {
        let subTotal = 0;
        this.invoiceItems.forEach((item: any) => {
            subTotal += (item.price * item.quantity);
        });
        this.invoice.sub_total = subTotal;
        this.invoiceItemsSubTotal = subTotal;
    }

    // calculate total discount of all added products
    calculateDiscount() {
        let discount = 0;
        this.invoiceItems.forEach((item: any) => {
            discount += +item.discount;
        });
        this.invoice.discount = discount;
        this.totalDiscount = discount;
    }

    // calculating grand total price after discount
    calculateTotalPrice() {
        let totalPrice = 0;
        this.invoiceItems.forEach((item: any) => {
            totalPrice += +item.total_price;
        });
        this.invoice.total_price = Math.floor(totalPrice);
        this.totalPrice = Math.floor(totalPrice);
    }

    calculateTax() {
        let tax = 0;
        this.invoiceItems.forEach((item: any) => {
            tax += +item.tax;
        });
        this.invoice.tax = tax;
        this.totalTax = tax;
    }

    getStatusById(id: string) {
        if (!id) {
          return {};
        }

        const statuses = this.boardType === 'invoice'? this.invoiceStatuses : this.boardType === 'estimate'? this.estimateStatuses : this.boardType === 'quote'? this.quoteStatuses : [];
        const status = statuses?.find((status: any) => status.id === id);

        return status;
    }

    getStatusByName(name: string) {
        if (!name) {
            return {}
        }

        const statuses = this.boardType === 'invoice'? this.invoiceStatuses : this.boardType === 'estimate'? this.estimateStatuses : this.boardType === 'quote'? this.quoteStatuses : [];
        const status = statuses?.find( ( status: any ) => status.name.toLowerCase() === name.toLowerCase() );

        return status;
    }

    // set customer name by id
    setCustomerName( id = 0 ) {

        // set loader
        this.customerLoading = true;

        // check for id
        if( id > 0 ) {
          this.httpService.getSingleEntry( id ).subscribe( ( res: any ) => {
            this.customerLoading = false;
            this.customer = res.title;

            // also set customerObj to use for other functionality
            this.customerObj = res;

            // set the customer email address
            this.customerEmailAddress = this.customerObj?.meta?.email?.split( ',' )[0];
          });
      } else {
          // remove loader
          this.customerLoading = false;
        }
    }

    // set user name by id
    setUserName( id = 0 ) {
        // check for id
        if( id ) {
          const user: any = this.users.filter( ( userObj: any ) => { return ( userObj.ID == id ) } );
          if( user ) {
            this.assignTo = user[0]?.display_name;
            this.invoice.assign_to = user[0]?.ID;
          }
        }
    }

    // get user by id
    getUserById( id = 0 ) {

        // check for id
        if( id ) {
            const user = this.users.filter( ( userObj: any ) => { return ( userObj.ID == id ) } );
            if( user ) {
                return user[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Convert to invoice
    convertToInvoice(id = 0) {
        // Set loader
        this.toInvoiceLoading = true;
        id = id ? id : this.data.row.id;

        const data = {
            action: 'add-full-entry',
            skip_column_check: true,
            board_type: 'invoice',
            id: id,
            item: '',
            status: 'Approved'
        }

        // Remove current board cache
        this.cache.reCacheBoardData( this.data.boardId, false);

        // Delete from current board
        const groupIndex = this.boardComponent.boardData.groups.findIndex( ( group: any ) => { return ( group.id == this.data.row.group_id ) } );

        let setBoardData = false;

        if (groupIndex > -1 && this.boardComponent.boardData.groups[groupIndex]?.entries?.length > 0 && this.boardComponent.gridApi[groupIndex] !== undefined) {
            this.boardComponent.boardData.groups[groupIndex].entries = this.boardComponent.boardData.groups[groupIndex].entries.filter((row: any) => {
                return (row.id != this.data.row.id)
            });

            this.boardComponent.gridApi[groupIndex].updateRowData({remove: [this.data.row]});

            setBoardData = true;
        }

        // Hide popup
        this.boardComponent.isShowDetailPopup = false;

        // change entry to invoice
        this.httpService.bulkActionsRows( data ).subscribe( ( res: any ) => {

            // remove loader
            this.toInvoiceLoading = false;

            // Set current board cache
            if (setBoardData) {
                this.cache.setBoardCache(this.data.boardId, this.boardComponent.boardData);
            }

            this.cache.getAllBoards().then((boards) => {
              const invoiceBoard = boards.find((board: any) => board.type === 'invoice');
              //remove invoice board cache
              this.cache.reCacheBoardData(invoiceBoard?.id, false);
            });

        } );
    }

    // uppercase first letter
    ucFirst( string = '' ) {
        if( !string ) {
            return '';
        }

        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    toggleRecurringInvoice(event: any) {
      this.recurring = event.target.checked;
    }

    onRecurringTypeChange(event: any) {
      this.recurringInvoiceOptions.recurring_type = event.target.checked? 'Never End': 'Standard';
      this.recurringInvoiceOptions.recurring_end_date = '';
    }

    showCustomerInvoicePreview(queryParams = {}) {
      const invoiceId = this.data?.row?.id;
      const token = this.data?.row?.token;
      if(invoiceId && token) {
        const url = this.router.serializeUrl(this.router.createUrlTree([`/app/public/invoice/${invoiceId}/${token}`], { queryParams }));
        window.open(url, '_blank');
      }
    }

    sendReminder() {
      let content = `Hello {client first name}<br>
        Just touching base to see if you received the ${this.boardType}. If you have overlooked this is just a reminder.<br>
        Again, Thank you for your business.<br>
        Your Sales team`;

      const data = {
        action: 'send_email',
        email_id: this.emailData.id,
        activity_id: this.emailData.activityId,
        entry_id: this.data.row.id,
        recipients: this.customerEmailAddress,
        subject: `Reminder for ${this.ucFirst( this.boardType )}`,
        sender: this.emailData.sender,
        body: content,
        cc: this.emailData.toCc,
        bcc: this.emailData.toBcc,
        email_template: this.emailData.template,
        attachments: this.emailData.file
      }

      this.httpService.bulkActionsActivities(data).subscribe((res: any) => {
        this._snackBar.open('Reminder sent to customer.', 'Ok', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    }
}
