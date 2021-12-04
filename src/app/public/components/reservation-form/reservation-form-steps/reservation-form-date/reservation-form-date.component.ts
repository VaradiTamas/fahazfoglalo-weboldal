import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReservationFormStepperService} from '../../reservation-form-stepper/reservation-form-stepper.service';
import {Booking} from '../../../../../models/booking.model';
import {ReservationFormStepsService} from '../reservation-form-steps.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-reservation-form-date',
  templateUrl: './reservation-form-date.component.html',
  styleUrls: ['./reservation-form-date.component.css']
})
export class ReservationFormDateComponent implements OnInit, AfterViewInit, OnDestroy {
  booking: Booking;
  fromDateText = 'Mettől';
  toDateText = 'Meddig';
  @ViewChild('secondCalendar') secondCalendar;
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

  ngAfterViewInit(): void{
    this.setSecondCalendarVisibility();
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

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.setSecondCalendarVisibility();
  }

  setSecondCalendarVisibility(): void{
    if (window.innerWidth < 768){
      this.secondCalendar.nativeElement.style.display = 'none';
    } else {
      this.secondCalendar.nativeElement.style.display = 'block';
    }
  }

  ngOnDestroy(): void {
    this.reservationFormStepsSubscription.unsubscribe();
  }
}
