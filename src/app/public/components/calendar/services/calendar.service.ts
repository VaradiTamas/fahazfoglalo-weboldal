import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CalendarDay } from '../../../../models/calendar-day.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class CalendarService {
  // indicating if the selected dates are changed in the calendar
  private startDate: Date = null;
  private endDate: Date = null;
  private selectedDateUpdated = new Subject<{
    startDate: Date,
    endDate: Date
  }>();

  // all days within 3 months of the currently selected month
  private calendarDays: CalendarDay[] = [];
  private calendarDaysUpdated = new Subject<{ calendarDays: CalendarDay[] }>();

  // indicating the change between months in the calendar
  private previousClicked = new Subject();
  private nextClicked = new Subject();

  constructor(private http: HttpClient) {}

  getCalendarDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<CalendarDay[]>(BACKEND_URL + 'bookings/reserved-days' + queryParams)
     .subscribe((calendarDays) => {
       this.calendarDays = calendarDays;
       this.calendarDaysUpdated.next({ calendarDays: [...this.calendarDays] });
     });
  }

  public getCalendarDay(searchDate: Date): CalendarDay {
    this.calendarDays.forEach((calendarDay) => {
      if (this.areDatesOnSameDay(calendarDay.date, searchDate)) {
        return calendarDay;
      }
    });
    return null;
  }

  public areDatesOnSameDay(firstDate: Date, secondDate: Date): boolean {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  selectedDatesChanged(selectedStartDate: Date, selectedEndDate: Date): void{
    this.startDate = selectedStartDate;
    this.endDate = selectedEndDate;
    this.selectedDateUpdated.next({
      startDate: this.startDate,
      endDate: this.endDate
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

  getSelectedDatesUpdateListener(): Observable<{ startDate: Date, endDate: Date }> {
    return this.selectedDateUpdated.asObservable();
  }

  getPreviousClickedListener(): Observable<unknown>{
    return this.previousClicked.asObservable();
  }

  getNextClickedListener(): Observable<unknown>{
    return this.nextClicked.asObservable();
  }
}
