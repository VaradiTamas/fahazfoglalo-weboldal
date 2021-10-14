import { Component, OnInit } from '@angular/core';
import {Voucher} from '../model/voucher.model';
import {BookingService} from '../services/booking.service';
import {VoucherService} from '../services/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Booking} from "../model/booking.model";

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
  fromDate: Date = null;
  toDate: Date = null;
  public selectedTabIndex = 0;
  private numberOfRadioButtonThatIsSelected: number = 1;

  constructor(private bookingService: BookingService,
              private voucherService: VoucherService,
              public route: ActivatedRoute,
              public router: Router) {}

  ngOnInit() {}

  onRadioButtonSelected(numOfRadioButton: number): void{
    this.numberOfRadioButtonThatIsSelected = numOfRadioButton;
  }

  isRadioButtonSelected(numOfRadioButton: number): boolean{
    return this.numberOfRadioButtonThatIsSelected === numOfRadioButton;
  }

  onSelectedStartDateChanged(chosenDate: {date: Date}): void{
    this.fromDate = chosenDate.date;
  }

  onSelectedEndDateChanged(chosenDate: {date: Date}): void{
    this.toDate = chosenDate.date;
  }

  onNavigationButtonClicked(index: number): void{
    this.selectedTabIndex = index;
  }

  onVoucherClick(): void{
    this.possessVoucher = !this.possessVoucher;
  }

  onSubmit(form: NgForm): void{
    if (form.invalid) {
      return;
    }
    const value = form.value;
    let offerName: string;
    if (this.isVoucherValid){
      offerName = 'voucher';
    }else{
      offerName = 'általános';
    }
    const formBooking = {
      id: this.bookingId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      tel: value.tel,
      numOfChildren: value.numOfChildren,
      numOfAdults: value.numOfAdults,
      numOfBedrooms: this.numberOfRadioButtonThatIsSelected,
      comment: value.comment,
      isPaid: false,
      voucherId: this.voucher?.id,
      from: this.fromDate.toDateString(),
      to: this.toDate.toDateString(),
      offerName: offerName
    };
    this.bookingService.addBooking(formBooking);
    this.bookingService.sendBookingConfirmationEmail(formBooking);
    form.reset();
    this.router.navigate(['/home']);
  }

  onCheckVoucher(form: NgForm): void{
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
      if(this.voucher.id === value.voucherId){
        this.isVoucherValid = true;
      }
      else{
        this.isVoucherValid = false;
      }
      this.alreadyCheckedVoucher = true;
    });
  }
}
