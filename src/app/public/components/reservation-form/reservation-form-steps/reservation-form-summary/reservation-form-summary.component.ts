import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from '../../../../../models/booking.model';
import { Subscription } from 'rxjs';
import { VoucherService } from '../../../../../services/voucher.service';
import { BookingService } from '../../../../../services/booking.service';
import { ReservationFormStepsService } from '../reservation-form-steps.service';
import { ReservationFormStepperService } from '../../reservation-form-stepper/reservation-form-stepper.service';
import { CalendarService } from '../../../calendar/services/calendar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingConfirmationDialogComponent } from '../../confirmation-dialog/booking-confirmation-dialog.component';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-reservation-form-summary',
  templateUrl: './reservation-form-summary.component.html',
  styleUrls: ['./reservation-form-summary.component.css']
})
export class ReservationFormSummaryComponent implements OnInit, OnDestroy {
  booking: Booking;
  fromDateString: string;
  toDateString: string;
  finalPrice: string;
  checkboxColor: ThemePalette = 'primary';
  private reservationFormStepsSubscription: Subscription;

  constructor(private voucherService: VoucherService,
              private bookingService: BookingService,
              public reservationFormStepsService: ReservationFormStepsService,
              public reservationFormStepperService: ReservationFormStepperService,
              public calendarService: CalendarService,
              public router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.booking = this.reservationFormStepsService.getBooking();
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
      });
    this.fromDateString = this.getDateString(this.booking.from);
    this.toDateString = this.getDateString(this.booking.to);
    this.calculatePrice();
  }

  getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : month.toString();
    const day = date.getDate();
    const dayString = day < 10 ? `0${day}` : day.toString();
    return `${year}.${monthString}.${dayString}.`;
  }

  calculatePrice(): void {
    const diffTime = +this.booking.to - +this.booking.from;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const price = diffDays * 50000;
    this.finalPrice = new Intl.NumberFormat('en-us').format(price);
  }

  onSubmit(): void {
    const submitBooking = {
      id: null,
      voucherId: this.booking.voucherId,
      from: this.booking.from,
      to: this.booking.to,
      firstName: this.booking.firstName,
      lastName: this.booking.lastName,
      email: this.booking.email,
      tel: this.booking.tel,
      numOfChildren: this.booking.numOfChildren,
      numOfAdults: this.booking.numOfAdults,
      comment: this.booking.comment,
      paidAmount: 0,
    };
    this.bookingService.addBooking(submitBooking);

    // navigating to the initial state of the webpage
    void this.router.navigate(['/home']);
    this.reservationFormStepperService.reservationPhaseValueChanged(0);

    // clearing data
    this.calendarService.selectedDatesChanged(null, null);
    this.calendarService.updateCalendarDays(submitBooking.from.getFullYear(), submitBooking.from.getMonth());
    this.reservationFormStepsService.clearBookingData();

    // showing a dialog if the reservation was successful or not
    this.dialog.open(BookingConfirmationDialogComponent, { data: { booking: submitBooking }});
  }

  ngOnDestroy(): void {
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
