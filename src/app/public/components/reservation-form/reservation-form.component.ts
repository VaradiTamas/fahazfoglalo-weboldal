import {Component, HostListener, OnInit, AfterViewInit, Input} from '@angular/core';
import {Voucher} from '../../../models/voucher.model';
import {BookingService} from '../../../services/booking.service';
import {VoucherService} from '../../../services/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Booking} from '../../../models/booking.model';
import {Subscription} from 'rxjs';
import {ReservationFormStepperService} from './reservation-form-stepper/reservation-form-stepper.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit, AfterViewInit {
  @Input() packageType: string;
  phaseValue = 0;
  private phaseValueSubscription: Subscription;

  constructor(public reservationFormStepperService: ReservationFormStepperService) {}

  ngOnInit(): void {
    this.phaseValueSubscription = this.reservationFormStepperService.getReservationPhaseValueUpdateListener()
      .subscribe((subData) => {
        this.phaseValue = subData.reservationPhaseValue;
      });
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
