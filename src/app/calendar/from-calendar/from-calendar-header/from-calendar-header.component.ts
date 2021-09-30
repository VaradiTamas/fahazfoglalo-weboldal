import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {MatCalendar} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {FromCalendarService} from "../from-calendar-service";

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './from-calendar-header.component.html',
  styleUrls: ['./from-calendar-header.component.css']
})
export class FromCalendarHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private fromDateService: FromCalendarService,
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
    this.fromDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
  }

  nextClicked(): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
    this.fromDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
  }
}
