import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationFormStepperService} from '../../reservation-form-stepper/reservation-form-stepper.service';
import {Booking} from '../../../../../models/booking.model';
import {ReservationFormStepsService} from '../reservation-form-steps.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-reservation-form-bedrooms',
  templateUrl: './reservation-form-bedrooms.component.html',
  styleUrls: ['./reservation-form-bedrooms.component.css']
})
export class ReservationFormBedroomsComponent implements OnInit, OnDestroy {
  booking: Booking;
  private reservationFormStepsSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService, public reservationFormStepsService: ReservationFormStepsService) { }

  ngOnInit(): void {
    this.booking = this.reservationFormStepsService.getBooking();
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
      });
  }

  onBedroomClick(value: number): void{
    this.reservationFormStepsService.numberOfBedroomsChanged(value);
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

  ngOnDestroy(): void {
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
