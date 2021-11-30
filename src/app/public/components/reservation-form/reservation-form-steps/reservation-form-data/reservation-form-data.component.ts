import { Component, OnInit } from '@angular/core';
import {Booking} from "../../../../../models/booking.model";
import {Voucher} from "../../../../../models/voucher.model";
import {VoucherService} from "../../../../../services/voucher.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-reservation-form-data',
  templateUrl: './reservation-form-data.component.html',
  styleUrls: ['./reservation-form-data.component.css']
})
export class ReservationFormDataComponent implements OnInit {
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;

  constructor(private voucherService: VoucherService) { }

  ngOnInit(): void {
  }

  onVoucherClick(): void{
    this.possessVoucher = !this.possessVoucher;
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
