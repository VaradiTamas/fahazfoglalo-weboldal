import {Injectable} from "@angular/core";
import {Booking} from "../model/booking.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class DateService {
  private reservedDays: number[] = [];
  private reservedDaysUpdated = new Subject<{ reservedDays: number[] }>()

  constructor(private http: HttpClient, private router: Router) {}

  getReservedDays(year: number, month: number) {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{date: number}[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
      .subscribe((reservedDays)=> {
        this.reservedDays = reservedDays.map(dates => {
          return dates.date;
        });
        this.reservedDaysUpdated.next({
          reservedDays: [...this.reservedDays],
        });
      });
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }
}
