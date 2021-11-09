import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Voucher} from '../../../../models/voucher.model';
import {VoucherService} from '../../../../services/voucher.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService} from '../../../../admin/auth/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-voucher-reservation',
  templateUrl: './voucher-reservation.component.html',
  styleUrls: ['./voucher-reservation.component.css']
})
export class VoucherReservationComponent implements OnInit {
  voucher: Voucher;
  isLoading = false;
  private voucherId: string = null;

  constructor(private voucherService: VoucherService, public route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

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
      isPaid: false
    };

    this.voucherService.addVoucher(formVoucher);
    this.router.navigate(['/voucher/information']);
    form.reset();
  }
}
