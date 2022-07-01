import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Booking } from '../../../../../models/booking.model';
import { Voucher } from '../../../../../models/voucher.model';
import { VoucherService } from '../../../../../services/voucher.service';
import { NgForm } from '@angular/forms';
import { ReservationFormStepsService } from '../reservation-form-steps.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CalendarService } from '../../../calendar/services/calendar.service';
import { ReservationFormStepperService } from '../../reservation-form-stepper/reservation-form-stepper.service';
import { ThemePalette } from '@angular/material/core';

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
  color: ThemePalette = 'primary';
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  private reservationFormStepsSubscription: Subscription;

  constructor(private voucherService: VoucherService,
              public reservationFormStepsService: ReservationFormStepsService,
              public reservationFormStepperService: ReservationFormStepperService,
              public calendarService: CalendarService,
              public router: Router) { }

  ngOnInit(): void {
    this.booking = this.reservationFormStepsService.getBooking();
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
      });
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
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

  ngOnDestroy(): void {
    this.reservationFormStepsService.firstNameChanged(this.firstName.nativeElement.value);
    this.reservationFormStepsService.lastNameChanged(this.lastName.nativeElement.value);
    this.reservationFormStepsService.telephoneNumberChanged(this.tel.nativeElement.value);
    this.reservationFormStepsService.emailChanged(this.email.nativeElement.value);
    this.reservationFormStepsService.commentChanged(this.comment.nativeElement.value);
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
