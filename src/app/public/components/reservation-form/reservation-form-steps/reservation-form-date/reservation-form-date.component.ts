import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReservationFormStepperService } from '../../reservation-form-stepper/reservation-form-stepper.service';
import { Booking } from '../../../../../models/booking.model';
import { ReservationFormStepsService } from '../reservation-form-steps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation-form-date',
  templateUrl: './reservation-form-date.component.html',
  styleUrls: ['./reservation-form-date.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReservationFormDateComponent implements OnInit, AfterViewInit, OnDestroy {
  booking: Booking;
  fromDateText = 'Mettől';
  toDateText = 'Meddig';
  isTooltipDisabled = false;
  @ViewChild('secondCalendar') secondCalendar;
  @ViewChild('tooltip') tooltip;
  private reservationFormStepsSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService,
              public reservationFormStepsService: ReservationFormStepsService) { }

  ngOnInit(): void {
    this.reservationFormStepsSubscription = this.reservationFormStepsService.getBookingUpdateListener()
      .subscribe((subData) => {
        this.booking = subData.booking;
        this.setFromDateText();
        this.setToDateText();
        this.setTooltip();
      });
    this.booking = this.reservationFormStepsService.getBooking();
    this.setFromDateText();
    this.setToDateText();
    this.setTooltip();
  }

  ngAfterViewInit(): void{
    this.setSecondCalendarVisibility();
  }

  setFromDateText(): void{
    if (this.booking.from != null){
      this.fromDateText = this.formatDateString(this.booking.from);
    } else {
      this.fromDateText = 'Mettől';
    }
  }

  setToDateText(): void{
    if (this.booking.to != null){
      this.toDateText = this.formatDateString(this.booking.to);
    } else {
      this.toDateText = 'Meddig';
    }
  }

  private formatDateString(date: Date): string {
    const yearString = date.getFullYear().toString();

    // for days and months if they are below 10 we have to put a 0 in front of them to make the text look nice
    // e.g. instead of 2022.1.2. it will be 2022.01.02.
    const month = date.getMonth() + 1;
    const monthString = month > 9 ? month.toString() : '0' + month.toString();
    const day = date.getDate();
    const dayString = day > 9 ? day.toString() : '0' + day.toString();

    return yearString + '.' + monthString + '.' + dayString + '.';
  }

  onDateTextClick(): void {
    this.tooltip.show();
  }

  setTooltip(): void {
    this.isTooltipDisabled = this.booking.from && this.booking.to ? true : false;
  }

  onReservationPhaseChange(phaseValue: number): void{
    this.reservationFormStepperService.reservationPhaseValueChanged(phaseValue);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
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
