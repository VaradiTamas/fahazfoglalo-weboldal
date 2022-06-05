import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BookingService} from '../../../services/booking.service';
import {Booking} from '../../../models/booking.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Voucher} from '../../../models/voucher.model';
import {VoucherService} from '../../../services/voucher.service';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css']
})
export class NewBookingComponent implements OnInit, OnDestroy{
  booking: Booking;
  voucher: Voucher;
  isLoading = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  authSubscription: Subscription;
  private mode = 'create';
  private bookingId: string;

  constructor(private bookingService: BookingService,
              private voucherService: VoucherService,
              public route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.bookingId = paramMap.get('id');
        this.isLoading = true;
        this.bookingService.getBooking(this.bookingId).subscribe(bookingData => {
          this.isLoading = false;
          this.booking = {
            id: bookingData._id,
            voucherId: bookingData.voucherId,
            from: new Date(bookingData.from),
            to: new Date(bookingData.to),
            firstName: bookingData.firstName,
            lastName: bookingData.lastName,
            email: bookingData.email,
            tel: bookingData.tel,
            numOfChildren: bookingData.numOfChildren,
            numOfAdults: bookingData.numOfAdults,
            comment: bookingData.comment,
            paidAmount: bookingData.paidAmount,
          };
        });
      }
      else{
        this.mode = 'create';
        this.bookingId = null;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const value = form.value;
    const formBooking = {
      id: this.bookingId,
      voucherId: this.voucher?.id,
      from: value.from,
      to: value.to,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      tel: value.tel,
      numOfChildren: value.numOfChildren,
      numOfAdults: value.numOfAdults,
      comment: value.comment,
      paidAmount: 0
    };
    if (this.mode === 'create'){
      this.bookingService.addBooking(formBooking);
    }
    else{
      this.bookingService.updateBooking(formBooking);
    }
    form.reset();
    void this.router.navigate(['/admin/bookings']);
  }

  onCheckVoucher(form: NgForm): void {
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
      this.voucher.id === value.voucherId ? this.isVoucherValid = true : this.isVoucherValid = false;
      this.alreadyCheckedVoucher = true;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
