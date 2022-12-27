import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css']
})
export class NewBookingComponent implements OnInit, OnDestroy{
  booking: Booking;
  isLoading = false;
  authSubscription: Subscription;
  private mode = 'create';
  private bookingId: string;

  constructor(private bookingService: BookingService,
              public route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.bookingId = paramMap.get('id');
        this.isLoading = true;
        this.bookingService.getBooking(this.bookingId).subscribe(bookingData => {
          this.isLoading = false;
          this.booking = {
            id: bookingData._id,
            from: new Date(bookingData.from),
            to: new Date(bookingData.to),
            firstName: bookingData.firstName,
            lastName: bookingData.lastName,
            email: bookingData.email,
            tel: bookingData.tel,
            numOfChildren: bookingData.numOfChildren,
            numOfAdults: bookingData.numOfAdults,
            comment: bookingData.comment,
            paidAmount: bookingData.paidAmount,
          };
        });
      }
      else{
        this.mode = 'create';
        this.bookingId = null;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const value = form.value;
    const formBooking = {
      id: this.bookingId,
      from: value.from,
      to: value.to,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      tel: value.tel,
      numOfChildren: value.numOfChildren,
      numOfAdults: value.numOfAdults,
      comment: value.comment,
      paidAmount: 0
    };
    if (this.mode === 'create'){
      this.bookingService.addBooking(formBooking);
    }
    else{
      this.bookingService.updateBooking(formBooking);
    }
    form.reset();
    void this.router.navigate(['/admin/bookings']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
