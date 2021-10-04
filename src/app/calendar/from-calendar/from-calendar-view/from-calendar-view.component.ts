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
  @Output() selectedDateChange = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
  header = FromCalendarHeaderComponent;
  private currentYear: number;
  private currentMonth: number;
  private reservedDaysSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public fromDateService: FromCalendarService) { }

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
      // selectedStartDate is in the same month as the newly chosen date
    } else if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear()){
      if (chosenDate.getDate() === this.selectedStartDate.getDate()) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      } else if (this.selectedEndDate != null && this.selectedStartDate.getDate() > chosenDate.getDate() && chosenDate.getDate() > this.getLastDayOfPreviousReservedDays(this.selectedStartDate)) {
        this.selectedStartDate = chosenDate;
      } else if (chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() < this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
      } else if (this.selectedEndDate == null && chosenDate.getDate() < this.selectedStartDate.getDate() && chosenDate.getDate() > this.getLastDayOfPreviousReservedDays(this.selectedStartDate)){
        this.selectedEndDate = this.selectedStartDate;
        this.selectedStartDate = chosenDate;
      }
      // newly chosen date is in the previous month as the selectedStartDate
    } else if ((chosenDate.getMonth() + 1 === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear())
      || (chosenDate.getMonth() === 12 && this.selectedStartDate.getMonth() === 1 && this.selectedStartDate.getFullYear() === chosenDate.getFullYear() + 1)){
      if (this.getFirstDayOfNextReservedDays(chosenDate) === 32){
        this.selectedStartDate = chosenDate;
      }
      // newly chosen date is in the next month as the selectedStartDate
    } else if ((chosenDate.getMonth() - 1 === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear())
      || (chosenDate.getMonth() === 1 && this.selectedStartDate.getMonth() === 12 && this.selectedStartDate.getFullYear() === chosenDate.getFullYear() - 1)){
      if (this.getLastDayOfPreviousReservedDays(chosenDate) === -1){
        this.selectedEndDate = chosenDate;
      }
    } else {
      this.selectedStartDate = chosenDate;
      this.selectedEndDate = null;
    }
  }

  addEvent(chosenDate: Date): void {
    this.setSelectedDates(chosenDate);
    this.selectedDateChange.emit({date: chosenDate});
    this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
  }

  setMonthView(): void{
    const today: Date = new Date();
    this.fromDateService.getReservedDays(today.getFullYear(), today.getMonth());
    this.selectedDateSubscription = this.fromDateService.getSelectedDateUpdateListener()
      .subscribe((subData) => {
        this.setSelectedDates(subData.selectedDate);
        this.fromDateService.getReservedDays(subData.selectedDate.getFullYear(), subData.selectedDate.getMonth());
      });
    this.reservedDaysSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.currentYear = subData.currentYear;
        this.currentMonth = subData.currentMonth;
        this.reservedDays = subData.reservedDays;
        this.isLoaded = false;

        this.dateClass = (cellDate, view) => {
          if (view === 'month') {
            const date = cellDate.getDate();

            let isReserved = false;
            let isPending = false;
            let isChosen = false;

            const pendingDates: number[] = [];
            const chosenDates: number[] = [];

            // if the view is in the same month as the selectedStartDate
            if (this.selectedStartDate != null && this.selectedEndDate == null && this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth()){
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
            } // if the view is in the next month as the selectedStartDate
            else if (this.selectedStartDate != null && this.selectedEndDate == null && (this.currentMonth - 1 === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.currentYear)
              || (this.currentMonth === 1 && this.selectedStartDate.getMonth() === 12 && this.selectedStartDate.getFullYear() === this.currentYear - 1)){
              // TODO: from server all the reserved dates at the same time (kell az előző havi reserved days ehhez)
              pendingDates.push(1);
              pendingDates.push(2);
              pendingDates.push(3);
              pendingDates.push(4);
              pendingDates.push(5);
            }

            if (this.selectedStartDate != null && this.selectedEndDate != null && this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth() && this.currentYear === this.selectedEndDate.getFullYear() && this.currentMonth === this.selectedEndDate.getMonth()){
              for (let i = this.selectedStartDate.getDate(); i <= this.selectedEndDate.getDate(); i++){
                chosenDates.push(i);
              }
              // selectedStartDate is in the previous month but the selectedEndDate is in the current month
            } else if (this.selectedStartDate != null && this.selectedEndDate != null && ((this.currentMonth - 1 === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.currentYear)
              || (this.currentMonth === 1 && this.selectedStartDate.getMonth() === 12 && this.selectedStartDate.getFullYear() === this.currentYear - 1)) && this.currentYear === this.selectedEndDate.getFullYear() && this.currentMonth === this.selectedEndDate.getMonth()) {
              for (let i = 1; i <= this.selectedEndDate.getDate(); i++){
                chosenDates.push(i);
              }
              // selectedStartDate is in the current month but selectedEndDate is in the next month
            } else if (this.selectedStartDate != null && this.selectedEndDate != null && ((this.currentMonth + 1 === this.selectedEndDate.getMonth() && this.selectedEndDate.getFullYear() === this.currentYear)
              || (this.currentMonth === 12 && this.selectedEndDate.getMonth() === 1 && this.selectedEndDate.getFullYear() === this.currentYear + 1)) && this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth()){
              for (let i = this.selectedStartDate.getDate(); i <= 31; i++){
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
    this.reservedDaysSubscription.unsubscribe();
    this.selectedDateSubscription.unsubscribe();
  }
}
