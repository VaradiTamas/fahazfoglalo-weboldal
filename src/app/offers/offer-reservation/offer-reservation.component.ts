import { Component, OnInit } from '@angular/core';
import {Booking} from "../../model/booking.model";
import {Voucher} from "../../model/voucher.model";
import {BookingService} from "../../services/booking.service";
import {VoucherService} from "../../services/voucher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ToCalendarService} from "../../calendar/to-calendar/to-calendar-service";
import {FromCalendarService} from "../../calendar/from-calendar/from-calendar-service";

@Component({
  selector: 'app-offer-reservation',
  templateUrl: './offer-reservation.component.html',
  styleUrls: ['./offer-reservation.component.css']
})
export class OfferReservationComponent implements OnInit {
  booking: Booking;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  private bookingId: string = null;

  constructor(private bookingService: BookingService,
              public route: ActivatedRoute,
              public router: Router,
              private toDateService: ToCalendarService,
              private fromDateService: FromCalendarService) {}

  ngOnInit() {}

  onDateSelectedChangeFromCalendar(chosenDate: {date: Date}): void{
    this.toDateService.selectedDateChanged(chosenDate.date);
  }

  onDateSelectedChangeToCalendar(chosenDate: {date: Date}): void{
    this.fromDateService.selectedDateChanged(chosenDate.date);
  }

  onSelectedStartDateChanged(chosenDate: {date: Date}): void{
    this.fromDate = chosenDate.date;
  }

  onSelectedEndDateChanged(chosenDate: {date: Date}): void{
    this.toDate = chosenDate.date;
  }

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
      from: this.fromDate.toDateString(),
      to: this.toDate.toDateString(),
      offerName: "hétköznapi"
    };
    this.bookingService.addBooking(formBooking);
    form.reset();
    this.router.navigate(["/home"]);
  }
}
