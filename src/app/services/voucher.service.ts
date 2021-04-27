import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {Voucher} from "../model/voucher.model";

@Injectable({providedIn: 'root'})
export class VoucherService{
  private vouchers: Voucher[] = [];
  private vouchersUpdated = new Subject<{vouchers: Voucher[], voucherCount: number}>()

  constructor(private http: HttpClient, private router: Router) {}

  getVouchers(vouchersPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${vouchersPerPage}&page=${currentPage}`;
    this.http.get<{message: string, vouchers: any, maxVouchers: number}>('http://localhost:3000/admin/vouchers' + queryParams)
      .pipe(
        map((serverVouchers) => {
          return {vouchers: serverVouchers.vouchers.map(voucher => {
            return {
              firstName: voucher.firstName,
              lastName: voucher.lastName,
              tel: voucher.tel,
              email: voucher.email,
              numOfNights: voucher.numOfNights,
              numOfChildren: voucher.numOfChildren,
              numOfAdults: voucher.numOfAdults,
              numOfBedrooms: voucher.numOfBedrooms,
              country: voucher.country,
              postcode: voucher.postcode,
              city: voucher.city,
              address: voucher.address,
              isPaid: voucher.isPaid,
              id: voucher._id,
            };
          }), maxVouchers: serverVouchers.maxVouchers};
      }))
      .subscribe((transformedVouchers)=>{
        this.vouchers = transformedVouchers.vouchers;
        this.vouchersUpdated.next({
          vouchers: [...this.vouchers],
          voucherCount: transformedVouchers.maxVouchers
        });
      });
  }

  addVoucher(voucher: Voucher){
    this.http.post<{message: string, voucherId: string}>('http://localhost:3000/admin/vouchers', voucher)
      .subscribe((responseData)=>{
        //this.router.navigate(["/admin/vouchers"]);
      });
  }

  deleteVoucher(voucherId: string){
    return this.http.delete('http://localhost:3000/admin/vouchers/delete/' + voucherId);
  }

  updateVoucher(voucher: Voucher){
    this.http.put('http://localhost:3000/admin/vouchers/edit/' + voucher.id, voucher)
      .subscribe((responseData)=>{
        this.router.navigate(["/admin/vouchers"]);
      });
  }

  getVoucher(id: string){
    return this.http.get<{
      _id: string,
      firstName: string,
      lastName: string,
      email: string,
      tel: string,
      numOfChildren: number,
      numOfAdults: number,
      numOfBedrooms: number,
      numOfNights: number,
      country: string,
      postcode: number,
      city: string,
      address: string,
      isPaid: boolean,
    }>('http://localhost:3000/admin/vouchers/' + id);
  }

  getVoucherUpdateListener(){
    return this.vouchersUpdated.asObservable();
  }
}
