import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './second-calendar-header.component.html',
  styleUrls: ['./second-calendar-header.component.css']
})
export class SecondCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  private previousClickedSubscription: Subscription;
  private nextClickedSubscription: Subscription;

  constructor(
    private calendarService: CalendarService,
    private calendar: MatCalendar<D>, private dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.previousClickedSubscription = this.calendarService.getPreviousClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
      });
    this.nextClickedSubscription = this.calendarService.getNextClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
      });
  }

  nextClicked(): void {
    this.calendarService.onNextClicked();
  }

  get periodLabel(): string {
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  ngOnDestroy(): void {
    this.previousClickedSubscription.unsubscribe();
    this.nextClickedSubscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
