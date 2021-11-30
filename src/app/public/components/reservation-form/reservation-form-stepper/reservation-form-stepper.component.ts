import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {Subscription} from 'rxjs';
import {ReservationFormStepperService} from './reservation-form-stepper.service';

@Component({
  selector: 'app-reservation-form-stepper',
  templateUrl: './reservation-form-stepper.component.html',
  styleUrls: ['./reservation-form-stepper.component.css']
})
export class ReservationFormStepperComponent implements OnInit, AfterViewInit {

  phaseValue = 0;
  @ViewChild('dateDiv') dateDiv;
  @ViewChild('guestsDiv') guestsDiv;
  @ViewChild('bedroomsDiv') bedroomsDiv;
  @ViewChild('dataDiv') dataDiv;
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

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {

  }

  setChanges(value: number | null): void{
    switch (value){
      case 0: {
        this.dateDiv.nativeElement.style.color = '#1089FF';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.bedroomsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
       // this.router.navigate(['/email']);
        break;
      }
      case 1: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = '#1089FF';
        this.bedroomsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
        //this.router.navigate(['/name']);
        break;
      }
      case 2: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.bedroomsDiv.nativeElement.style.color = '#1089FF';
        this.dataDiv.nativeElement.style.color = '#B4B4B4';
        //this.router.navigate(['/password']);
        break;
      }
      case 3: {
        this.dateDiv.nativeElement.style.color = '#B4B4B4';
        this.guestsDiv.nativeElement.style.color = '#B4B4B4';
        this.bedroomsDiv.nativeElement.style.color = '#B4B4B4';
        this.dataDiv.nativeElement.style.color = '#1089FF';
        //this.router.navigate(['/subscription']);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.phaseValueSubscription.unsubscribe();
  }
}
