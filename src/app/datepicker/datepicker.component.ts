import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {Booking} from "../model/booking.model";
import {Subscription} from "rxjs";
import {BookingService} from "../services/booking.service";
import {DateService} from "./date-service";

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements OnInit, OnDestroy{
  isLoading = false;
  reservedDays: number[] = [];
  month = 5;
  year = 2021;
  private dateSubscription: Subscription;

  constructor(public dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.getReservedDays(this.year, this.month);
    this.dateSubscription = this.dateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.reservedDays = subData.reservedDays;
        this.isLoading = true;
      });
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view === 'month') {

      const date = cellDate.getDate();

      var isReserved = false;

      this.reservedDays.forEach((day) => {
        if(date === day){
          isReserved = true;
        }
      });

      if(isReserved){
        return 'example-custom-date-class';
      }
    }

    return '';
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}
