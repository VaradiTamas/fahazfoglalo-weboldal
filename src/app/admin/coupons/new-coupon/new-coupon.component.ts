import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Voucher} from "../../../model/voucher.model";
import {VoucherService} from "../../../services/voucher.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})
export class NewCouponComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  voucher: Voucher;
  isLoading = false;
  private mode = 'create';
  private voucherId: string;

  constructor(private voucherService: VoucherService, public route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('id')) {
        this.mode = 'edit';
        this.voucherId = paramMap.get('id');
        this.isLoading = true;
        this.voucherService.getVoucher(this.voucherId).subscribe(voucherData => {
          this.isLoading = false;
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
        });
      }
      else{
        this.mode = 'create';
        this.voucherId = null;
      }
    });
  }

  onSubmit(form : NgForm){
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    const value = form.value;
    const formVoucher = {
      id: this.voucherId,
      firstName: value.firstName,
      lastName: value.lastName,
      tel: value.tel,
      email: value.email,
      numOfNights: value.numOfNights,
      numOfChildren: value.numOfChildren,
      numOfAdults: value.numOfAdults,
      numOfBedrooms: value.numOfBedrooms,
      country: value.country,
      postcode: value.postcode,
      city: value.city,
      address: value.address,
      isPaid: value.isPaid
    };
    if(this.mode === 'create'){
      this.voucherService.addVoucher(formVoucher);
    }
    else{
      this.voucherService.updateVoucher(formVoucher);
    }
    form.reset();
    this.router.navigate(["/admin/vouchers"]);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
