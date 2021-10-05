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
  private currentMonth: number;
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
    lastDayOfPreviousMonth: number,
    lastDayOfCurrentMonth: number,
    lastDayOfNextMonth: number
  }>();

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{ from: Date, to: Date }[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
     .subscribe((reservedDates) => {
        this.currentYear = year;
        this.currentMonth = month;
        let previousMonth: number;
        let beforePreviousMonth: number;
        let nextMonth: number;
        let afterNextMonth: number;
        let previousMonthYear: number;
        let nextMonthYear: number;

        if (this.currentMonth === 0) {
          previousMonth = 11;
          beforePreviousMonth = 10;
          nextMonth = 1;
          afterNextMonth = 2;
          previousMonthYear = this.currentYear - 1;
          nextMonthYear = this.currentYear;
        } else if (this.currentMonth === 1) {
          previousMonth = 0;
          beforePreviousMonth = 11;
          nextMonth = 2;
          afterNextMonth = 3;
          previousMonthYear = this.currentYear;
          nextMonthYear = this.currentYear;
        } else if (this.currentMonth === 10) {
          previousMonth = 9;
          beforePreviousMonth = 8;
          nextMonth = 11;
          afterNextMonth = 0;
          previousMonthYear = this.currentYear;
          nextMonthYear = this.currentYear;
        } else if ( this.currentMonth === 11) {
          previousMonth = 10;
          beforePreviousMonth = 9;
          nextMonth = 0;
          afterNextMonth = 1;
          previousMonthYear = this.currentYear;
          nextMonthYear = this.currentYear + 1;
        } else {
          previousMonth = this.currentMonth - 1;
          beforePreviousMonth = this.currentMonth - 2;
          nextMonth = this.currentMonth + 1;
          afterNextMonth = this.currentMonth + 2;
          previousMonthYear = this.currentYear;
          nextMonthYear = this.currentYear;
        }

        const previousMonthDate = new Date();
        const currentMonthDate = new Date();
        const nextMonthDate = new Date();

        previousMonthDate.setFullYear(previousMonthYear, previousMonth + 1, 0);
        currentMonthDate.setFullYear(this.currentYear, this.currentMonth + 1, 0);
        nextMonthDate.setFullYear(nextMonthYear, nextMonth + 1, 0);

        this.lastDayOfPreviousMonth = previousMonthDate.getDate();
        this.lastDayOfCurrentMonth = currentMonthDate.getDate();
        this.lastDayOfNextMonth = nextMonthDate.getDate();

        this.reservedDatesPreviousMonth = [];
        this.reservedDatesCurrentMonth = [];
        this.reservedDatesNextMonth = [];

        if (reservedDates[0].from != null){
          for (let i = 0; i < reservedDates.length; i++){
            if (reservedDates[i].from.getMonth() === beforePreviousMonth && reservedDates[i].to.getMonth() === previousMonth){
              for (let x = 0; x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesPreviousMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === previousMonth && reservedDates[i].to.getMonth() === previousMonth){
              for (let x = reservedDates[i].from.getDate(); x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesPreviousMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === previousMonth && reservedDates[i].to.getMonth() === this.currentMonth){
              for (let x = reservedDates[i].from.getDate(); x <= this.lastDayOfPreviousMonth + 1; x++){
                this.reservedDatesPreviousMonth.push(x);
              }
              for (let x = 0; x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesCurrentMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === this.currentMonth && reservedDates[i].to.getMonth() === this.currentMonth){
              for (let x = reservedDates[i].from.getDate(); x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesCurrentMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === this.currentMonth && reservedDates[i].to.getMonth() === nextMonth){
              for (let x = reservedDates[i].from.getDate(); x <= this.lastDayOfCurrentMonth + 1; x++){
                this.reservedDatesCurrentMonth.push(x);
              }
              for (let x = 0; x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesNextMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === nextMonth && reservedDates[i].to.getMonth() === nextMonth){
              for (let x = reservedDates[i].from.getDate(); x <= reservedDates[i].to.getDate(); x++){
                this.reservedDatesNextMonth.push(x);
              }
            } else if (reservedDates[i].from.getMonth() === nextMonth && reservedDates[i].to.getMonth() === afterNextMonth){
              for (let x = reservedDates[i].from.getDate(); x <= this.lastDayOfNextMonth + 1; x++){
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
          lastDayOfPreviousMonth: this.lastDayOfPreviousMonth,
          lastDayOfCurrentMonth: this.lastDayOfCurrentMonth,
          lastDayOfNextMonth: this.lastDayOfNextMonth
        });
      });
  }

  getSelectedDate(selectedDate: Date): void{
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
