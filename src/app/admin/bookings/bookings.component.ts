import {Component, HostListener, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {BookingService} from '../../services/booking.service';
import {Booking} from '../../models/booking.model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy, AfterViewInit {
  bookings: Booking[] = [];
  isLoading = false;
  totalBookings = 0;
  bookingsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  bookingsSubscription: Subscription;
  biggerThanMediumScreen = false;
  biggerThanLargeScreen = false;
  biggerThanXLargeScreen = false;

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

  ngAfterViewInit(): void{
    this.isMobileScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.isMobileScreen();
  }

  isMobileScreen(): void{
    if (window.innerWidth > 1550){
      this.biggerThanXLargeScreen = true;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = true;
    } else if (window.innerWidth > 1200){
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = true;
    } else if (window.innerWidth > 992) {
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = false;
    } else {
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = false;
      this.biggerThanLargeScreen = false;
    }
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
