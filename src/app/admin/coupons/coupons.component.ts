import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Voucher} from '../../models/voucher.model';
import {VoucherService} from '../../services/voucher.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, OnDestroy {
  vouchers: Voucher[] = [];
  isLoading = false;
  totalVouchers = 0;
  vouchersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  serialNum: any;
  private vouchersSubscription: Subscription;

  constructor(public voucherService: VoucherService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.voucherService.getVouchers(this.vouchersPerPage, this.currentPage);
    this.vouchersSubscription = this.voucherService.getVoucherUpdateListener()
      .subscribe((voucherData: {vouchers: Voucher[], voucherCount: number}) => {
        this.isLoading = false;
        this.totalVouchers = voucherData.voucherCount;
        this.vouchers = voucherData.vouchers;
      });
  }

  onChangedPage(pageData: PageEvent): void{
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vouchersPerPage = pageData.pageSize;
    this.voucherService.getVouchers(this.vouchersPerPage, this.currentPage);
  }

  onDelete(voucherId: string): void{
    this.isLoading = true;
    this.voucherService.deleteVoucher(voucherId).subscribe(() => {
      this.voucherService.getVouchers(this.vouchersPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  Search(){
    if (this.serialNum == ''){
      this.ngOnInit();
    }else{
      this.vouchers = this.vouchers.filter(res => {
        return res.id.toLocaleLowerCase().match(this.serialNum.toLocaleLowerCase());
      });
    }
  }

  ngOnDestroy(): void {
    this.vouchersSubscription.unsubscribe();
  }
}
