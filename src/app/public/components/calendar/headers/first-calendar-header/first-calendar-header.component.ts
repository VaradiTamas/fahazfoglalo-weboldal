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
  private previousClickedSubscription: Subscription;
  private today = new Date();
  public isPreviousArrowDisabled = true;
  public isNextArrowDisabled = true;

  constructor(
    private calendarService: CalendarService,
    private calendar: MatCalendar<D>,
    private dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
    this.setPreviousButton();
    this.setNextButton();
    this.previousClickedSubscription = this.calendarService.getPreviousClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
        this.calendarService.updateCalendarDays(
          this.dateAdapter.getYear(this.calendar.activeDate),
          this.dateAdapter.getMonth(this.calendar.activeDate)
        );
        this.setPreviousButton();
      });
    this.nextClickedSubscription = this.calendarService.getNextClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
        this.calendarService.updateCalendarDays(
          this.dateAdapter.getYear(this.calendar.activeDate),
          this.dateAdapter.getMonth(this.calendar.activeDate)
        );
        this.setPreviousButton();
      });
  }

  private areDatesOnSameMonth(firstDate: Date, secondDate: DateAdapter<D>): boolean {
    const date1 = new Date(firstDate);
    const date2 = secondDate;
    return date1.getFullYear() === date2.getYear(this.calendar.activeDate)
      && date1.getMonth() === date2.getMonth(this.calendar.activeDate);
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
    this.calendarService.onPreviousClicked();
  }

  nextClicked(): void {
    this.calendarService.onNextClicked();
  }

  setPreviousButton(): void {
    if (this.areDatesOnSameMonth(this.today, this.dateAdapter)){
      this.isPreviousArrowDisabled = true;
    } else {
      this.isPreviousArrowDisabled = false;
    }
  }

  setNextButton(): void{
    window.innerWidth <= 768 ? this.isNextArrowDisabled = false : this.isNextArrowDisabled = true;
  }

  ngOnDestroy(): void {
    this.previousClickedSubscription.unsubscribe();
    this.nextClickedSubscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
