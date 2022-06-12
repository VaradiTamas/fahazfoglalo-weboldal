import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CalendarDay } from '../../../../models/calendar-day.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class CalendarService {
  // indicating if the selected dates are changed in the calendar
  private fromDate: Date = null;
  private toDate: Date = null;
  private selectedDateUpdated = new Subject<{
    fromDate: Date,
    toDate: Date
  }>();

  // all days within 3 months of the currently selected month
  private calendarDays: CalendarDay[] = [];
  private calendarDaysUpdated = new Subject<{ calendarDays: CalendarDay[] }>();

  // indicating the change between months in the calendar
  private previousClicked = new Subject();
  private nextClicked = new Subject();

  constructor(private http: HttpClient) {}

  public getCalendarDays(): CalendarDay[] {
    return this.calendarDays;
  }

  public getFromDate(): Date {
    return this.fromDate;
  }

  public getToDate(): Date {
    return this.toDate;
  }

  updateCalendarDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<CalendarDay[]>(BACKEND_URL + 'bookings/reserved-days' + queryParams)
     .subscribe((calendarDays) => {
       this.calendarDays = calendarDays;
       this.calendarDaysUpdated.next({ calendarDays: [...this.calendarDays] });
     });
  }

  public getCalendarDay(searchDate: Date): CalendarDay {
    for (const calendarDay of this.calendarDays) {
      if (this.areDatesOnSameDay(calendarDay.date, searchDate)) {
        return calendarDay;
      }
    }
    return null;
  }

  public getCalendarDayIndex(searchDate: Date): number {
    for (let i = 0; i < this.calendarDays.length; i++) {
      if (this.areDatesOnSameDay(this.calendarDays[i].date, searchDate)) {
        return i;
      }
    }
    return -1;
  }

  public isSelectedDateWithinMaximumPeriod(fromDate: Date, selectedDate: Date): boolean {
    const date1 = new Date(fromDate);
    const date2 = new Date(selectedDate);
    // (seconds per hour) * (hours per day) * (max number of days in a month) * (number of months) * (change from sec to millisec)
    const twoMonths = 3600 * 24 * 31 * 2 * 1000;
    // parsing the strings of the dates gives us the milliseconds past the date
    const millisecondsBetweenDates = Date.parse(date2.toString()) - Date.parse(date1.toString());
    return millisecondsBetweenDates < twoMonths;
  }

  public areThereReservedDatesBetween(fromDate: Date, selectedDate: Date): boolean {
    const indexOfFromDate = this.getCalendarDayIndex(fromDate);
    const indexOfSelectedDate = this.getCalendarDayIndex(selectedDate);
    for (let i = indexOfFromDate; i < indexOfSelectedDate; i++) {
      if (this.calendarDays[i].isReserved) {
        return true;
      }
    }
    return false;
  }

  public areDatesOnSameDay(firstDate: Date, secondDate: Date): boolean {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  selectedDatesChanged(selectedStartDate: Date, selectedEndDate: Date): void {
    this.fromDate = selectedStartDate;
    this.toDate = selectedEndDate;
    this.selectedDateUpdated.next({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onPreviousClicked(): void {
    this.previousClicked.next();
  }

  onNextClicked(): void{
    this.nextClicked.next();
  }

  getCalendarDaysUpdateListener(): Observable<{ calendarDays: CalendarDay[] }> {
    return this.calendarDaysUpdated.asObservable();
  }

  getSelectedDatesUpdateListener(): Observable<{ fromDate: Date, toDate: Date }> {
    return this.selectedDateUpdated.asObservable();
  }

  getPreviousClickedListener(): Observable<unknown>{
    return this.previousClicked.asObservable();
  }

  getNextClickedListener(): Observable<unknown>{
    return this.nextClicked.asObservable();
  }
}
