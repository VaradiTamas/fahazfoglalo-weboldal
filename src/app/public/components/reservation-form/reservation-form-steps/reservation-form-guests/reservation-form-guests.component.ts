import { Component, OnInit } from '@angular/core';
import {Booking} from "../../../../../models/booking.model";
import {ReservationFormStepperService} from "../../reservation-form-stepper/reservation-form-stepper.service";

@Component({
  selector: 'app-reservation-form-guests',
  templateUrl: './reservation-form-guests.component.html',
  styleUrls: ['./reservation-form-guests.component.css']
})
export class ReservationFormGuestsComponent implements OnInit {
  booking: Booking;

  constructor(public reservationFormStepperService: ReservationFormStepperService) { }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

  ngOnInit(): void {
  }

}
