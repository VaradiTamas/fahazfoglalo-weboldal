import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Booking } from '../../../../../models/booking.model';
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
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  formInvalid = false;
  private reservationFormStepsSubscription: Subscription;
  private reservationFormStepperSubscription: Subscription;
  color: ThemePalette = 'primary';
  @ViewChild('lastName') lastName;
  @ViewChild('firstName') firstName;
  @ViewChild('tel') tel;
  @ViewChild('email') email;

  constructor(public reservationFormStepsService: ReservationFormStepsService,
              public reservationFormStepperService: ReservationFormStepperService,
              public calendarService: CalendarService,
              public router: Router) { }

  ngOnInit(): void {
    this.booking = this.reservationFormStepsService.getBooking();
    this.setNumOfGuests();
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
      });
    this.reservationFormStepperSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        if (subData.reservationPhaseValue === -1) {
          this.onInputTextFieldChange('lastName');
          this.onInputTextFieldChange('firstName');
          this.onInputTextFieldChange('tel');
          this.onInputTextFieldChange('email');
        }
      });
  }

  setNumOfGuests(): void {
    if (!this.booking.numOfChildren) {
      this.booking.numOfChildren = 0;
    }
    if (!this.booking.numOfAdults) {
      this.booking.numOfAdults = 2;
    }
  }

  onInputTextFieldChange(inputField: string): void {
    switch (inputField) {
      case ('lastName'): {
        if (!this.booking.lastName) {
          this.lastName.nativeElement.style.borderColor = 'red';
          this.lastName.nativeElement.style.borderWidth = '2px';
        } else {
          this.lastName.nativeElement.style.borderColor = '#ced4da';
          this.lastName.nativeElement.style.borderWidth = '1px';
        }
        break;
      }
      case ('firstName'): {
        if (!this.booking.firstName) {
          this.firstName.nativeElement.style.borderColor = 'red';
          this.firstName.nativeElement.style.borderWidth = '2px';
        } else {
          this.firstName.nativeElement.style.borderColor = '#ced4da';
          this.firstName.nativeElement.style.borderWidth = '1px';
        }
        break;
      }
      case ('tel'): {
        if (!this.booking.tel) {
          this.tel.nativeElement.style.borderColor = 'red';
          this.tel.nativeElement.style.borderWidth = '2px';
        } else {
          this.tel.nativeElement.style.borderColor = '#ced4da';
          this.tel.nativeElement.style.borderWidth = '1px';
        }
        break;
      }
      case ('email'): {
        if (!this.booking.email) {
          this.email.nativeElement.style.borderColor = 'red';
          this.email.nativeElement.style.borderWidth = '2px';
        } else {
          this.email.nativeElement.style.borderColor = '#ced4da';
          this.email.nativeElement.style.borderWidth = '1px';
        }
        break;
      }
    }
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

  ngOnDestroy(): void {
    this.reservationFormStepsService.numberOfAdultsChanged(this.booking.numOfAdults);
    this.reservationFormStepsService.numberOfChildrenChanged(this.booking.numOfChildren);
    this.reservationFormStepsService.lastNameChanged(this.booking.lastName);
    this.reservationFormStepsService.firstNameChanged(this.booking.firstName);
    this.reservationFormStepsService.telephoneNumberChanged(this.booking.tel);
    this.reservationFormStepsService.emailChanged(this.booking.email);
    this.reservationFormStepsService.commentChanged(this.booking.comment);
    this.reservationFormStepsSubscription.unsubscribe();
    this.reservationFormStepperSubscription.unsubscribe();
  }
}
