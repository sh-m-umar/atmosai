import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {HttpService} from "../http.service";
import {ActivatedRoute, Event, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {SignatureComponent} from "@syncfusion/ej2-angular-inputs";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import {CacheService} from "../cache.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-customer-invoice',
    templateUrl: './customer-invoice.component.html',
    styleUrls: ['./customer-invoice.component.scss']
})
export class CustomerInvoiceComponent implements OnInit {
    @ViewChild('customerPreview') content!: ElementRef;
    @ViewChild('canvas') canvas!: ElementRef;
    @ViewChild('downloadLink') downloadLink!: ElementRef;

    @ViewChild('signature')
    public signature: SignatureComponent | undefined;
    public data: any;
    public id:number|string = 0;
    public token = '';
    public loaded = false;
    private signed = false;
    public submitSignature = false;
    public shouldPrint = false;
    public shouldDownload = false;
    approvalStatus: boolean = false;
    public invoiceData:any = {
        products: [],
        subTotal: 0,
        salesTax: 0,
        discount: 0,
        total: 0
    };

    constructor(
      public httpService: HttpService,
      private route: ActivatedRoute,
      public router: Router,
      public cache: CacheService,
      private _snackBar: MatSnackBar,
      ) {
      this.route.queryParams.subscribe((queryParams) => {
        if(queryParams['print'] && queryParams['print'] === 'true') {
          this.shouldPrint = true;
        } else if(queryParams['download'] && queryParams['download'] === 'true') {
          this.shouldDownload = true;
        }
      });
    }

    ngOnInit(): void {
        this.getData();
    }

    /**
     * Get data from server
     */
    getData() {

        // set id and token
        this.id = this.route.snapshot.params[ 'id' ];
        this.token = this.route.snapshot.params[ 'token' ];

        this.httpService.getPublicInvoice(this.id, this.token).subscribe(async (data: any) => {
            this.data = data;
            const invoiceStatus: any = await this.getStatusById(this.data?.status);
            this.data.invoiceStatus = invoiceStatus?.name;

            try {
                this.data.invoice_billing_user_info = JSON.parse(this.data.invoice_billing_user_info);
            } catch (e) {
                this.data.invoice_billing_user_info = {
                    first_name: '',
                    last_name: '',
                    company: '',
                    address: '',
                    city: '',
                    postal_code: '',
                    country: '',
                    state: ''
                };
            }

            console.log('this.data', this.data)

            // print invoice
            if(this.shouldPrint) {
              setTimeout(() => {
                this.openPrintWindow();
              }, 1000);
            }

            // download invoice
            if(this.shouldDownload) {
              setTimeout(() => {
                this.downloadInvoice();
              }, 1000);
            }

            // Parse products
            this.invoiceData.products = this.data?.products && JSON.parse(this.data?.products);

            // Calculate totals
            this.calculateTotals();
            this.loaded = true;
        });
    }

    calculateTotals() {
        this.invoiceData.subTotal = 0;
        this.invoiceData.salesTax = 0;
        this.invoiceData.discount = 0;
        this.invoiceData.total = 0;

        if (this.invoiceData?.products?.length > 0) {
            this.invoiceData.products.forEach((product: any) => {
                this.invoiceData.subTotal += parseFloat(product.total_price);
                this.invoiceData.salesTax += parseFloat(product.tax);
                this.invoiceData.discount += parseFloat(product.discount);
                this.invoiceData.total += parseFloat(product.total_price);
            });
        }
    }

    /**
     * Submit approval
     */
    submitApproval(){
        if (this.signature === undefined) {
            return;
        }

        if (!this.signed) {
            alert('Please sign the invoice.');
            return;
        }

        const data = {
            id: this.id,
            token: this.token,
            customer_notes: this.data?.customer_notes,
            signed: 'Yes',
            signature: this.signature.getSignature()
        };

        this.submitSignature = true;

        this.httpService.saveSignaturePublicInvoice(data).subscribe((data: any) => {
          window.location.reload();
          this.data = data;
          this.submitSignature = false;
        });
    }

