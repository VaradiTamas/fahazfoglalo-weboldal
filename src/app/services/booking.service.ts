import {Booking} from "../model/booking.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class BookingService{
  private bookings: Booking[] = [];
  private bookingsUpdated = new Subject<{bookings: Booking[], bookingCount: number}>()

  constructor(private http: HttpClient, private router: Router) {}

  getBookings(bookingsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${bookingsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, bookings: any, maxBookings: number}>('http://localhost:3000/admin/bookings' + queryParams)
      .pipe(map((serverBookings) => {
        return { bookings: serverBookings.bookings.map(booking => {
          return {
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            tel: booking.tel,
            numOfChildren: booking.numOfChildren,
            numOfAdults: booking.numOfAdults,
            numOfBedrooms: booking.numOfBedrooms,
            comment: booking.comment,
            isPaid: booking.isPaid,
            id: booking._id,
            voucherId: booking.voucherId,
            from: booking.from,
            to: booking.to,
            offerName: booking.offerName
          };
        }), maxBookings: serverBookings.maxBookings};
      }))
      .subscribe((transformedBookingsData)=>{
        this.bookings = transformedBookingsData.bookings;
        this.bookingsUpdated.next({
          bookings: [...this.bookings],
          bookingCount: transformedBookingsData.maxBookings
        });
      });
  }

  addBooking(booking: Booking){
    this.http.post<{message: string, bookingId: string}>('http://localhost:3000/admin/bookings', booking)
      .subscribe((responseData)=>{
        //this.router.navigate(["/admin/bookings"]);
      });
  }

  deleteBooking(bookingId: string){
    return this.http.delete('http://localhost:3000/admin/bookings/delete/' + bookingId);
  }

  updateBooking(booking: Booking){
    this.http.put('http://localhost:3000/admin/bookings/edit/' + booking.id, booking)
      .subscribe((responseData)=>{
        this.router.navigate(["/admin/bookings"]);
      });
  }

  getBooking(id: string){
    return this.http.get<{
      _id: string,
      voucherId: string,
      firstName: string,
      lastName: string,
      email: string,
      tel: string,
      from: string,
      to: string,
      offerName: string,
      numOfChildren: number,
      numOfAdults: number,
      numOfBedrooms: number,
      comment: string,
      isPaid: boolean
    }>('http://localhost:3000/admin/bookings/' + id);
  }

  getBookingUpdateListener(){
    return this.bookingsUpdated.asObservable();
  }
}
