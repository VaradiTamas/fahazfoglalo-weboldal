import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Booking } from '../../../../../models/booking.model';
import { ReservationFormStepperService } from '../../reservation-form-stepper/reservation-form-stepper.service';
import { ReservationFormStepsService } from '../reservation-form-steps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation-form-guests',
  templateUrl: './reservation-form-guests.component.html',
  styleUrls: ['./reservation-form-guests.component.css']
})
export class ReservationFormGuestsComponent implements OnInit, OnDestroy {
  @ViewChild('numOfChildren') numOfChildren;
  @ViewChild('numOfAdults') numOfAdults;
  booking: Booking;
  private reservationFormStepsSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService,
              public reservationFormStepsService: ReservationFormStepsService) { }

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

  ngOnDestroy(): void {
    this.reservationFormStepsService.numberOfChildrenChanged(this.numOfChildren.nativeElement.value);
    this.reservationFormStepsService.numberOfAdultsChanged(this.numOfAdults.nativeElement.value);
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
