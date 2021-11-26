import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Voucher} from '../../models/voucher.model';
import {VoucherService} from '../../services/voucher.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, OnDestroy, AfterViewInit {
  vouchers: Voucher[] = [];
  isLoading = false;
  totalVouchers = 0;
  vouchersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  serialNum: any;
  vouchersSubscription: Subscription;
  biggerThanMediumScreen = false;
  biggerThanLargeScreen = false;
  biggerThanXLargeScreen = false;

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

  ngAfterViewInit(): void{
    this.isMobileScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.isMobileScreen();
  }

  isMobileScreen(): void{
    if (window.innerWidth > 1550){
      this.biggerThanXLargeScreen = true;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = true;
    } else if (window.innerWidth > 1200){
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = true;
    } else if (window.innerWidth > 992) {
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = true;
      this.biggerThanLargeScreen = false;
    } else {
      this.biggerThanXLargeScreen = false;
      this.biggerThanMediumScreen = false;
      this.biggerThanLargeScreen = false;
    }
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
