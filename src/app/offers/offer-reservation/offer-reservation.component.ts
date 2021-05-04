import { Component, OnInit } from '@angular/core';
import {Booking} from "../../model/booking.model";
import {Voucher} from "../../model/voucher.model";
import {BookingService} from "../../services/booking.service";
import {VoucherService} from "../../services/voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-offer-reservation',
  templateUrl: './offer-reservation.component.html',
  styleUrls: ['./offer-reservation.component.css']
})
export class OfferReservationComponent implements OnInit {
  booking: Booking;
  private bookingId: string = null;

  constructor(private bookingService: BookingService,
              public route: ActivatedRoute,
              public router: Router) {}

  ngOnInit() {}

  onSubmit(form : NgForm){
    if(form.invalid) {
      return;
    }
    const value = form.value;

    const formBooking = {
      id: this.bookingId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      tel: value.tel,
      numOfChildren: value.numOfChildren,
      numOfAdults: value.numOfAdults,
      numOfBedrooms: value.numOfBedrooms,
      comment: value.comment,
      isPaid: false,
      voucherId: null,
      from: value.from,
      to: value.to,
      offerName: "hétköznapi"
    };
    this.bookingService.addBooking(formBooking);
    form.reset();
    this.router.navigate(["/home"]);
  }
}
