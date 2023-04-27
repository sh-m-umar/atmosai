import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { SignatureModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerInvoiceComponent } from "../../customer-invoice/customer-invoice.component";
import { PaymentOptionsComponent } from './../../payment-options/payment-options.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxStripeModule } from 'ngx-stripe';

import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';

const materialModules = [
  MatDividerModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatInputModule,
  MatToolbarModule,
  MatChipsModule,
];

@NgModule({
  imports: [
    CommonModule,
    SignatureModule,
    PublicRoutingModule,
    NgxPayPalModule,
    materialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(
      'pk_test_51Ii5RpH2XTJohkGafOSn3aoFFDjfCE4G9jmW48Byd8OS0u2707YHusT5PojHOwWAys9HbvNylw7qDk0KkMZomdG600TJYNYj20'
    ),
  ],
  providers: [],
  declarations: [CustomerInvoiceComponent, PaymentOptionsComponent],
})
export class PublicModule { }
