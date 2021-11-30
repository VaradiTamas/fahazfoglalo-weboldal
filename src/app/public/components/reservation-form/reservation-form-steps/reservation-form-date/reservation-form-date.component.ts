import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationFormStepperService} from '../../reservation-form-stepper/reservation-form-stepper.service';
import {Booking} from '../../../../../models/booking.model';
import {ReservationFormStepsService} from '../reservation-form-steps.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-reservation-form-date',
  templateUrl: './reservation-form-date.component.html',
  styleUrls: ['./reservation-form-date.component.css']
})
export class ReservationFormDateComponent implements OnInit, OnDestroy {
  booking: Booking;
  fromDateText = 'Mettől';
  toDateText = 'Meddig';
  private reservationFormStepsSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService, public reservationFormStepsService: ReservationFormStepsService) { }

  ngOnInit(): void {
    this.booking = this.reservationFormStepsService.getBooking()
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
        this.setFromDateText();
        this.setToDateText();
      });
  }

  setFromDateText(): void{
    if (this.booking.from != null){
      this.fromDateText = String(this.booking.from.getFullYear()) + '.'
        + String(this.booking.from.getMonth() + 1) + '.'
        + String(this.booking.from.getDate() + '.');
    } else {
      this.fromDateText = 'Mettől';
    }
  }

  setToDateText(): void{
    if (this.booking.to != null){
      this.toDateText = String(this.booking.to.getFullYear()) + '.'
        + String(this.booking.to.getMonth() + 1) + '.'
        + String(this.booking.to.getDate() + '.');
    } else {
      this.toDateText = 'Meddig';
    }
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

  ngOnDestroy(): void {
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
