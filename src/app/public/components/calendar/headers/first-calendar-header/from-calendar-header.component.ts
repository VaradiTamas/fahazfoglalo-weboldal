import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';
import {FirstCalendarService} from '../../services/first-calendar-service';
import {SecondCalendarService} from '../../services/second-calendar-service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-from-datepicker-header',
  templateUrl: './from-calendar-header.component.html',
  styleUrls: ['./from-calendar-header.component.css']
})
export class FromCalendarHeaderComponent<D> implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  private nextClickedSubscription: Subscription;
  private today = new Date();
  public isPreviousArrowDisabled = true;
  public isNextArrowDisabled = true;

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
    this.nextClickedSubscription = this.secondCalendarService.getNextClickedListener()
      .subscribe(() => {
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
        if (this.today.getMonth() === this.dateAdapter.getMonth(this.calendar.activeDate) && this.today.getFullYear() === this.dateAdapter.getYear(this.calendar.activeDate)){
          this.isPreviousArrowDisabled = true;
        } else {
          this.isPreviousArrowDisabled = false;
        }
      });
    this.setNextButton();
  }

  get periodLabel() {
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.setNextButton();
  }

  previousClicked(): void {
    this.secondCalendarService.getReservedDays(this.dateAdapter.getYear(this.calendar.activeDate), this.dateAdapter.getMonth(this.calendar.activeDate));
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
    this.firstCalendarService.getReservedDays(this.dateAdapter.getYear(this.calendar.activeDate), this.dateAdapter.getMonth(this.calendar.activeDate));
    this.firstCalendarService.onPreviousClicked();
    this.setPreviousButton();
  }

  nextClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    this.firstCalendarService.getReservedDays(this.dateAdapter.getYear(this.calendar.activeDate), this.dateAdapter.getMonth(this.calendar.activeDate));
    const activeDateCopy = new Date();
    activeDateCopy.setMonth(this.dateAdapter.getMonth(this.calendar.activeDate));
    activeDateCopy.setFullYear(this.dateAdapter.getYear(this.calendar.activeDate));
    activeDateCopy.setMonth(activeDateCopy.getMonth() + 1);
    this.secondCalendarService.getReservedDays(activeDateCopy.getFullYear(), activeDateCopy.getMonth());
    this.firstCalendarService.onNextClicked();
    this.setPreviousButton();
  }

  setPreviousButton(): void{
    if (this.today.getMonth() === this.dateAdapter.getMonth(this.calendar.activeDate) && this.today.getFullYear() === this.dateAdapter.getYear(this.calendar.activeDate)){
      this.isPreviousArrowDisabled = true;
    } else {
      this.isPreviousArrowDisabled = false;
    }
  }

  setNextButton(): void{
    if (window.innerWidth <= 768){
      this.isNextArrowDisabled = false;
    } else {
      this.isNextArrowDisabled = true;
    }
  }

  ngOnDestroy(): void {
    this.nextClickedSubscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
