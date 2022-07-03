import { Component, OnDestroy, OnInit } from '@angular/core';
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
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  formInvalid = false;
  private reservationFormStepsSubscription: Subscription;
  private reservationFormStepperSubscription: Subscription;
  color: ThemePalette = 'primary';

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
    this.reservationFormStepperSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        subData.reservationPhaseValue === -1 ? this.formInvalid = true : this.formInvalid = false;
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
    this.reservationFormStepsService.lastNameChanged(this.booking.lastName);
    this.reservationFormStepsService.firstNameChanged(this.booking.firstName);
    this.reservationFormStepsService.telephoneNumberChanged(this.booking.tel);
    this.reservationFormStepsService.emailChanged(this.booking.email);
    this.reservationFormStepsService.commentChanged(this.booking.comment);
    this.reservationFormStepsSubscription.unsubscribe();
    this.reservationFormStepperSubscription.unsubscribe();
  }
}
