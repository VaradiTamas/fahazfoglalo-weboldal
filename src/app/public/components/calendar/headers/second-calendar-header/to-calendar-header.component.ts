import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';
import {SecondCalendarService} from '../../services/second-calendar-service';
import {FirstCalendarService} from '../../services/first-calendar-service';

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './to-calendar-header.component.html',
  styleUrls: ['./to-calendar-header.component.css']
})
export class ToCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  private previousClickedSubscription: Subscription;
  private nextClickedSubscription: Subscription;

  constructor(
    private firstCalendarService: FirstCalendarService,
    private secondCalendarService: SecondCalendarService,
    private calendar: MatCalendar<D>, private dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.previousClickedSubscription = this.firstCalendarService.getPreviousClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
      });
    this.nextClickedSubscription = this.firstCalendarService.getNextClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
      });
  }

  get periodLabel() {
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  nextClicked(): void {
    this.firstCalendarService.getReservedDays(this.dateAdapter.getYear(this.calendar.activeDate), this.dateAdapter.getMonth(this.calendar.activeDate));
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    this.secondCalendarService.getReservedDays(this.dateAdapter.getYear(this.calendar.activeDate), this.dateAdapter.getMonth(this.calendar.activeDate));
    this.secondCalendarService.onNextClicked();
  }

  ngOnDestroy() {
    this.previousClickedSubscription.unsubscribe();
    this.nextClickedSubscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
