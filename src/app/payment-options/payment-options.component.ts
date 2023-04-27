import { HttpService } from './../http.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from "ngx-paypal";
import { StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { Observable } from 'rxjs';
import Stripe from 'stripe';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;

  @Input() data: any;
  @Input() invoiceData: any;
  @Output() invoicePaid: EventEmitter<any> = new EventEmitter();

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  public payPalConfig ? : IPayPalConfig;
  public stripe = new Stripe('sk_test_51MUGXxLt0tp2CqPK1cfAjqX29jgr41yUzTtZ07IU6Fhgsg0E1O40WmDDu6vDbv2Ur6XSAAR6S9mG2d7aVaUv9w4x00fFJ8Nf0E', {
    apiVersion: '2022-11-15',
    stripeAccount: 'acct_1MUGXxLt0tp2CqPK',
  });

  clientSecret: any;


  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipCode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initPayPalConfig();

    // this.createPaymentIntent(123);
  }

  private initPayPalConfig(): void {
      this.payPalConfig = {
          currency: 'USD',
          clientId: this.data.paypal_client_id,
          createOrderOnClient: (data) => < ICreateOrderRequest > {
              intent: 'CAPTURE',
              purchase_units: [{
                  amount: {
                      currency_code: 'USD',
                      value: this.invoiceData.total,
                      breakdown: {
                          item_total: {
                              currency_code: 'USD',
                              value: this.invoiceData.total,
                          }
                      }
                  },
                  items: [],
                  // items: [{
                  //     name: 'Enterprise Subscription',
                  //     quantity: '1',
                  //     category: 'DIGITAL_GOODS',
                  //     unit_amount: {
                  //         currency_code: 'USD',
                  //         value: '9.99',
                  //     },
                  // }]
              }]
          },
          advanced: {
              commit: 'true'
          },
          style: {
              label: 'paypal',
              layout: 'horizontal',
              shape: 'pill',
              tagline: false,
          },
          onApprove: (data, actions) => {
              // console.log('onApprove - transaction was approved, but not authorized', data, actions);
              actions.order.get().then((details: any) => {
                  // console.log('onApprove - you can get full order details inside onApprove: ', details);
              });

          },
          onClientAuthorization: (data) => {
              // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
              this.onPaymentSuccess(data, 'PayPal');
          },
          onCancel: (data, actions) => {
              // console.log('OnCancel', data, actions);

          },
          onError: err => {
              console.log('OnError', err);
          },
          onClick: (data, actions) => {
              // console.log('onClick', data, actions);
          }
      };
  }

  // pay() {
  //   if (this.paymentElementForm.valid) {
  //     this.paying = true;
  //     this.stripeService?.confirmPayment({
  //       elements: this.paymentElement?.elements,
  //       // confirmParams: {
  //       //   payment_method_data: {
  //       //     billing_details: {
  //       //       name: this.paymentElementForm?.get('name')?.value,
  //       //       email: this.paymentElementForm?.get('email')?.value,
  //       //       address: {
  //       //         line1: this.paymentElementForm?.get('address')?.value || '',
  //       //         postal_code: this.paymentElementForm?.get('zipCode')?.value || '',
  //       //         city: this.paymentElementForm?.get('city')?.value || '',
  //       //       }
  //       //     }
  //       //   }
  //       // },
  //       redirect: 'if_required'
  //     }).subscribe(result => {
  //       this.paying = false;
  //       console.log('Result', result);
  //       if (result.error) {
  //         // Show error to your customer (e.g., insufficient funds)
  //         alert({ success: false, error: result.error.message });
  //       } else {
  //         // The payment has been processed!
  //         if (result.paymentIntent.status === 'succeeded') {
  //           // Show a success message to your customer
  //           alert({ success: true });
  //         }
  //       }
  //     });
  //   } else {
  //     console.log(this.paymentElementForm);
  //   }
  // }

  // async createPaymentIntent(amount: number) {
  //   const paymentIntent = await this.stripe.paymentIntents.create({
  //     amount: 1099,
  //     currency: "usd",
  //     payment_method_types: ["card"],
  //   });

  //   console.log('paymentIntent', paymentIntent);

  //   this.clientSecret = paymentIntent.client_secret;
  //   console.log('this.clientSecret', this.clientSecret);
  // }

  onPaymentSuccess(paymentRes: any, paymentType: string) {
    const data = {
      id: this.data.id,
      token: this.data.token,
      payment_method: paymentType,
      payment_id: paymentRes.id
    }
    this.httpService.sendPaymentResponse(data).subscribe((res: any) => {
      if(res.status === 'success') {
        this.invoicePaid.emit();
        this.openSnackBar();
      }
    });
  }

  openSnackBar() {
    this._snackBar.open('Payment Successful', 'Ok', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
