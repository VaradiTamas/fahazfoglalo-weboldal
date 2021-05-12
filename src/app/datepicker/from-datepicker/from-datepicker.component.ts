import {Component, OnDestroy, OnInit, ViewEncapsulation, EventEmitter, Output} from '@angular/core';
import {MatCalendarCellClassFunction, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {FromDatepickerHeaderComponent} from "./from-datepicker-header/from-datepicker-header.component";
import {FromDateService} from "./from-date-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-from-datepicker',
  templateUrl: './from-datepicker.component.html',
  styleUrls: ['./from-datepicker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FromDatepickerComponent implements OnInit, OnDestroy{
  isLoaded = false;
  reservedDays: number[] = [];
  selectedDate: Date = new Date();
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';
  header = FromDatepickerHeaderComponent;
  private dateSubscription: Subscription;
  @Output() dateChosen = new EventEmitter<{date: Date}>();

  constructor(public fromDateService: FromDateService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateChosen.emit({date: event.value});
  }

  setMonthView(){
    this.fromDateService.getReservedDays(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
    this.dateSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.reservedDays = subData.reservedDays;
        this.isLoaded = true;
        this.dateFilter = (d: Date | null): boolean => {
          const date = (d || new Date()).getDate();

          let isFree = true;

          this.reservedDays.forEach((day) => {
            if (date === day) {
              isFree = false;
            }
          });
          return isFree;
        }

        this.dateClass = (cellDate, view) => {
          if (view === 'month') {

            const date = cellDate.getDate();

            let isReserved = false;

            this.reservedDays.forEach((day) => {
              if (date === day) {
                isReserved = true;
              }
            });

            if (isReserved) {
              return 'reserved-dates';
            } else {
              return 'free-dates';
            }
          }

          return '';
        }
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}