    declineApproval() {
      this.approvalStatus = true;
      const data = {
        id: this.id,
        token: this.token,
        customer_notes: '',
        signed: 'No',
        signature: '',
      };

      this.submitSignature = true;

      this.httpService.saveSignaturePublicInvoice(data).subscribe((data: any) => {
        this.submitSignature = false;
      });
    }

    /**
     * Clear signature
     */
    clear() {
        if (this.signature === undefined) {
            return;
        }

        this.signature.clear();
    }

    /**
     * check if signature is signed or not
     *
     * @param event
     */
    changeSignature(event: any) {
        if (this.signature === undefined) {
            return;
        }

        this.signed = event.actionName !== undefined && event.actionName !== 'clear';
    }

    openPrintWindow() {
      const printContents: any = document.getElementById('customerPreview')?.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }

    downloadInvoice() {
      // html2canvas(this.content.nativeElement).then(canvas => {
      //   this.canvas.nativeElement.src = canvas.toDataURL();
      //   this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      //   this.downloadLink.nativeElement.download = 'invoice.png';
      //   this.downloadLink.nativeElement.click();
      // });

      html2canvas(this.content.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        var doc = new jsPDF('l', 'px', [canvas.width, canvas.height]);
        doc.addImage(this.canvas.nativeElement.src, 'PNG', 0, 10, canvas.width, canvas.height);
        doc.save('invoice.pdf');
      });
    }

    async getStatusById(id: string) {
      if (!id) {
          return {}
      };

      let statuses: any[] = [];

      if(this.data?.board_type === 'invoice') {
        statuses = await this.getStatuses(58);
      } else if(this.data?.board_type === 'estimate') {
        statuses = await this.getStatuses(29);
      } else if (this.data?.board_type === 'quote') {
        statuses = await this.getStatuses(48);
      }

      const status = statuses.find((status: any) => status.id === id);
      return status;
    }


    async getStatusByName(name: string) {
      if (!name) {
          return {}
      }

      let statuses: any[] = [];

      if(this.data?.board_type === 'invoice') {
        statuses = await this.getStatuses(58);
      } else if(this.data?.board_type === 'estimate') {
        statuses = await this.getStatuses(29);
      } else if (this.data?.board_type === 'quote') {
        statuses = await this.getStatuses(48);
      }

      const status = statuses?.find( ( status: any ) => status.name.toLowerCase() === name.toLowerCase() );
      return status;
    }

    async getStatuses(boardId: number) {
      let invoiceBoard = this.cache.getBoardCache(boardId);

        if (invoiceBoard === undefined || invoiceBoard === null) {
            // load board
            await this.httpService.getSingleBoard(boardId).subscribe((res:any) => {
                this.cache.setBoardCache(boardId, res);
                invoiceBoard = res;
            });
        }

      if (invoiceBoard?.columns?.length) {
          const statusColumns = invoiceBoard?.columns?.filter((col: any) => {
              return col.type == 'status' && col.key == 'status';
          });

          if (statusColumns[0]?.statuses?.length) {
              const statuses = statusColumns[0].statuses.filter((status: any) => {
                  return status.name.trim() !== '';
              });
              return statuses;
          }
      }
      return [];
    }

    onInoicePayment() {
      this.data.invoiceStatus = 'Paid';
    }

    async updateStatus(status: string) {
      const entryStatus: any = await this.getStatusByName(status);

      const rowData = {
        board_id: this.data?.board_id,
        group_id: this.data?.group_id,
        entry_id: this.data?.id,
        key: 'status',
        content: entryStatus?.id,
      };

      this.httpService.updateRowMeta(rowData)
      .subscribe((data: any) => {
        this.cache.reCacheBoardData(this.data?.board_id);
        const message: string = entryStatus.name === 'Customer Declined'? 'Declined': entryStatus.name === 'Customer Approved'? 'Approved': '';

        if(message) {
          this._snackBar.open(`${this.data?.board_type} ${message}.`, 'Ok', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
}
