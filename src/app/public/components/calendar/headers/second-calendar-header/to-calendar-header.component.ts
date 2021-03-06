import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {MatCalendar} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {SecondCalendarService} from "../../services/second-calendar-service";
import {FirstCalendarService} from "../../services/first-calendar-service";

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './to-calendar-header.component.html',
  styleUrls: ['./to-calendar-header.component.css']
})
export class ToCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private _destroyed = new Subject<void>();
  private previousClickedSubscription: Subscription;

  constructor(
    private fromDateService: FirstCalendarService,
    private toDateService: SecondCalendarService,
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.previousClickedSubscription = this.fromDateService.getPreviousClickedListener()
      .subscribe(() => {
        this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
      });
  }

  ngOnDestroy() {
    this.previousClickedSubscription.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  nextClicked(): void {
    this.fromDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
    this.toDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
    this.toDateService.onNextClicked();
  }
}
