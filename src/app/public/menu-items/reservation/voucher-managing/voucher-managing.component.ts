import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voucher-managing',
  templateUrl: './voucher-managing.component.html',
  styleUrls: ['./voucher-managing.component.css']
})
export class VoucherManagingComponent implements OnInit {
  possessVoucher: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onVoucherClick(){
    this.possessVoucher=!this.possessVoucher;
  }

}
