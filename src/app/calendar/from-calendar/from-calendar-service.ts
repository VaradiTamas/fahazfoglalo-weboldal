import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FromCalendarService {
  private reservedDays: number[] = [];
  private selectedDate: Date = null;
  private currentYear: number;
  private currentMonth: number;
  private reservedDaysUpdated = new Subject<{ reservedDays: number[], currentYear: number, currentMonth: number }>();
  private selectedDateUpdated = new Subject<{ selectedDate: Date }>();

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{days: number[]}[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
     .subscribe((reservedDays) => {
        const reservedPeriods = reservedDays.map(reservedPeriod => {
          return reservedPeriod.days;
        });
        this.reservedDays = [].concat.apply([], reservedPeriods);
        this.currentYear = year;
        this.currentMonth = month;
        this.reservedDaysUpdated.next({
          reservedDays: [...this.reservedDays],
          currentYear: this.currentYear,
          currentMonth: this.currentMonth
        });
      });
  }

  getSelectedDate(selectedDate: Date): void{
    this.selectedDate = selectedDate;
    this.selectedDateUpdated.next({selectedDate: this.selectedDate});
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }

  getSelectedDateUpdateListener(){
    return this.selectedDateUpdated.asObservable();
  }
}
