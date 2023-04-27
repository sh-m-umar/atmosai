import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-item-value-modal',
  templateUrl: './item-value-modal.component.html',
  styleUrls: ['./item-value-modal.component.scss']
})
export class ItemValueModalComponent {
  statusEdit = false;
  editLabel = false;
  editTagsBit = false;
  selectedDate: any='';
  totalDaysSelected: any='';
  dateRange: any =''
  progressPercentage: number = 0;
  setMilestone: any;
  cellValue:any;
  // to open the date range popup for timeline column
  openDaterangePicker() {
    const eleId = 'daterangepicker-timeline';
    const dateElm = document.getElementById(eleId);

    if (dateElm != null) {
        const dateInput = dateElm.querySelector('input');
        dateInput?.click();
    }
  }

  // clear date range
  clearDateRange() {
    this.selectedDate = '-';
    this.totalDaysSelected = 0;
    this.dateRange = {start: new Date(), end: new Date()};
    this.progressPercentage = 0;
    // todo: @umar also need to send request server to clear date from db
  }

  updateCell(empty = false) {
        const value = {
          setMilestone: this.setMilestone,
          dateRange: this.dateRange,
        }
        this.cellValue = JSON.stringify(value);
        this.setStartEndDate(this.dateRange);
  }

  //to set all functionality in date range
  setStartEndDate(date: any) {
    const stDate = new Date(this.dateRange.start);
    const getStDateMonth = stDate.toLocaleString('default', {month: 'short'});
    const getStDateDay = stDate.getDate();

    const endDate = new Date(this.dateRange.end);
    const getEndDateMonth = endDate.toLocaleString('default', {month: 'short'});
    const getEndDateDay = endDate.getDate();

    const currentDate = new Date();

    if(this.setMilestone) {
      this.selectedDate = getStDateMonth + ' ' + getStDateDay;
      const isFutureDate = moment(stDate).isAfter(currentDate);
      if(isFutureDate) {
        this.progressPercentage = 100;
      } else {
        this.progressPercentage = 0;
      }
    } else {
      this.selectedDate = getStDateMonth + ' ' + getStDateDay + ' - ' + getEndDateMonth + ' ' + getEndDateDay;
      // to calculate percentage of progress bar
      const a = moment(endDate);
      const b = moment(stDate);
      this.totalDaysSelected =a.diff(b, 'days');
      const totalDaysLeft = a.diff(moment(currentDate), 'days')+1;
      this.progressPercentage = Math.abs(((totalDaysLeft/this.totalDaysSelected)*100)-100);
    }

}

}
