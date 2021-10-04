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
  @Output() selectedDateChange = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
  private currentYear: number;
  private currentMonth: number;
  header = ToCalendarHeaderComponent;
  private reservedDaysSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public toDateService: ToCalendarService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  private getFirstDayOfNextReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesBiggerThanSelectedDate: number[] = [];
    this.reservedDays.forEach((reservedDay) => {
      if (dayOfSelectedDate < reservedDay) {
        reservedDatesBiggerThanSelectedDate.push(reservedDay);
      }
    });
    if (reservedDatesBiggerThanSelectedDate === []){
      return 32;
    } else {
      let smallestOfReservedDatesBiggerThanSelectedDate = 31;
      reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
        if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
          smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
        }
      });
      return smallestOfReservedDatesBiggerThanSelectedDate;
    }
  }

  private getLastDayOfPreviousReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesSmallerThanSelectedDate: number[] = [];
    this.reservedDays.forEach((reservedDay) => {
      if (dayOfSelectedDate > reservedDay) {
        reservedDatesSmallerThanSelectedDate.push(reservedDay);
      }
    });
    if (reservedDatesSmallerThanSelectedDate === []){
      return -1;
    } else {
      let biggestOfReservedDatesSmallerThanSelectedDate = -1;
      reservedDatesSmallerThanSelectedDate.forEach((reservedDay) => {
        if (reservedDay > biggestOfReservedDatesSmallerThanSelectedDate) {
          biggestOfReservedDatesSmallerThanSelectedDate = reservedDay;
        }
      });
      return biggestOfReservedDatesSmallerThanSelectedDate;
    }
  }

  setSelectedDates(chosenDate: Date): void{
    if (this.selectedStartDate == null){
      this.selectedStartDate = chosenDate;
    } else if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear()){
      if (chosenDate.getDate() === this.selectedStartDate.getDate()) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      } else if (this.selectedStartDate != null && this.selectedEndDate != null && this.selectedStartDate.getDate() > chosenDate.getDate() && chosenDate.getDate() > this.getLastDayOfPreviousReservedDays(this.selectedStartDate)) {
        this.selectedStartDate = chosenDate;
      } else if (this.selectedEndDate == null && chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() < this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
      } else if (this.selectedEndDate != null && chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() < this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
      }
    } else {
      this.selectedStartDate = chosenDate;
    }
  }

  addEvent(chosenDate: Date): void {
    this.setSelectedDates(chosenDate);
    this.selectedDateChange.emit({date: chosenDate});
    this.toDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
  }

  setMonthView(): void{
    const today: Date = new Date();
    this.toDateService.getReservedDays(today.getFullYear(), today.getMonth());
    this.selectedDateSubscription = this.toDateService.getSelectedDateUpdateListener()
      .subscribe((subData) => {
        this.setSelectedDates(subData.selectedDate);
        this.toDateService.getReservedDays(subData.selectedDate.getFullYear(), subData.selectedDate.getMonth());
      });
    this.reservedDaysSubscription = this.toDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.reservedDays = subData.reservedDays;
        this.currentYear = subData.currentYear;
        this.currentMonth = subData.currentMonth;
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
            let isPending = false;
            let isChosen = false;

            const pendingDates: number[] = [];
            const chosenDates: number[] = [];

            if (this.selectedStartDate != null && this.selectedEndDate == null){
              const dayOfSelectedDate = this.selectedStartDate.getDate();
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
              chosenDates.push(this.selectedStartDate.getDate());
            }

            if (this.selectedStartDate != null && this.selectedEndDate != null){
              for (let i = this.selectedStartDate.getDate(); i <= this.selectedEndDate.getDate(); i++){
                chosenDates.push(i);
              }
            }

            this.reservedDays.forEach((day) => {
              if (date === day) {
                isReserved = true;
              }
            });

            pendingDates.forEach((day) => {
              if (date === day) {
                isPending = true;
              }
            });

            chosenDates.forEach((day) => {
              if (date === day) {
                isChosen = true;
              }
            });

            if (isReserved) {
              return 'reserved-dates';
            } else if (isPending) {
              return 'pending-dates';
            } else if (isChosen){
              return 'chosen-dates';
            } else {
              return 'free-dates';
            }
          }

          return '';
        };
      });
  }

  ngOnDestroy(): void {
    this.reservedDaysSubscription.unsubscribe();
    this.selectedDateSubscription.unsubscribe();
  }
}
