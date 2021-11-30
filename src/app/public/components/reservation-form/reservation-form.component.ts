import {Component, HostListener, OnInit, AfterViewInit, Input} from '@angular/core';
import {Voucher} from '../../../models/voucher.model';
import {BookingService} from '../../../services/booking.service';
import {VoucherService} from '../../../services/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Booking} from '../../../models/booking.model';
import {Subscription} from 'rxjs';
import {ReservationFormStepperService} from './reservation-form-stepper/reservation-form-stepper.service';
import {ReservationFormStepsService} from "./reservation-form-steps/reservation-form-steps.service";

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit, AfterViewInit {
  @Input() packageType: string;
  phaseValue = 0;
  private phaseValueSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService, public reservationFormStepsService: ReservationFormStepsService) {}

  ngOnInit(): void {
    this.phaseValueSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        this.phaseValue = subData.reservationPhaseValue;
      });
    this.reservationFormStepsService.offerNameChanged(this.packageType);
  }

  ngAfterViewInit(): void{
    this.isMobileScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.isMobileScreen();
  }

  isMobileScreen(): void{
  }
}
