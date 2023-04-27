import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { CacheService } from "../cache.service";

@Component({
  selector: 'app-create-revenue',
  templateUrl: './create-revenue.component.html',
  styleUrls: ['./create-revenue.component.scss']
})
export class CreateRevenueComponent implements OnInit {

  revenueBoard: any;
  revenueCategories: any;
  revenuePaymentMethods: any;
  revenueAccounts: any;

  data: any;
  revenueForm: any = {
    board_type: 'revenue',
    board_id: 31,
    action: 'add-full-entry',
    id: '',
    date: '',
    payment_method: '',
    amount: '',
    tax: '',
    reference: '',
    bank_account: '',
    account: '',
    category: '',
    description: '',
  };

  constructor(
    private router: Router,
    private httpService: HttpService,
    private cache: CacheService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const routerState: any = this.router.getCurrentNavigation()?.extras.state;
      if (routerState.data) {
        this.data = routerState.data;
      }
    } else {
      this.router.navigate(['/boards/31/main']);
    }
  }

  ngOnInit(): void {
    this.setFormFields();
    this.getRevenueBoard();
    this.setColumnDropDowns();
  }

  /**
   * Get board details from the cache or the API
   */
  getRevenueBoard() {
    const localBoard = this.cache.getBoardCache(31);
    if (localBoard) {
      this.revenueBoard = localBoard;
    } else {
      this.httpService.getSingleBoard(31).subscribe((res:any) => {
        this.cache.setBoardCache(31, res);
        this.revenueBoard = res;
      });
    }
  }

  /**
   * Set the dropdown options from the board columns
  */
  setColumnDropDowns() {
    this.revenueBoard.columns.forEach( (col: any) => {
      if(col.key === 'account'){
        this.revenueAccounts = JSON.parse(col.settings);
      }
      if(col.key === 'category'){
        this.revenueCategories = JSON.parse(col.settings);
      }
      if(col.key === 'payment_method'){
        this.revenuePaymentMethods = JSON.parse(col.settings);
      }
    } );
  }

  /**
   * Set revenueForm fields
  */
   setFormFields() {
    this.revenueForm.id = this.data?.id;
    this.revenueForm.item = this.data?.item;
  }

  /**
   * Submit the the revenue form
  */
  onSubmit() {
    if(this.validateForm()) {
      this.httpService.bulkActionsRows(
        {
          ...this.revenueForm,
        })
        .subscribe(() => {
          this.router.navigate(['/boards/31/main']);
        }
      );
    }
  }

  validateForm() {
    if (!this.revenueForm.id) {
      alert('Add invoice id.');
      return false;
    }
    if (!this.revenueForm.date) {
      alert('Select date.');
      return false;
    }
    if (!this.revenueForm.payment_method) {
      alert('Select payment method.');
      return false;
    }
    if (!this.revenueForm.amount) {
      alert('Select amount.');
      return false;
    }
    if (!this.revenueForm.tax) {
      alert('Select tax.');
      return false;
    }
    if (!this.revenueForm.item) {
      alert('Select customer.');
      return false;
    }

    return true;
  }

}
