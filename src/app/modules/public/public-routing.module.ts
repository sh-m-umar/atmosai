import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomerInvoiceComponent} from "../../customer-invoice/customer-invoice.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerInvoiceComponent,
    children: [
      {
        path: 'invoice/:id/:token',
        component: CustomerInvoiceComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
