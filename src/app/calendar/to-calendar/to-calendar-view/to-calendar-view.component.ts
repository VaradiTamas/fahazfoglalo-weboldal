import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {Subscription} from 'rxjs';
import {ToCalendarService} from '../to-calendar-service';
import {ToCalendarHeaderComponent} from '../to-calendar-header/to-calendar-header.component';

@Component({
  selector: 'app-to-calendar',
  templateUrl: './to-calendar-view.component.html',
  styleUrls: ['./to-calendar-view.component.css']
})
export class ToCalendarViewComponent implements OnInit, OnDestroy {
  @Output() dateChosen = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedDate: Date = new Date();
  header = ToCalendarHeaderComponent;
  private dateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public toDateService: ToCalendarService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  addEvent(chosenDate: Date): void {
    this.selectedDate = chosenDate;
    this.dateChosen.emit({date: chosenDate});
  }

  setMonthView(): void{
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
        };
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}
