import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReservationFormStepperService {
  private reservationPhaseValue = 0;
  private reservationPhaseValueUpdated = new Subject<{reservationPhaseValue: number}>();

  constructor() {}

  reservationPhaseValueChanged(value: number): void{
    this.reservationPhaseValue = value;
    this.reservationPhaseValueUpdated.next({reservationPhaseValue: this.reservationPhaseValue});
  }

  getReservationPhaseValueUpdateListener(){
    return this.reservationPhaseValueUpdated.asObservable();
  }
}
