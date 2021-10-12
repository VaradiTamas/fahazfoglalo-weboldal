import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {MatCalendar} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {FromCalendarService} from "../from-calendar-service";
import {ToCalendarService} from "../../to-calendar/to-calendar-service";

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './from-calendar-header.component.html',
  styleUrls: ['./from-calendar-header.component.css']
})
export class FromCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private _destroyed = new Subject<void>();
  private nextClickedSubscription: Subscription;
  private today = new Date();
  public isPreviousArrowDisabled = true;

  constructor(
    private fromDateService: FromCalendarService,
    private toDateService: ToCalendarService,
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.nextClickedSubscription = this.toDateService.getNextClickedListener()
      .subscribe(() => {
        this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
        if (this.today.getMonth() === this._dateAdapter.getMonth(this._calendar.activeDate) && this.today.getFullYear() === this._dateAdapter.getYear(this._calendar.activeDate)){
          this.isPreviousArrowDisabled = true;
        } else {
          this.isPreviousArrowDisabled = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.nextClickedSubscription.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(): void {
    this.toDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
    this.fromDateService.getReservedDays(this._dateAdapter.getYear(this._calendar.activeDate), this._dateAdapter.getMonth(this._calendar.activeDate));
    this.fromDateService.onPreviousClicked();
    if (this.today.getMonth() === this._dateAdapter.getMonth(this._calendar.activeDate) && this.today.getFullYear() === this._dateAdapter.getYear(this._calendar.activeDate)){
      this.isPreviousArrowDisabled = true;
    } else {
      this.isPreviousArrowDisabled = false;
    }
  }
}
