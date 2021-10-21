import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {Subscription} from 'rxjs';
import {FirstCalendarService} from '../services/first-calendar-service';
import {SecondCalendarService} from '../services/second-calendar-service';
import {FromCalendarHeaderComponent} from '../headers/first-calendar-header/from-calendar-header.component';
import {ToCalendarHeaderComponent} from '../headers/second-calendar-header/to-calendar-header.component';

@Component({
  selector: 'app-from-calendar',
  templateUrl: './from-calendar-view.component.html',
  styleUrls: ['./from-calendar-view.component.css']
})
export class FromCalendarViewComponent implements OnInit, OnDestroy{
  @Output() selectedStartDateChange = new EventEmitter<{date: Date}>();
  @Output() selectedEndDateChange = new EventEmitter<{date: Date}>();
  @Input() calendarType: string;
  isLoaded = false;
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
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
  private initialDate = new Date();
  private header;
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

  constructor(public fromDateService: FirstCalendarService, public toDateService: SecondCalendarService) { }

  ngOnInit(): void {
    if (this.calendarType === 'first'){
      this.header = FromCalendarHeaderComponent;
      this.fromDateService.getReservedDays(this.initialDate.getFullYear(), this.initialDate.getMonth());
      this.setFirstMonthView();
    } else if (this.calendarType === 'second'){
      this.header = ToCalendarHeaderComponent;
      this.initialDate.setMonth(this.initialDate.getMonth() + 1);
      this.toDateService.getReservedDays(this.initialDate.getFullYear(), this.initialDate.getMonth());
      this.setSecondMonthView();
    }
  }

