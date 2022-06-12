import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Booking } from '../../../../../models/booking.model';
import { Voucher } from '../../../../../models/voucher.model';
import { VoucherService } from '../../../../../services/voucher.service';
import { NgForm } from '@angular/forms';
import { ReservationFormStepsService } from '../reservation-form-steps.service';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../../../services/booking.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from '../../../calendar/services/calendar.service';
import { ReservationFormStepperService } from '../../reservation-form-stepper/reservation-form-stepper.service';
import { BookingConfirmationDialogComponent } from '../../confirmation-dialog/booking-confirmation-dialog.component';

@Component({
  selector: 'app-reservation-form-data',
  templateUrl: './reservation-form-data.component.html',
  styleUrls: ['./reservation-form-data.component.css']
})
export class ReservationFormDataComponent implements OnInit, OnDestroy {
  @ViewChild('firstName') firstName;
  @ViewChild('lastName') lastName;
  @ViewChild('tel') tel;
  @ViewChild('email') email;
  @ViewChild('comment') comment;
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
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
  }

  onVoucherClick(): void{
    this.possessVoucher = !this.possessVoucher;
  }

  onCheckVoucher(form: NgForm): void{
    const value = form.value;
    this.voucherService.getVoucher(value.voucherId)
      .subscribe(voucherData => {
        this.voucher = {
          id: voucherData._id,
          firstName: voucherData.firstName,
          lastName: voucherData.lastName,
          tel: voucherData.tel,
          email: voucherData.email,
          numOfNights: voucherData.numOfNights,
          numOfChildren: voucherData.numOfChildren,
          numOfAdults: voucherData.numOfAdults,
          numOfBedrooms: voucherData.numOfBedrooms,
          country: voucherData.country,
          postcode: voucherData.postcode,
          city: voucherData.city,
          address: voucherData.address,
          isPaid: voucherData.isPaid
        };
        if (this.voucher.id === value.voucherId){
          this.reservationFormStepsService.voucherIdChanged(this.voucher.id);
        }
        this.alreadyCheckedVoucher = true;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const value = form.value;
    const formBooking = {
      id: null,
      voucherId: this.voucher?.id,
      from: this.booking.from,
      to: this.booking.to,
      firstName: value.firstName == null ? this.booking.firstName : value.firstName,
      lastName: value.lastName == null ? this.booking.lastName : value.lastName,
      email: value.email == null ? this.booking.email : value.email,
      tel: value.tel == null ? this.booking.tel : value.tel,
      numOfChildren: this.booking.numOfChildren,
      numOfAdults: this.booking.numOfAdults,
      comment: value.comment == null ? this.booking.comment : value.comment,
      paidAmount: 0,
    };
    this.bookingService.addBooking(formBooking);

    // navigating to the initial state of the webpage
    void this.router.navigate(['/home']);
    this.reservationFormStepperService.reservationPhaseValueChanged(0);

    // clearing data
    this.calendarService.selectedDatesChanged(null, null);
    this.calendarService.updateCalendarDays(formBooking.from.getFullYear(), formBooking.from.getMonth());
    this.reservationFormStepsService.clearBookingData();
    form.resetForm();

    // showing a dialog if the reservation was successful or not
    this.dialog.open(BookingConfirmationDialogComponent, { data: { booking: formBooking }});
  }

  ngOnDestroy(): void {
    this.reservationFormStepsService.firstNameChanged(this.firstName.nativeElement.value);
    this.reservationFormStepsService.lastNameChanged(this.lastName.nativeElement.value);
    this.reservationFormStepsService.telephoneNumberChanged(this.tel.nativeElement.value);
    this.reservationFormStepsService.emailChanged(this.email.nativeElement.value);
    this.reservationFormStepsService.commentChanged(this.comment.nativeElement.value);
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
