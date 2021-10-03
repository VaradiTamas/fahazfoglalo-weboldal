import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FromCalendarService {
  private reservedDays: number[] = [];
  private startDate: Date = null;
  private endDate: Date = null;
  private reservedDaysUpdated = new Subject<{ reservedDays: number[] }>();
  private startDateUpdated = new Subject<{ startDate: Date }>();
  private endDateUpdated = new Subject<{ endDate: Date }>();

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{days: number[]}[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
     .subscribe((reservedDays) => {
        const reservedPeriods = reservedDays.map(reservedPeriod => {
          return reservedPeriod.days;
        });
        this.reservedDays = [].concat.apply([], reservedPeriods);
        this.reservedDaysUpdated.next({
          reservedDays: [...this.reservedDays]
        });
      });
  }

  getStartDate(selectedDate: Date): void{
    this.startDate = selectedDate;
    this.startDateUpdated.next({startDate: this.startDate});
  }

  getEndDate(selectedDate: Date): void{
    this.endDate = selectedDate;
    this.endDateUpdated.next({endDate: this.endDate});
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }

  getStartDateUpdateListener(){
    return this.startDateUpdated.asObservable();
  }

  getEndDateUpdateListener(){
    return this.endDateUpdated.asObservable();
  }
}
