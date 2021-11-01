import { Component, OnInit } from '@angular/core';
import {Voucher} from '../../../model/voucher.model';
import {BookingService} from '../../../services/booking.service';
import {VoucherService} from '../../../services/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Booking} from '../../../model/booking.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  ngOnInit(): void {}

}
