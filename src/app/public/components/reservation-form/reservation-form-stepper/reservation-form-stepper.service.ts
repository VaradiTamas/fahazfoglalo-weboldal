import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ReservationFormStepsService } from '../reservation-form-steps/reservation-form-steps.service';

@Injectable({ providedIn: 'root' })
export class ReservationFormStepperService {
  private reservationPhaseValue = 0;
  private reservationPhaseValueUpdated = new Subject<{ reservationPhaseValue: number }>();

  constructor(public reservationFormStepsService: ReservationFormStepsService) {}

  reservationPhaseValueChanged(value: number): void {
    if (this.canStepTo(value)) {
      this.reservationPhaseValue = value;
      this.reservationPhaseValueUpdated.next({ reservationPhaseValue: this.reservationPhaseValue });
    } else {
      this.reservationPhaseValueUpdated.next({ reservationPhaseValue: -1 });
    }
  }

  canStepTo(value: number): boolean {
    switch (value) {
      case 0: {
        return true;
      }
      case 1: {
        return this.reservationFormStepsService.isDateFormValid();
      }
      case 2: {
        return this.reservationFormStepsService.isDateFormValid()
          && this.reservationFormStepsService.isDataFormValid();
      }
    }
  }

  getReservationPhaseValueUpdateListener(): Observable<{reservationPhaseValue: number}> {
    return this.reservationPhaseValueUpdated.asObservable();
  }
}
