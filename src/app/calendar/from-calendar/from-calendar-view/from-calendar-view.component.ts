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
  private onlySecondHalfOfTheDayIsReservedPreviousMonth: number[] = [];
  private fullyReservedDatesPreviousMonth: number[] = [];
  private onlyFirstHalfOfTheDayIsReservedPreviousMonth: number[] = [];
  private onlySecondHalfOfTheDayIsReservedCurrentMonth: number[] = [];
  private fullyReservedDatesCurrentMonth: number[] = [];
  private onlyFirstHalfOfTheDayIsReservedCurrentMonth: number[] = [];
  private onlySecondHalfOfTheDayIsReservedNextMonth: number[] = [];
  private fullyReservedDatesNextMonth: number[] = [];
  private onlyFirstHalfOfTheDayIsReservedNextMonth: number[] = [];
  private lastDayOfPreviousMonth: number;
  private lastDayOfCurrentMonth: number;
  private lastDayOfNextMonth: number;
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
  header = FromCalendarHeaderComponent;
  private currentYear: number;
  private previousMonthYear: number;
  private nextMonthYear: number;
  private currentMonth: number;
  private previousMonth: number;
  private nextMonth: number;
  private reservedDaysSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public fromDateService: FromCalendarService) { }

  ngOnInit(): void {
    const today: Date = new Date();
    this.fromDateService.getReservedDays(today.getFullYear(), today.getMonth());
    this.setMonthView();
  }

  private getFirstDayOfNextReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesBiggerThanSelectedDate: number[] = [];
    this.onlySecondHalfOfTheDayIsReservedCurrentMonth.forEach((reservedDay) => {
      if (dayOfSelectedDate < reservedDay) {
        reservedDatesBiggerThanSelectedDate.push(reservedDay);
      }
    });
    let smallestOfReservedDatesBiggerThanSelectedDate = this.lastDayOfCurrentMonth + 1;
    reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
      if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
        smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
      }
    });
    return smallestOfReservedDatesBiggerThanSelectedDate;
  }

  private getLastDayOfPreviousReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesSmallerThanSelectedDate: number[] = [];
    this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.forEach((reservedDay) => {
      if (dayOfSelectedDate > reservedDay) {
        reservedDatesSmallerThanSelectedDate.push(reservedDay);
      }
    });
    let biggestOfReservedDatesSmallerThanSelectedDate = 1;
    reservedDatesSmallerThanSelectedDate.forEach((reservedDay) => {
      if (reservedDay > biggestOfReservedDatesSmallerThanSelectedDate) {
        biggestOfReservedDatesSmallerThanSelectedDate = reservedDay;
      }
    });
    return biggestOfReservedDatesSmallerThanSelectedDate;
  }

  setSelectedDates(chosenDate: Date): void{
    if (this.selectedStartDate == null && !this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())){
      this.selectedStartDate = chosenDate;
      // selectedStartDate is in the same month as the newly chosen date
    } else if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear()){
      if (chosenDate.getDate() === this.selectedStartDate.getDate()) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      } else if (this.selectedEndDate != null && this.selectedStartDate.getDate() > chosenDate.getDate() && chosenDate.getDate() >= this.getLastDayOfPreviousReservedDays(this.selectedEndDate)) {
        this.selectedStartDate = chosenDate;
      } else if (chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() <= this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
      } else if (this.selectedEndDate == null && chosenDate.getDate() < this.selectedStartDate.getDate() && chosenDate.getDate() >= this.getLastDayOfPreviousReservedDays(this.selectedStartDate)){
        this.selectedEndDate = this.selectedStartDate;
        this.selectedStartDate = chosenDate;
      }
      // newly chosen date is in the previous month as the selectedStartDate
    } else if (this.nextMonth === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.nextMonthYear){
      if (!this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate()) && !this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate())){
        if (!this.isThereReservedDateBetween(chosenDate, this.selectedStartDate)){
          if (this.selectedEndDate === null){
            this.selectedEndDate = this.selectedStartDate;
            this.selectedStartDate = chosenDate;
          } else {
            this.selectedStartDate = chosenDate;
          }
        }
      }
      // newly chosen date is in the next month as the selectedStartDate
    } else if (this.previousMonth === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.previousMonthYear){
      if (!this.isThereReservedDateBetween(this.selectedStartDate, chosenDate)){
        this.selectedEndDate = chosenDate;
      }
    } else if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())){
      this.selectedStartDate = chosenDate;
      this.selectedEndDate = null;
    }
  }

  private isThereReservedDateBetween(from: Date, to: Date): boolean{
    this.onlySecondHalfOfTheDayIsReservedCurrentMonth.forEach(reservedDay => {
      if (reservedDay > from.getDate()){
        return true;
      }
    });
    this.onlySecondHalfOfTheDayIsReservedNextMonth.forEach(reservedDay => {
      if (reservedDay < to.getDate()){
        return true;
      }
    });
    return false;
  }

  addEvent(chosenDate: Date): void {
    this.setSelectedDates(chosenDate);
    this.selectedDateChange.emit({date: chosenDate});
    this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
  }

  private setReservedDates(reservedDates: number[], month: string): void{
    let fullyReservedDates: number[] = [];
    let onlyFirstHalfOfTheDayIsReserved: number[] = [];
    let onlySecondHalfOfTheDayIsReserved: number[] = [];
    let lastDayOfMonth: number;

    if (month === 'previous'){
      lastDayOfMonth = this.lastDayOfPreviousMonth;
    } else if (month === 'current'){
      lastDayOfMonth = this.lastDayOfCurrentMonth;
    } else if (month === 'next'){
      lastDayOfMonth = this.lastDayOfNextMonth;
    }

    if (reservedDates.length === 1) {
      if (reservedDates[0] === 0) {
        onlyFirstHalfOfTheDayIsReserved.push(1);
      } else if (reservedDates[0] === lastDayOfMonth) {
        onlySecondHalfOfTheDayIsReserved.push(reservedDates[0]);
      } else {
        onlySecondHalfOfTheDayIsReserved.push(reservedDates[0]);
        onlyFirstHalfOfTheDayIsReserved.push(reservedDates[0] + 1);
      }
    } else if (reservedDates.length === 2) {
      if (reservedDates[1] - reservedDates[0] === 1) {
        if (reservedDates[0] === 0) {
          fullyReservedDates.push(1);
          onlyFirstHalfOfTheDayIsReserved.push(2);
        } else if (reservedDates[1] === lastDayOfMonth) {
          onlySecondHalfOfTheDayIsReserved.push(reservedDates[0]);
          fullyReservedDates.push(reservedDates[1]);
        } else {
          onlySecondHalfOfTheDayIsReserved.push(reservedDates[0]);
          fullyReservedDates.push(reservedDates[1]);
          onlyFirstHalfOfTheDayIsReserved.push(reservedDates[1] + 1);
        }
      }
    } else if (reservedDates.length > 2) {
      if (reservedDates[0] !== 0){
        onlySecondHalfOfTheDayIsReserved.push(reservedDates[0]);
      }
      if (reservedDates[0] === 0){
        if (reservedDates[1] === 1){
          fullyReservedDates.push(1);
        } else {
          onlyFirstHalfOfTheDayIsReserved.push(1);
        }
      }
      if (reservedDates[reservedDates.length - 1] !== lastDayOfMonth){
        if ((reservedDates[reservedDates.length - 1] === reservedDates[reservedDates.length - 2] + 1)) {
          fullyReservedDates.push(reservedDates[reservedDates.length - 1]);
        } else {
          onlySecondHalfOfTheDayIsReserved.push(reservedDates[reservedDates.length - 1]);
        }
        onlyFirstHalfOfTheDayIsReserved.push(reservedDates[reservedDates.length - 1] + 1);
      }
      if (reservedDates[reservedDates.length - 1] === lastDayOfMonth){
        if (reservedDates[reservedDates.length - 2] === lastDayOfMonth - 1){
          fullyReservedDates.push(lastDayOfMonth);
        } else {
          onlySecondHalfOfTheDayIsReserved.push(lastDayOfMonth);
        }
      }
      for (let i = 1; i < reservedDates.length - 1; i++){
        if ((reservedDates[i] === reservedDates[i - 1] + 1)) {
          fullyReservedDates.push(reservedDates[i]);
        } else if ((reservedDates[i] !== reservedDates[i - 1] + 1)) {
          onlySecondHalfOfTheDayIsReserved.push(reservedDates[i]);
        }
        if ((reservedDates[i] !== reservedDates[i + 1] - 1)){
          onlyFirstHalfOfTheDayIsReserved.push(reservedDates[i] + 1);
        }
      }
    }

    onlySecondHalfOfTheDayIsReserved.filter((v, i, a) => a.indexOf(v) === i);
    fullyReservedDates.filter((v, i, a) => a.indexOf(v) === i);
    onlyFirstHalfOfTheDayIsReserved.filter((v, i, a) => a.indexOf(v) === i);

    onlySecondHalfOfTheDayIsReserved = onlySecondHalfOfTheDayIsReserved.sort((n1, n2) => n1 - n2);
    fullyReservedDates = fullyReservedDates.sort((n1, n2) => n1 - n2);
    onlyFirstHalfOfTheDayIsReserved = onlyFirstHalfOfTheDayIsReserved.sort((n1, n2) => n1 - n2);

    if (month === 'previous'){
      this.fullyReservedDatesPreviousMonth = [...fullyReservedDates];
      this.onlyFirstHalfOfTheDayIsReservedPreviousMonth = [...onlyFirstHalfOfTheDayIsReserved];
      this.onlySecondHalfOfTheDayIsReservedPreviousMonth = [...onlySecondHalfOfTheDayIsReserved];
    } else if (month === 'current'){
      this.fullyReservedDatesCurrentMonth = [...fullyReservedDates];
      this.onlyFirstHalfOfTheDayIsReservedCurrentMonth = [...onlyFirstHalfOfTheDayIsReserved];
      this.onlySecondHalfOfTheDayIsReservedCurrentMonth = [...onlySecondHalfOfTheDayIsReserved];
    } else if (month === 'next'){
      this.fullyReservedDatesNextMonth = [...fullyReservedDates];
      this.onlyFirstHalfOfTheDayIsReservedNextMonth = [...onlyFirstHalfOfTheDayIsReserved];
      this.onlySecondHalfOfTheDayIsReservedNextMonth = [...onlySecondHalfOfTheDayIsReserved];
    }
  }

  setMonthView(): void{
    this.selectedDateSubscription = this.fromDateService.getSelectedDateUpdateListener()
      .subscribe((subData) => {
        this.setSelectedDates(subData.selectedDate);
        this.fromDateService.getReservedDays(subData.selectedDate.getFullYear(), subData.selectedDate.getMonth());
      });
    this.reservedDaysSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.isLoaded = false;
        this.currentYear = subData.currentYear;
        this.currentMonth = subData.currentMonth;
        this.previousMonthYear = subData.previousMonthYear;
        this.previousMonth = subData.previousMonth;
        this.nextMonthYear = subData.nextMonthYear;
        this.nextMonth = subData.nextMonth;
        this.lastDayOfPreviousMonth = subData.lastDayOfPreviousMonth;
        this.lastDayOfCurrentMonth = subData.lastDayOfCurrentMonth;
        this.lastDayOfNextMonth = subData.lastDayOfNextMonth;

        this.setReservedDates(subData.reservedDatesPreviousMonth, 'previous');
        this.setReservedDates(subData.reservedDatesCurrentMonth, 'current');
        this.setReservedDates(subData.reservedDatesNextMonth, 'next');


        console.log(this.onlySecondHalfOfTheDayIsReservedCurrentMonth);
        console.log(this.fullyReservedDatesCurrentMonth);
        console.log(this.onlyFirstHalfOfTheDayIsReservedCurrentMonth);

        this.dateClass = (cellDate, view) => {
          if (view === 'month') {
            const date = cellDate.getDate();

            let isFullyReserved = false;
            let isFirstHalfPendingSecondHalfReserved = false;
            let isFirstHalfReservedSecondHalfChosen = false;
            let isFirstHalfChosenSecondHalfReserved = false;
            let isFullyPending = false;
            let isFullyChosen = false;
            let isFirstHalfFreeSecondHalfChosen = false;
            let isFirstHalfFreeSecondHalfReserved = false;
            let isFirstHalfReservedSecondHalfFree = false;
            let isFirstHalfChosenSecondHalfFree = false;

            const fullyPending: number[] = [];
            const firstHalfPendingSecondHalfReserved: number[] = [];
            const firstHalfReservedSecondHalfChosen: number[] = [];
            const firstHalfChosenSecondHalfReserved: number[] = [];
            const fullyChosenDates: number[] = [];
            const firstHalfFreeSecondHalfChosen: number[] = [];
            const firstHalfFreeSecondHalfReserved: number[] = [];
            const firstHalfReservedSecondHalfFree: number[] = [];
            const firstHalfChosenSecondHalfFree: number[] = [];

            // if the view is in the same month as the selectedStartDate
            if (this.selectedStartDate != null && this.selectedEndDate == null && this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth()){
              const dayOfSelectedStartDate = this.selectedStartDate.getDate();
              const firstDayOfReservedDate = this.getFirstDayOfNextReservedDays(this.selectedStartDate);

              for (let i = dayOfSelectedStartDate + 1; i < firstDayOfReservedDate; i++){
                fullyPending.push(i);
              }

              if (firstDayOfReservedDate === this.lastDayOfCurrentMonth + 1){
                fullyPending.push(this.lastDayOfCurrentMonth);
              } else {
                firstHalfPendingSecondHalfReserved.push(firstDayOfReservedDate);
              }

              if (this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedStartDate.getDate())){
                firstHalfReservedSecondHalfChosen.push(this.selectedStartDate.getDate());
              } else {
                firstHalfFreeSecondHalfChosen.push(this.selectedStartDate.getDate());
              }
            } // if the view is in the next month as the selectedStartDate
            else if (this.selectedStartDate != null && this.selectedEndDate == null && this.selectedStartDate.getMonth() === this.previousMonth && this.selectedStartDate. getFullYear() === this.previousMonthYear){
              if (this.getFirstDayOfNextReservedDays(this.selectedStartDate) === this.lastDayOfCurrentMonth + 1){
                const firstDayOfReservedDate = this.getFirstDayOfNextReservedDays(this.selectedStartDate);
                for (let i = this.selectedStartDate.getDate() + 1; i < firstDayOfReservedDate; i++){
                  fullyPending.push(i);
                }
                if (firstDayOfReservedDate === this.lastDayOfCurrentMonth + 1){
                  fullyPending.push(this.lastDayOfCurrentMonth);
                } else {
                  firstHalfPendingSecondHalfReserved.push(firstDayOfReservedDate);
                }
              }
            }

            if (this.selectedStartDate != null && this.selectedEndDate != null){
              if (this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth() && this.currentYear === this.selectedEndDate.getFullYear() && this.currentMonth === this.selectedEndDate.getMonth()){
                for (let i = this.selectedStartDate.getDate() + 1; i < this.selectedEndDate.getDate(); i++){
                  fullyChosenDates.push(i);
                }
                if (this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedStartDate.getDate())){
                  firstHalfReservedSecondHalfChosen.push(this.selectedStartDate.getDate());
                } else {
                  firstHalfFreeSecondHalfChosen.push(this.selectedStartDate.getDate());
                }
                if (this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedEndDate.getDate())){
                  firstHalfChosenSecondHalfReserved.push(this.selectedEndDate.getDate());
                } else {
                  firstHalfChosenSecondHalfFree.push(this.selectedEndDate.getDate());
                }
                // selectedStartDate is in the previous month but the selectedEndDate is in the current month
              } else if (this.previousMonthYear === this.selectedStartDate.getFullYear() && this.previousMonth === this.selectedStartDate.getMonth() && this.currentYear === this.selectedEndDate.getFullYear() && this.currentMonth === this.selectedEndDate.getMonth()) {
                for (let i = 1; i < this.selectedEndDate.getDate(); i++){
                  fullyChosenDates.push(i);
                }
                if (this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedEndDate.getDate())){
                  firstHalfChosenSecondHalfReserved.push(this.selectedEndDate.getDate());
                } else {
                  firstHalfChosenSecondHalfFree.push(this.selectedEndDate.getDate());
                }
                // selectedStartDate is in the current month but selectedEndDate is in the next month
              } else if (this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth() && this.selectedEndDate.getFullYear() === this.nextMonthYear && this.selectedEndDate.getMonth() === this.nextMonth){
                for (let i = this.selectedStartDate.getDate() + 1; i <= this.lastDayOfCurrentMonth; i++){
                  fullyChosenDates.push(i);
                }
                if (this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedStartDate.getDate())){
                  firstHalfReservedSecondHalfChosen.push(this.selectedStartDate.getDate());
                } else {
                  firstHalfFreeSecondHalfChosen.push(this.selectedStartDate.getDate());
                }
              }
            }

            this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.forEach(reservedDay => {
              if (!firstHalfReservedSecondHalfChosen.includes(reservedDay)){
                firstHalfReservedSecondHalfFree.push(reservedDay);
              }
            });

            this.onlySecondHalfOfTheDayIsReservedCurrentMonth.forEach(reservedDay => {
              if (!firstHalfChosenSecondHalfReserved.includes(reservedDay) && !firstHalfPendingSecondHalfReserved.includes(reservedDay)){
                firstHalfFreeSecondHalfReserved.push(reservedDay);
              }
            });

            this.fullyReservedDatesCurrentMonth.forEach((day) => {
              if (date === day) {
                isFullyReserved = true;
              }
            });

            fullyPending.forEach((day) => {
              if (date === day) {
                isFullyPending = true;
              }
            });

            firstHalfPendingSecondHalfReserved.forEach((day) => {
              if (date === day) {
                isFirstHalfPendingSecondHalfReserved = true;
              }
            });

            firstHalfReservedSecondHalfChosen.forEach((day) => {
              if (date === day) {
                isFirstHalfReservedSecondHalfChosen = true;
              }
            });

            firstHalfChosenSecondHalfReserved.forEach((day) => {
              if (date === day) {
                isFirstHalfChosenSecondHalfReserved = true;
              }
            });

            firstHalfFreeSecondHalfChosen.forEach((day) => {
              if (date === day) {
                isFirstHalfFreeSecondHalfChosen = true;
              }
            });

            firstHalfFreeSecondHalfReserved.forEach((day) => {
              if (date === day) {
                isFirstHalfFreeSecondHalfReserved = true;
              }
            });

            firstHalfReservedSecondHalfFree.forEach((day) => {
              if (date === day) {
                isFirstHalfReservedSecondHalfFree = true;
              }
            });

            firstHalfChosenSecondHalfFree.forEach((day) => {
              if (date === day) {
                isFirstHalfChosenSecondHalfFree = true;
              }
            });

            fullyChosenDates.forEach((day) => {
              if (date === day) {
                isFullyChosen = true;
              }
            });

            if (isFullyReserved) {
              return 'fully-reserved-dates';
            } else if (isFullyPending) {
              return 'fully-pending-dates';
            } else if (isFullyChosen){
              return 'fully-chosen-dates';
            } else if (isFirstHalfPendingSecondHalfReserved){
              return 'first-half-pending-second-half-reserved';
            } else if (isFirstHalfReservedSecondHalfChosen){
              return 'first-half-reserved-second-half-chosen';
            } else if (isFirstHalfChosenSecondHalfReserved){
              return 'first-half-chosen-second-half-reserved';
            } else if (isFirstHalfFreeSecondHalfChosen){
              return 'first-half-free-second-half-chosen';
            } else if (isFirstHalfFreeSecondHalfReserved){
              return 'first-half-free-second-half-reserved';
            } else if (isFirstHalfReservedSecondHalfFree){
              return 'first-half-reserved-second-half-free';
            } else if (isFirstHalfChosenSecondHalfFree){
              return 'first-half-chosen-second-half-free';
            } else {
              return 'fully-free-dates';
            }
          }
        };

        this.dateFilter = (d: Date | null): boolean => {
          const date = (d || new Date()).getDate();

          let isFree = true;

          this.fullyReservedDatesCurrentMonth.forEach((day) => {
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
