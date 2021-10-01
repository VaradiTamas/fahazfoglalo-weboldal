import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {FromCalendarHeaderComponent} from '../from-calendar-header/from-calendar-header.component';
import {Subscription} from 'rxjs';
import {FromCalendarService} from '../from-calendar-service';

@Component({
  selector: 'app-from-calendar',
  templateUrl: './from-calendar-view.component.html',
  styleUrls: ['./from-calendar-view.component.css']
})
export class FromCalendarViewComponent implements OnInit, OnDestroy{
  @Output() dateChosen = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
  header = FromCalendarHeaderComponent;
  private dateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public fromDateService: FromCalendarService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  addEvent(chosenDate: Date): void {
    if (this.selectedStartDate == null){
      this.selectedStartDate = chosenDate;
      this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
    } else if (chosenDate.getFullYear() === this.selectedStartDate.getFullYear() && chosenDate.getMonth() === this.selectedStartDate.getMonth() && chosenDate.getDate() === this.selectedStartDate.getDate()) {
      this.selectedStartDate = null;
    } else if (this.selectedEndDate == null){
      this.selectedEndDate = chosenDate;
      this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
    } else if (chosenDate.getFullYear() === this.selectedEndDate.getFullYear() && chosenDate.getMonth() === this.selectedEndDate.getMonth() && chosenDate.getDate() === this.selectedEndDate.getDate()){
      this.selectedEndDate = null;
    } else if ((this.selectedEndDate != null)){
      this.selectedEndDate = chosenDate;
      this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
    }
  }

  setMonthView(): void{
    const today: Date = new Date();
    this.fromDateService.getReservedDays(today.getFullYear(), today.getMonth());
    this.dateSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.reservedDays = subData.reservedDays;
        this.isLoaded = false;

        this.dateClass = (cellDate, view) => {
          if (view === 'month') {
            const date = cellDate.getDate();

            let isReserved = false;
            let isPending = false;
            const pendingDates: number[] = [];

            this.reservedDays.forEach((day) => {
              if (date === day) {
                isReserved = true;
              }
            });

            if (this.selectedDate != null){
              const dayOfSelectedDate = this.selectedDate.getDate();
              const reservedDatesBiggerThanSelectedDate: number[] = [];
              this.reservedDays.forEach((reservedDay) => {
                if (dayOfSelectedDate < reservedDay) {
                  reservedDatesBiggerThanSelectedDate.push(reservedDay);
                }
              });
              if (reservedDatesBiggerThanSelectedDate === []){
               for (let i = dayOfSelectedDate + 1; i <= 31; i++){
                 pendingDates.push(i);
               }
             } else {
                let smallestOfReservedDatesBiggerThanSelectedDate = 31;
                reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
                  if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
                    smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
                  }
                });
                for (let i = dayOfSelectedDate + 1; i <= smallestOfReservedDatesBiggerThanSelectedDate; i++){
                  pendingDates.push(i);
                }
              }
            }

            pendingDates.forEach((day) => {
              if (date === day) {
                isPending = true;
              }
            });

            if (isReserved) {
              return 'reserved-dates';
            } else if (isPending) {
              return 'pending-dates';
            } else {
              return 'free-dates';
            }
          }

          return '';
        };

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

        this.isLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}
