import {Component, OnDestroy, OnInit, ViewEncapsulation, EventEmitter, Output} from '@angular/core';
import {MatCalendarCellClassFunction, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Subscription} from "rxjs";
import {DateService} from "./date-service";
import {DatepickerHeaderComponent} from "./datepicker-header/datepicker-header.component";

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements OnInit, OnDestroy{
  isLoaded = false;
  reservedDays: number[] = [];
  month = 5;
  year = 2021;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';
  header = DatepickerHeaderComponent;
  private dateSubscription: Subscription;
  @Output() dateChosen = new EventEmitter<{date: Date}>();

  constructor(public dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.getReservedDays(this.year, 4);
    this.dateSubscription = this.dateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.reservedDays = subData.reservedDays;
        this.isLoaded = true;
        this.dateFilter = (d: Date | null): boolean => {
          const date = (d || new Date()).getDate();

          let isFree = true;

          this.reservedDays.forEach((day) => {
            if(date === day){
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

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateChosen.emit({date: event.value});
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}

