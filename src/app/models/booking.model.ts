export interface Booking {
  id: string;
  from: Date;
  to: Date;
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
  numOfChildren: number;
  numOfAdults: number;
  comment: string;
  paidAmount: number;
}
