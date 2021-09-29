import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import {FromDatepickerHeaderComponent} from "../../datepicker/from-datepicker/from-datepicker-header/from-datepicker-header.component";
import {Subscription} from "rxjs";
import {FromDateService} from "../../datepicker/from-datepicker/from-date-service";

@Component({
  selector: 'app-from-calendar',
  templateUrl: './from-calendar.component.html',
  styleUrls: ['./from-calendar.component.css']
})
export class FromCalendarComponent implements OnInit, OnDestroy{
  @Output() dateChosen = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedDate: Date = new Date();
  header = FromDatepickerHeaderComponent;
  private dateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public fromDateService: FromDateService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  addEvent(chosenDate: Date): void {
    this.selectedDate = chosenDate;
    this.dateChosen.emit({date: chosenDate});
  }

  setMonthView(): void{
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
        };

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
