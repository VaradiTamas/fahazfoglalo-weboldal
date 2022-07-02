import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReservationFormStepperService } from './reservation-form-stepper/reservation-form-stepper.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  phaseValue = 0;
  private phaseValueSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService) {}

  ngOnInit(): void {
    this.phaseValueSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        if (subData.reservationPhaseValue >= 0) {
          this.phaseValue = subData.reservationPhaseValue;
        }
      });
  }
}