  private getFirstDayOfNextReservedDays(selectedDate: Date, month: string): number{
    let onlySecondHalfIsReserved: number[] = [];
    let lastDayOfMonth: number;
    if (month === 'current'){
      onlySecondHalfIsReserved = [...this.onlySecondHalfOfTheDayIsReservedCurrentMonth];
      lastDayOfMonth = this.lastDayOfCurrentMonth;
    } else if (month === 'previous'){
      onlySecondHalfIsReserved = [...this.onlySecondHalfOfTheDayIsReservedPreviousMonth];
      lastDayOfMonth = this.lastDayOfPreviousMonth;
    } else if (month === 'next'){
      onlySecondHalfIsReserved = [...this.onlySecondHalfOfTheDayIsReservedNextMonth];
      lastDayOfMonth = this.lastDayOfNextMonth;
    }
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesBiggerThanSelectedDate: number[] = [];
    onlySecondHalfIsReserved.forEach((reservedDay) => {
      if (dayOfSelectedDate < reservedDay) {
        reservedDatesBiggerThanSelectedDate.push(reservedDay);
      }
    });
    let smallestOfReservedDatesBiggerThanSelectedDate = lastDayOfMonth + 1;
    reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
      if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
        smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
      }
    });
    return smallestOfReservedDatesBiggerThanSelectedDate;
  }

  private getLastDayOfPreviousReservedDays(selectedDate: Date, month: string): number{
    let onlyFirstHalfIsReserved: number[] = [];
    if (month === 'current'){
      onlyFirstHalfIsReserved = [...this.onlyFirstHalfOfTheDayIsReservedCurrentMonth];
    } else if (month === 'previous'){
      onlyFirstHalfIsReserved = [...this.onlyFirstHalfOfTheDayIsReservedPreviousMonth];
    } else if (month === 'next'){
      onlyFirstHalfIsReserved = [...this.onlyFirstHalfOfTheDayIsReservedNextMonth];
    }
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesSmallerThanSelectedDate: number[] = [];
    onlyFirstHalfIsReserved.forEach((reservedDay) => {
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
    // selectedStartDate is null
    if (this.selectedStartDate == null) {
      if (chosenDate.getMonth() === this.currentMonth && chosenDate.getFullYear() === this.currentYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
        }
      } else if (chosenDate.getMonth() === this.previousMonth && chosenDate.getFullYear() === this.previousMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedPreviousMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesPreviousMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
        }
      } else if (chosenDate.getMonth() === this.nextMonth && chosenDate.getFullYear() === this.nextMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesNextMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
        }
      }
      // selectedEndDate is not null (also selectedStartDate is not null)
    } else if (this.selectedEndDate != null){
      if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear() && this.selectedStartDate.getDate() === chosenDate.getDate()){
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      } else if (chosenDate.getMonth() === this.currentMonth && chosenDate.getFullYear() === this.currentYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      } else if (chosenDate.getMonth() === this.previousMonth && chosenDate.getFullYear() === this.previousMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedPreviousMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesPreviousMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      } else if (chosenDate.getMonth() === this.nextMonth && chosenDate.getFullYear() === this.nextMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesNextMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      }
      // only selectedStartDate is not null
    } else {
      // choosing the same date as the selectedStartDate
      if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear() && this.selectedStartDate.getDate() === chosenDate.getDate()) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        // selectedStartDate and the newly chosen date are in the current month
      } else if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear() && this.selectedStartDate.getFullYear() === this.currentYear && this.selectedStartDate.getMonth() === this.currentMonth) {
        if (chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() <= this.getFirstDayOfNextReservedDays(this.selectedStartDate, 'current')) {
          this.selectedEndDate = chosenDate;
        } else if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
        // selectedStartDate is in the next month as the newly chosen date and current month
      } else if (this.nextMonth === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.nextMonthYear && chosenDate.getMonth() === this.currentMonth && chosenDate.getFullYear() === this.currentYear) {
        if (!this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate()) && !this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
        // selectedStartDate is in the previous month as the newly selected date and current month
      } else if (this.previousMonth === this.selectedStartDate.getMonth() && this.selectedStartDate.getFullYear() === this.previousMonthYear && chosenDate.getMonth() === this.currentMonth && chosenDate.getFullYear() === this.currentYear) {
        if (!this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate()) && !this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate())) {
          if (!this.isThereReservedDateBetween(this.selectedStartDate, chosenDate, 'second')) {
            if (this.calendarType === 'first') {
              this.selectedStartDate = chosenDate;
              this.selectedEndDate = null;
            } else {
              this.selectedEndDate = chosenDate;
            }
          } else if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate())) {
            this.selectedStartDate = chosenDate;
            this.selectedEndDate = null;
          }
        }
        // selectedStartDate and the newly selected date is in the previous month as the current month
      } else if (chosenDate.getMonth() === this.previousMonth && chosenDate.getFullYear() === this.previousMonthYear && this.selectedStartDate.getMonth() === this.previousMonth && this.selectedStartDate.getFullYear() === this.previousMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedPreviousMonth.includes(this.selectedStartDate.getDate()) && !this.fullyReservedDatesPreviousMonth.includes(this.selectedStartDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        } else if (chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() <= this.getFirstDayOfNextReservedDays(this.selectedStartDate, 'previous')) {
          this.selectedEndDate = chosenDate;
        }
        // selectedStartDate and the newly selected date is in the next month as the current month
      } else if (chosenDate.getMonth() === this.nextMonth && chosenDate.getFullYear() === this.nextMonthYear && this.selectedStartDate.getMonth() === this.nextMonth && this.selectedStartDate.getFullYear() === this.nextMonthYear) {
        if (chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() <= this.getFirstDayOfNextReservedDays(this.selectedStartDate, 'next')) {
          this.selectedEndDate = chosenDate;
        } else if (!this.fullyReservedDatesNextMonth.includes(chosenDate.getDate()) && !this.onlySecondHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
        // newly chosen date is in the next month as the current month and selectedStartDate
      } else if (chosenDate.getMonth() === this.nextMonth && chosenDate.getFullYear() === this.nextMonthYear && this.selectedStartDate.getMonth() === this.currentMonth && this.selectedStartDate.getFullYear() === this.currentYear) {
        if (!this.fullyReservedDatesNextMonth.includes(chosenDate.getDate()) && !this.onlyFirstHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate())) {
          if (!this.isThereReservedDateBetween(this.selectedStartDate, chosenDate, 'first')) {
            this.selectedEndDate = chosenDate;
          } else if (!this.fullyReservedDatesNextMonth.includes(chosenDate.getDate()) && !this.onlySecondHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate())) {
            this.selectedStartDate = chosenDate;
            this.selectedEndDate = null;
          }
        }
        // newly chosen date is in the previous month as the current month and selectedStartDate
      } else if (chosenDate.getMonth() === this.previousMonth && chosenDate.getFullYear() === this.previousMonthYear && this.selectedStartDate.getMonth() === this.currentMonth && this.selectedStartDate.getFullYear() === this.currentYear) {
        if (!this.fullyReservedDatesPreviousMonth.includes(chosenDate.getDate()) && !this.onlySecondHalfOfTheDayIsReservedPreviousMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      } else if (chosenDate.getMonth() === this.currentMonth && chosenDate.getFullYear() === this.currentYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedCurrentMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesCurrentMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      } else if (chosenDate.getMonth() === this.previousMonth && chosenDate.getFullYear() === this.previousMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedPreviousMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesPreviousMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
        }
      } else if (chosenDate.getMonth() === this.nextMonth && chosenDate.getFullYear() === this.nextMonthYear) {
        if (!this.onlySecondHalfOfTheDayIsReservedNextMonth.includes(chosenDate.getDate()) && !this.fullyReservedDatesNextMonth.includes(chosenDate.getDate())) {
          this.selectedStartDate = chosenDate;
          this.selectedEndDate = null;
          console.log(this.currentMonth);
        }
      }
    }
  }

  private isThereReservedDateBetween(from: Date, to: Date, calendar: string): boolean{
    let onlySecondHalfOfTheDayIsReservedFrom: number[] = [];
    let onlySecondHalfOfTheDayIsReservedTo: number[] = [];
    if (calendar === 'first'){
      onlySecondHalfOfTheDayIsReservedFrom = [...this.onlySecondHalfOfTheDayIsReservedCurrentMonth];
      onlySecondHalfOfTheDayIsReservedTo = [...this.onlySecondHalfOfTheDayIsReservedNextMonth];
    } else if (calendar === 'second'){
      onlySecondHalfOfTheDayIsReservedFrom = [...this.onlySecondHalfOfTheDayIsReservedPreviousMonth];
      onlySecondHalfOfTheDayIsReservedTo = [...this.onlySecondHalfOfTheDayIsReservedCurrentMonth];
    }
    let isThere = false;
    onlySecondHalfOfTheDayIsReservedFrom.forEach(reservedDay => {
      if (reservedDay > from.getDate()){
        isThere = true;
      }
    });
    onlySecondHalfOfTheDayIsReservedTo.forEach(reservedDay => {
      if (reservedDay < to.getDate()){
        isThere = true;
      }
    });
    return isThere;
  }

  addEvent(chosenDate: Date): void {
    this.setSelectedDates(chosenDate);
    if (this.calendarType === 'first'){
      this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
      this.toDateService.selectedDateChanged(chosenDate);
    } else if (this.calendarType === 'second'){
      this.toDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
      this.fromDateService.selectedDateChanged(chosenDate);
    }
    this.selectedStartDateChange.emit({date: this.selectedStartDate});
    this.selectedEndDateChange.emit({date: this.selectedEndDate});
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
        if (reservedDates[0] !== reservedDates[1] - 1){
          onlyFirstHalfOfTheDayIsReserved.push(reservedDates[0] + 1);
        }
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

  private initSubscription(subData): void{
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

    this.dateClass = (cellDate, view) => {
      if (view === 'month') {
        const date = cellDate.getDate();

        let isFullyReserved = false;
        let isFirstHalfReservedSecondHalfChosen = false;
        let isFirstHalfChosenSecondHalfReserved = false;
        let isFullyChosen = false;
        let isFirstHalfFreeSecondHalfChosen = false;
        let isFirstHalfFreeSecondHalfReserved = false;
        let isFirstHalfReservedSecondHalfFree = false;
        let isFirstHalfChosenSecondHalfFree = false;

        const firstHalfReservedSecondHalfChosen: number[] = [];
        const firstHalfChosenSecondHalfReserved: number[] = [];
        const fullyChosenDates: number[] = [];
        const firstHalfFreeSecondHalfChosen: number[] = [];
        const firstHalfFreeSecondHalfReserved: number[] = [];
        const firstHalfReservedSecondHalfFree: number[] = [];
        const firstHalfChosenSecondHalfFree: number[] = [];

        // only the startDate is chosen
        if (this.selectedStartDate != null && this.selectedEndDate == null){
          if (this.currentYear === this.selectedStartDate.getFullYear() && this.currentMonth === this.selectedStartDate.getMonth()){
            if (this.onlyFirstHalfOfTheDayIsReservedCurrentMonth.includes(this.selectedStartDate.getDate())){
              firstHalfReservedSecondHalfChosen.push(this.selectedStartDate.getDate());
            } else {
              firstHalfFreeSecondHalfChosen.push(this.selectedStartDate.getDate());
            }
          }
        }

        // both the start and end dates are chosen
        if (this.selectedEndDate != null){
          // both the selectedStartDate and the selectedEndDate are in the current month
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
          if (!firstHalfChosenSecondHalfReserved.includes(reservedDay)){
            firstHalfFreeSecondHalfReserved.push(reservedDay);
          }
        });

        this.fullyReservedDatesCurrentMonth.forEach((day) => {
          if (date === day) {
            isFullyReserved = true;
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
        } else if (isFullyChosen){
          return 'fully-chosen-dates';
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
      const today = new Date();
      let isSelectable = true;

      if (this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()) {
        for (let i = 1; i < this.lastDayOfCurrentMonth; i++){
          if (date === i && i < today.getDate()) {
            isSelectable = false;
          }
        }
      }

      return isSelectable;
    };

    this.isLoaded = true;
  }

  setFirstMonthView(): void{
    this.selectedDateSubscription = this.fromDateService.getSelectedDateUpdateListener()
      .subscribe((subData) => {
        this.setSelectedDates(subData.selectedDate);
        this.fromDateService.getReservedDays(this.currentYear, this.currentMonth);
      });
    this.reservedDaysSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.initSubscription(subData);
      });
  }

  setSecondMonthView(): void{
    this.selectedDateSubscription = this.toDateService.getSelectedDateUpdateListener()
      .subscribe((subData) => {
        this.setSelectedDates(subData.selectedDate);
        this.toDateService.getReservedDays(this.currentYear, this.currentMonth);
      });
    this.reservedDaysSubscription = this.toDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        this.initSubscription(subData);
      });
  }

  ngOnDestroy(): void {
    this.reservedDaysSubscription.unsubscribe();
    this.selectedDateSubscription.unsubscribe();
  }
}
