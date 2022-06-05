import { Booking } from '../models/booking.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class BookingService{
  private bookings: Booking[] = [];
  private bookingsUpdated = new Subject<{bookings: Booking[], bookingCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getBookings(bookingsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${bookingsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, bookings: any, maxBookings: number}>(BACKEND_URL + 'bookings' + queryParams)
      .pipe(map((serverBookings) => {
        return { bookings: serverBookings.bookings.map(booking => {
          return {
            id: booking._id,
            voucherId: booking.voucherId,
            from: booking.from,
            to: booking.to,
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            tel: booking.tel,
            numOfChildren: booking.numOfChildren,
            numOfAdults: booking.numOfAdults,
            comment: booking.comment,
            paidAmount: booking.paidAmount,
          };
        }), maxBookings: serverBookings.maxBookings};
      }))
      .subscribe((transformedBookingsData) => {
        this.bookings = transformedBookingsData.bookings;
        this.bookingsUpdated.next({
          bookings: [...this.bookings],
          bookingCount: transformedBookingsData.maxBookings
        });
      });
  }

  addBooking(booking: Booking): void {
    // in ts we use local time, in js date is in UTC so I added 12 hours to the dates to overlap this
    // difference and make sure it causes no problem
    booking.from.setHours(12);
    booking.to.setHours(12);
    this.http.post<{message: string, bookingId: string}>(BACKEND_URL + 'bookings', booking)
      .subscribe((responseData) => { });
  }

  sendBookingConfirmationEmail(booking: Booking): void {
    this.http.post(BACKEND_URL + 'emails/send-booking-confirmation-email', booking)
      .subscribe((responseData) => {});
  }

  sendPaymentConfirmationEmail(booking: Booking): void {
    this.http.post(BACKEND_URL + 'emails/send-payment-confirmation-email', booking)
      .subscribe((responseData) => {});
  }

  deleteBooking(bookingId: string) {
    return this.http.delete(BACKEND_URL + 'bookings/delete/' + bookingId);
  }

  updateBooking(booking: Booking): void {
    this.http.put(BACKEND_URL + 'bookings/edit/' + booking.id, booking)
      .subscribe((responseData) => {
        this.router.navigate(['/admin/bookings']);
      });
  }

  getBooking(id: string) {
    return this.http.get<{
      _id: string,
      voucherId: string,
      from: string,
      to: string,
      firstName: string,
      lastName: string,
      email: string,
      tel: string,
      numOfChildren: number,
      numOfAdults: number,
      comment: string,
      paidAmount: number
    }>(BACKEND_URL + 'bookings/' + id);
  }

  getBookingUpdateListener(){
    return this.bookingsUpdated.asObservable();
  }
}
