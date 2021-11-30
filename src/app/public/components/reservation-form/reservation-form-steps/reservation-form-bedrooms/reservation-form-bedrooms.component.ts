import { Component, OnInit } from '@angular/core';
import {ReservationFormStepperService} from "../../reservation-form-stepper/reservation-form-stepper.service";
import {Booking} from "../../../../../models/booking.model";

@Component({
  selector: 'app-reservation-form-bedrooms',
  templateUrl: './reservation-form-bedrooms.component.html',
  styleUrls: ['./reservation-form-bedrooms.component.css']
})
export class ReservationFormBedroomsComponent implements OnInit {
  booking: Booking;

  constructor(public reservationFormStepperService: ReservationFormStepperService) { }

  ngOnInit(): void {
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

}
