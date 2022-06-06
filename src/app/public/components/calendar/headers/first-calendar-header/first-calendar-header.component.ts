import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';
import {CalendarService} from '../../services/calendar.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './first-calendar-header.component.html',
  styleUrls: ['./first-calendar-header.component.css']
})
export class FirstCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  private nextClickedSubscription: Subscription;
  private today = new Date();
  public isPreviousArrowDisabled = true;
  public isNextArrowDisabled = true;

  constructor(
    private calendarService: CalendarService,
    private calendar: MatCalendar<D>, private dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.nextClickedSubscription = this.calendarService.getNextClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
        if (
          this.today.getMonth() === this.dateAdapter.getMonth(this.calendar.activeDate) &&
          this.today.getFullYear() === this.dateAdapter.getYear(this.calendar.activeDate)
        ) {
          this.isPreviousArrowDisabled = true;
        } else {
          this.isPreviousArrowDisabled = false;
        }
      });
    this.setNextButton();
  }

  get periodLabel(): string {
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setNextButton();
  }

  previousClicked(): void {
    this.calendarService.getCalendarDays(
      this.dateAdapter.getYear(this.calendar.activeDate),
      this.dateAdapter.getMonth(this.calendar.activeDate)
    );
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
    this.calendarService.getCalendarDays(
      this.dateAdapter.getYear(this.calendar.activeDate),
      this.dateAdapter.getMonth(this.calendar.activeDate)
    );
    this.calendarService.onPreviousClicked();
    this.setPreviousButton();
  }

  nextClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    this.calendarService.getCalendarDays(
      this.dateAdapter.getYear(this.calendar.activeDate),
      this.dateAdapter.getMonth(this.calendar.activeDate)
    );
    const activeDateCopy = new Date();
    activeDateCopy.setMonth(this.dateAdapter.getMonth(this.calendar.activeDate));
    activeDateCopy.setFullYear(this.dateAdapter.getYear(this.calendar.activeDate));
    activeDateCopy.setMonth(activeDateCopy.getMonth() + 1);
    this.calendarService.getCalendarDays(activeDateCopy.getFullYear(), activeDateCopy.getMonth());
    this.calendarService.onNextClicked();
    this.setPreviousButton();
  }

  setPreviousButton(): void{
    if (
      this.today.getMonth() === this.dateAdapter.getMonth(this.calendar.activeDate) &&
      this.today.getFullYear() === this.dateAdapter.getYear(this.calendar.activeDate)
    ){
      this.isPreviousArrowDisabled = true;
    } else {
      this.isPreviousArrowDisabled = false;
    }
  }

  setNextButton(): void{
    window.innerWidth <= 768 ? this.isNextArrowDisabled = false : this.isNextArrowDisabled = true;
  }

  ngOnDestroy(): void {
    this.nextClickedSubscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
