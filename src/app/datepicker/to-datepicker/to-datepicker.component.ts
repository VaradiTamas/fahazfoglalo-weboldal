import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatCalendarCellClassFunction, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Subscription} from "rxjs";
import {ToDateService} from "./to-date-service";
import {ToDatepickerHeaderComponent} from "./to-datepicker-header/to-datepicker-header.component";

@Component({
  selector: 'app-to-datepicker',
  templateUrl: './to-datepicker.component.html',
  styleUrls: ['./to-datepicker.component.css']
})
export class ToDatepickerComponent implements OnInit, OnDestroy {
  isLoaded = false;
  reservedDays: number[] = [];
  selectedDate: Date = new Date();
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';
  header = ToDatepickerHeaderComponent;
  private dateSubscription: Subscription;
  @Output() dateChosen = new EventEmitter<{date: Date}>();

  constructor(public toDateService: ToDateService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateChosen.emit({date: event.value});
  }

  setMonthView(){
    this.toDateService.getReservedDays(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
    this.dateSubscription = this.toDateService.getReservedDaysUpdateListener()
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
