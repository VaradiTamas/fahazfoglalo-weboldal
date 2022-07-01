import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {Subscription} from 'rxjs';
import {ReservationFormStepperService} from './reservation-form-stepper.service';

@Component({
  selector: 'app-reservation-form-stepper',
  templateUrl: './reservation-form-stepper.component.html',
  styleUrls: ['./reservation-form-stepper.component.css']
})
export class ReservationFormStepperComponent implements OnInit, AfterViewInit, OnDestroy {
  phaseValue = 0;
  @ViewChild('dateDiv') dateDiv;
  @ViewChild('guestsDiv') guestsDiv;
  @ViewChild('dataDiv') dataDiv;
  @ViewChild('summaryDiv') summaryDiv;
  @ViewChild('stepperContainer') stepperContainer;
  @ViewChild('spacerForStepperContainer') spacerForStepperContainer;
  private phaseValueSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setChanges(this.phaseValue);
    this.phaseValueSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        this.phaseValue = subData.reservationPhaseValue;
        this.setChanges(subData.reservationPhaseValue);
      });
  }

  onTabClick(value: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(value);
  }

  onStepperValueChange(event: MatSliderChange): void{
    if (event.value != null){
      this.reservationFormStepperService.reservationPhaseValueChanged(event.value);
    }
  }

  setChanges(value: number | null): void{
    switch (value){
      case 0: {
        this.dateDiv.nativeElement.style.color = 'orangered';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
        this.summaryDiv.nativeElement.style.color = '#B4B4B4';
        break;
      }
      case 1: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = 'orangered';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
        this.summaryDiv.nativeElement.style.color = '#B4B4B4';
        break;
      }
      case 2: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = 'orangered';
        this.summaryDiv.nativeElement.style.color = '#B4B4B4';
        break;
      }
      case 3: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
        this.summaryDiv.nativeElement.style.color = 'orangered';
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.phaseValueSubscription.unsubscribe();
  }
}
