import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Booking } from '../../../../models/booking.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './booking-confirmation-dialog.component.html',
  styleUrls: ['./booking-confirmation-dialog.component.css']
})
export class BookingConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { booking: Booking }) {}

  ngOnInit(): void { console.log(this.data); }

}
