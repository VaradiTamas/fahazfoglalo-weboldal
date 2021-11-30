import {Injectable} from '@angular/core';
import {Booking} from '../../../../models/booking.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReservationFormStepsService {
  private booking: Booking = new class implements Booking {
    comment: string;
    email: string;
    firstName: string;
    from: Date;
    id: string;
    isPaid: boolean;
    lastName: string;
    numOfAdults: number;
    numOfBedrooms: number;
    numOfChildren: number;
    offerName: string;
    tel: string;
    to: Date;
    voucherId: string;
  };
  private bookingUpdated = new Subject<{booking: Booking}>();

  constructor() {}

  getBooking(): Booking{
    return this.booking;
  }

  fromDateIsChanged(fromDate: Date): void{
    this.booking.from = fromDate;
    this.bookingUpdated.next({booking: this.booking});
  }

  toDateIsChanged(toDate: Date): void{
    this.booking.to = toDate;
    this.bookingUpdated.next({booking: this.booking});
  }

  numberOfAdultsChanged(numOfAdults: number): void{
    this.booking.numOfAdults = numOfAdults;
    this.bookingUpdated.next({booking: this.booking});
  }

  numberOfChildrenChanged(numOfChildren: number): void{
    this.booking.numOfChildren = numOfChildren;
    this.bookingUpdated.next({booking: this.booking});
  }

  numberOfBedroomsChanged(numOfBedrooms: number): void{
    this.booking.numOfBedrooms = numOfBedrooms;
    this.bookingUpdated.next({booking: this.booking});
  }

  lastNameChanged(lastName: string): void{
    this.booking.lastName = lastName;
    this.bookingUpdated.next({booking: this.booking});
  }

  firstNameChanged(firstName: string): void{
    this.booking.firstName = firstName;
    this.bookingUpdated.next({booking: this.booking});
  }

  telephoneNumberChanged(tel: string): void{
    this.booking.tel = tel;
    this.bookingUpdated.next({booking: this.booking});
  }

  commentChanged(comment: string): void{
    this.booking.comment = comment;
    this.bookingUpdated.next({booking: this.booking});
  }

  emailChanged(email: string): void{
    this.booking.email = email;
    this.bookingUpdated.next({booking: this.booking});
  }

  voucherIdChanged(voucherId: string): void{
    this.booking.voucherId = voucherId;
    this.booking.offerName = 'voucher';
    this.bookingUpdated.next({booking: this.booking});
  }

  offerNameChanged(offerName: string): void{
    this.booking.offerName = offerName;
    this.bookingUpdated.next({booking: this.booking});
  }

  getBookingUpdateListener(){
    return this.bookingUpdated.asObservable();
  }
}
