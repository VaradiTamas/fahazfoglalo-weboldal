import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../model/booking.model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  isLoading = false;
  totalBookings = 0;
  bookingsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  private bookingsSubscription: Subscription;

  constructor(public bookingService: BookingService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.bookingService.getBookings(this.bookingsPerPage, this.currentPage);
    this.bookingsSubscription = this.bookingService.getBookingUpdateListener()
      .subscribe((bookingData: {bookings: Booking[], bookingCount: number}) => {
        this.isLoading = false;
        this.totalBookings = bookingData.bookingCount;
        this.bookings = bookingData.bookings;
    });
  }

  onChangedPage(pageData: PageEvent): void{
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.bookingsPerPage = pageData.pageSize;
    this.bookingService.getBookings(this.bookingsPerPage, this.currentPage);
  }

  onConfirmBooking(booking: Booking): void{
    booking.isPaid = true;
    this.bookingService.updateBooking(booking);
    this.bookingService.sendPaymentConfirmationEmail(booking);
  }

  onDelete(bookingId: string): void{
    this.isLoading = true;
    this.bookingService.deleteBooking(bookingId).subscribe(() => {
      this.bookingService.getBookings(this.bookingsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.bookingsSubscription.unsubscribe();
  }
}
