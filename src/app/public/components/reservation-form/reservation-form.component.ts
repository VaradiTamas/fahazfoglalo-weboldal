import {Component, HostListener, OnInit, AfterViewInit} from '@angular/core';
import {Voucher} from '../../../models/voucher.model';
import {BookingService} from '../../../services/booking.service';
import {VoucherService} from '../../../services/voucher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Booking} from '../../../models/booking.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit, AfterViewInit {
  booking: Booking;
  voucher: Voucher;
  possessVoucher = false;
  isVoucherValid = false;
  alreadyCheckedVoucher = false;
  private bookingId: string = null;
  fromDate: Date = null;
  toDate: Date = null;
  public selectedTabIndex = 0;
  private numberOfRadioButtonThatIsSelected = 1;
  mobileScreen = true;
  personalDataLabel: string;
  dateLabel: string;
  guestsLabel: string;
  bedroomsLabel: string;

  constructor(private bookingService: BookingService,
              private voucherService: VoucherService,
              public route: ActivatedRoute,
              public router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void{
    this.isMobileScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.isMobileScreen();
  }

  isMobileScreen(): void{
    if (window.innerWidth <= 768){
      if (this.selectedTabIndex === 0){
        document.getElementById('secondCalendar').style.display = 'none';
      }
      this.personalDataLabel = '4';
      this.dateLabel = '1';
      this.guestsLabel = '3';
      this.bedroomsLabel = '2';
      this.mobileScreen = true;
    } else {
      if (this.selectedTabIndex === 0 ){
        document.getElementById('secondCalendar').style.display = 'block';
      }
      this.personalDataLabel = 'Személyes adatok';
      this.dateLabel = 'Időpont választása';
      this.guestsLabel = 'Vendégek száma';
      this.bedroomsLabel = 'Hálószobák száma';
      this.mobileScreen = false;
    }
  }

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

  onVoucherClick(): void{
    this.possessVoucher = !this.possessVoucher;
  }

  onSelectedIndexChange(index: number): void{
    this.selectedTabIndex = index;
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
      from: this.fromDate,
      to: this.toDate,
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
