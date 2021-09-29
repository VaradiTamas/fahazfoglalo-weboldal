import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ToCalendarService {
  private reservedDays: number[] = [];
  private fromDateHasBeenChosen = false;
  private chosenFromDate = new Date();
  private nearestBookingStartingDate = new Date();
  private reservedDaysUpdated = new Subject<{ reservedDays: number[] }>()

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number) {
    if(!this.fromDateHasBeenChosen){
      const queryParams = `?year=${year}&month=${month}`;
      this.http.get<{days: number[]}[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
        .subscribe((reservedDays)=> {
          const reservedPeriods = reservedDays.map(reservedPeriod => {
            return reservedPeriod.days;
          });
          this.reservedDays = [].concat.apply([], reservedPeriods);
          this.reservedDaysUpdated.next({
            reservedDays: [...this.reservedDays],
          });
        });
    }else{
      if(this.chosenFromDate.getMonth() == month){
        this.getFreeDatesFromChosenDate(this.chosenFromDate.getFullYear(), this.chosenFromDate.getMonth(), this.chosenFromDate.getDate());
      }else if(this.nearestBookingStartingDate.getMonth() == month) {
        this.reservedDays = [];
        for (let i = this.nearestBookingStartingDate.getDate(); i <= 31; i++) {
          this.reservedDays.push(i);
        }
      }else if((this.nearestBookingStartingDate.getMonth() > month && this.chosenFromDate.getMonth() < month)
        || (this.nearestBookingStartingDate.getFullYear() > year && this.chosenFromDate.getFullYear() < year)){
        this.reservedDays = [];
      }else {
        this.reservedDays = [];
        for(let i = 0; i <= 31; i++){
          this.reservedDays.push(i);
        }
      }
      this.reservedDaysUpdated.next({
        reservedDays: [...this.reservedDays],
      });
    }
  }

  getFreeDatesFromChosenDate(year: number, month: number, date: number): void{
    const queryParams = `?year=${year}&month=${month}&date=${date}`;
    this.http.get<{year: number, month: number, date: number}>
    ('http://localhost:3000/admin/bookings/free-dates-from-chosen-date' + queryParams)
      .subscribe((nearestBookingStartingDate) => {
        this.reservedDays = [];
        this.nearestBookingStartingDate.setFullYear(
          nearestBookingStartingDate.year,
          nearestBookingStartingDate.month,
          nearestBookingStartingDate.date
        );
        this.fromDateHasBeenChosen = true;
        this.chosenFromDate.setFullYear(year, month, date);

        var freeDates = [];
        for(let i = date; i < this.nearestBookingStartingDate.getDate(); i++){
          if(i <= 31 && i >= date){
            freeDates.push(i);
          }
        }

        for(let i = 0; i<=31; i++){
          if(!freeDates.includes(i)){
            this.reservedDays.push(i);
          }
        }

        if(this.chosenFromDate.getMonth() != this.nearestBookingStartingDate.getMonth()){
          this.reservedDays = [];
          for(let i = 0; i <= this.chosenFromDate.getDate(); i++){
            this.reservedDays.push(i);
          }
        }

        this.reservedDaysUpdated.next({
          reservedDays: [...this.reservedDays]
        });
      });
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }
}
