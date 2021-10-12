import { Component, OnInit } from '@angular/core';
import {Booking} from "../model/booking.model";
import {Voucher} from "../model/voucher.model";
import {BookingService} from "../services/booking.service";
import {VoucherService} from "../services/voucher.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ToCalendarService} from "../calendar/to-calendar/to-calendar-service";
import {FromCalendarService} from "../calendar/from-calendar/from-calendar-service";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  private bookingId: string = null;
  fromDate: Date = new Date();
  toDate: Date = new Date();

  constructor(private bookingService: BookingService,
              private voucherService: VoucherService,
              private toDateService: ToCalendarService,
              private fromDateService: FromCalendarService,
              public route: ActivatedRoute,
              public router: Router) {}

  ngOnInit() {}

  onSelectedStartDateChanged(chosenDate: {date: Date}): void{
    this.fromDate = chosenDate.date;
  }

  onSelectedEndDateChanged(chosenDate: {date: Date}): void{
    this.toDate = chosenDate.date;
  }

  onVoucherClick(){
    this.possessVoucher=!this.possessVoucher;
  }

  onSubmit(form : NgForm){
    if(form.invalid) {
      return;
    }
    const value = form.value;
    var offerName: string;
    if(this.isVoucherValid){
      offerName = "voucher";
    }else{
      offerName = "általános";
    }
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
      voucherId: this.voucher?.id,
      from: this.fromDate.toDateString(),
      to: this.toDate.toDateString(),
      offerName: offerName
    };
    this.bookingService.addBooking(formBooking);
    this.bookingService.sendEmail(formBooking);
    form.reset();
    this.router.navigate(['/home']);
  }

  onCheckVoucher(form : NgForm){
    const value = form.value;
    this.voucherService.getVoucher(value.voucherId).subscribe(voucherData => {
      this.voucher = {
        id: voucherData._id,
        firstName: voucherData.firstName,
        lastName: voucherData.lastName,
        tel: voucherData.tel,
        email: voucherData.email,
        numOfNights: voucherData.numOfNights,
        numOfChildren: voucherData.numOfChildren,
        numOfAdults: voucherData.numOfAdults,
        numOfBedrooms: voucherData.numOfBedrooms,
        country: voucherData.country,
        postcode: voucherData.postcode,
        city: voucherData.city,
        address: voucherData.address,
        isPaid: voucherData.isPaid
      };
      if(this.voucher.id == value.voucherId){
        this.isVoucherValid = true;
      }
      else{
        this.isVoucherValid = false;
      }
      this.alreadyCheckedVoucher = true;
    });
  }
}
