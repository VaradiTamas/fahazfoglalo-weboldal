import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FromCalendarService {
  private selectedDate: Date = null;
  private reservedDatesPreviousMonth: number[];
  private reservedDatesCurrentMonth: number[];
  private reservedDatesNextMonth: number[];
  private currentYear: number;
  private previousMonthYear: number;
  private nextMonthYear: number;
  private currentMonth: number;
  private previousMonth: number;
  private nextMonth: number;
  private lastDayOfPreviousMonth: number;
  private lastDayOfCurrentMonth: number;
  private lastDayOfNextMonth: number;
  private previousClicked = new Subject();
  private nextClicked = new Subject();
  private selectedDateUpdated = new Subject<{ selectedDate: Date }>();
  private reservedDaysUpdated = new Subject<{
    reservedDatesPreviousMonth: number[],
    reservedDatesCurrentMonth: number[],
    reservedDatesNextMonth: number[],
    currentYear: number,
    currentMonth: number,
    nextMonthYear: number,
    nextMonth: number,
    previousMonthYear: number,
    previousMonth: number,
    lastDayOfPreviousMonth: number,
    lastDayOfCurrentMonth: number,
    lastDayOfNextMonth: number
  }>();

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{ from: {year: number, month: number, day: number}, to: {year: number, month: number, day: number} }[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
     .subscribe((reservedDates) => {
        this.currentYear = year;
        this.currentMonth = month;
        let beforePreviousMonth: number;
        let afterNextMonth: number;

        if (this.currentMonth === 0) {
          this.previousMonth = 11;
          beforePreviousMonth = 10;
          this.nextMonth = 1;
          afterNextMonth = 2;
          this.previousMonthYear = this.currentYear - 1;
          this.nextMonthYear = this.currentYear;
        } else if (this.currentMonth === 1) {
          this.previousMonth = 0;
          beforePreviousMonth = 11;
          this.nextMonth = 2;
          afterNextMonth = 3;
          this.previousMonthYear = this.currentYear;
          this.nextMonthYear = this.currentYear;
        } else if (this.currentMonth === 10) {
          this.previousMonth = 9;
          beforePreviousMonth = 8;
          this.nextMonth = 11;
          afterNextMonth = 0;
          this.previousMonthYear = this.currentYear;
          this.nextMonthYear = this.currentYear;
        } else if ( this.currentMonth === 11) {
          this.previousMonth = 10;
          beforePreviousMonth = 9;
          this.nextMonth = 0;
          afterNextMonth = 1;
          this.previousMonthYear = this.currentYear;
          this.nextMonthYear = this.currentYear + 1;
        } else {
          this.previousMonth = this.currentMonth - 1;
          beforePreviousMonth = this.currentMonth - 2;
          this.nextMonth = this.currentMonth + 1;
          afterNextMonth = this.currentMonth + 2;
          this.previousMonthYear = this.currentYear;
          this.nextMonthYear = this.currentYear;
        }

        const previousMonthDate = new Date();
        const currentMonthDate = new Date();
        const nextMonthDate = new Date();

        previousMonthDate.setFullYear(this.previousMonthYear, this.previousMonth + 1, 0);
        currentMonthDate.setFullYear(this.currentYear, this.currentMonth + 1, 0);
        nextMonthDate.setFullYear(this.nextMonthYear, this.nextMonth + 1, 0);

        this.lastDayOfPreviousMonth = previousMonthDate.getDate();
        this.lastDayOfCurrentMonth = currentMonthDate.getDate();
        this.lastDayOfNextMonth = nextMonthDate.getDate();

        this.reservedDatesPreviousMonth = [];
        this.reservedDatesCurrentMonth = [];
        this.reservedDatesNextMonth = [];

        if (reservedDates.length > 0){
          for (let i = 0; i < reservedDates.length; i++){
            if (reservedDates[i].from.month === beforePreviousMonth && reservedDates[i].to.month === this.previousMonth){
              for (let x = 0; x < reservedDates[i].to.day; x++){
                this.reservedDatesPreviousMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.previousMonth && reservedDates[i].to.month === this.previousMonth){
              for (let x = reservedDates[i].from.day; x < reservedDates[i].to.day; x++){
                this.reservedDatesPreviousMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.previousMonth && reservedDates[i].to.month === this.currentMonth){
              for (let x = reservedDates[i].from.day; x <= this.lastDayOfPreviousMonth; x++){
                this.reservedDatesPreviousMonth.push(x);
              }
              for (let x = 0; x <= reservedDates[i].to.day; x++){
                this.reservedDatesCurrentMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.currentMonth && reservedDates[i].to.month === this.currentMonth){
              for (let x = reservedDates[i].from.day; x < reservedDates[i].to.day; x++){
                this.reservedDatesCurrentMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.currentMonth && reservedDates[i].to.month === this.nextMonth){
              for (let x = reservedDates[i].from.day; x <= this.lastDayOfCurrentMonth; x++){
                this.reservedDatesCurrentMonth.push(x);
              }
              for (let x = 0; x <= reservedDates[i].to.day; x++){
                this.reservedDatesNextMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.nextMonth && reservedDates[i].to.month === this.nextMonth){
              for (let x = reservedDates[i].from.day; x < reservedDates[i].to.day; x++){
                this.reservedDatesNextMonth.push(x);
              }
            } else if (reservedDates[i].from.month === this.nextMonth && reservedDates[i].to.month === afterNextMonth){
              for (let x = reservedDates[i].from.day; x <= this.lastDayOfNextMonth; x++){
                this.reservedDatesNextMonth.push(x);
              }
            }
          }
        }

        this.reservedDatesPreviousMonth = this.reservedDatesPreviousMonth.sort((n1, n2) => n1 - n2);
        this.reservedDatesCurrentMonth = this.reservedDatesCurrentMonth.sort((n1, n2) => n1 - n2);
        this.reservedDatesNextMonth = this.reservedDatesNextMonth.sort((n1, n2) => n1 - n2);

        this.reservedDaysUpdated.next({
          reservedDatesPreviousMonth: [...this.reservedDatesPreviousMonth],
          reservedDatesCurrentMonth: [...this.reservedDatesCurrentMonth],
          reservedDatesNextMonth: [...this.reservedDatesNextMonth],
          currentYear: this.currentYear,
          currentMonth: this.currentMonth,
          nextMonthYear: this.nextMonthYear,
          nextMonth: this.nextMonth,
          previousMonthYear: this.previousMonthYear,
          previousMonth: this.previousMonth,
          lastDayOfPreviousMonth: this.lastDayOfPreviousMonth,
          lastDayOfCurrentMonth: this.lastDayOfCurrentMonth,
          lastDayOfNextMonth: this.lastDayOfNextMonth
        });
      });
  }

  selectedDateChanged(selectedDate: Date): void{
    this.selectedDate = selectedDate;
    this.selectedDateUpdated.next({selectedDate: this.selectedDate});
  }

  onPreviousClicked(): void {
    this.previousClicked.next();
  }

  onNextClicked(): void{
    this.nextClicked.next();
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }

  getSelectedDateUpdateListener(){
    return this.selectedDateUpdated.asObservable();
  }

  getPreviousClickedListener(){
    return this.previousClicked.asObservable();
  }

  getNextClickedListener(){
    return this.nextClicked.asObservable();
  }
}
