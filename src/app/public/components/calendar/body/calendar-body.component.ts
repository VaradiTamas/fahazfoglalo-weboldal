import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {Subscription} from 'rxjs';
import {CalendarService} from '../services/calendar.service';
import {FirstCalendarHeaderComponent} from '../headers/first-calendar-header/first-calendar-header.component';
import {SecondCalendarHeaderComponent} from '../headers/second-calendar-header/second-calendar-header.component';
import {ReservationFormStepsService} from '../../reservation-form/reservation-form-steps/reservation-form-steps.service';
import {CalendarDay, CalendarDayState} from '../../../../models/calendar-day.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.css']
})
export class CalendarBodyComponent implements OnInit, OnDestroy{
  @Input() calendarType: string;
  @Input() selectedStartDate: Date;
  @Input() selectedEndDate: Date;
  calendarDays: CalendarDay[] = [];
  initialDate = new Date();
  isLoaded = false;
  private header;
  private calendarDaysSubscription: Subscription;
  private selectedDatesSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public calendarService: CalendarService, public reservationFormStepsService: ReservationFormStepsService) { }

  ngOnInit(): void {
    if (this.calendarType === 'first'){
      this.header = FirstCalendarHeaderComponent;
      this.calendarService.getCalendarDays(this.initialDate.getFullYear(), this.initialDate.getMonth());
    } else if (this.calendarType === 'second'){
      this.header = SecondCalendarHeaderComponent;
      this.initialDate.setMonth(this.initialDate.getMonth() + 1);
    }
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.selectedDatesSubscription = this.calendarService.getSelectedDatesUpdateListener()
      .subscribe((selectedDates) => {
        this.selectedStartDate = selectedDates.startDate;
        this.selectedEndDate = selectedDates.endDate;
      });
    this.calendarDaysSubscription = this.calendarService.getCalendarDaysUpdateListener()
      .subscribe((subData) => {
        this.calendarDays = subData.calendarDays;
        this.designCalendar();
      });
  }

  onSelectedDateChange(chosenDate: Date): void {
    this.updateSelectedDates(chosenDate);
    this.calendarService.selectedDatesChanged(this.selectedStartDate, this.selectedEndDate);
    this.reservationFormStepsService.fromDateIsChanged(this.selectedStartDate);
    this.reservationFormStepsService.toDateIsChanged(this.selectedEndDate);
  }

  updateSelectedDates(chosenDate: Date): void {
    if (this.selectedStartDate !== null) {
      this.selectedEndDate = chosenDate;
    } else {
      this.selectedStartDate = chosenDate;
    }
  }

  private designCalendar(): void{
    this.isLoaded = false;

    this.dateClass = (cellDate, view) => {
      let dateState: CalendarDayState;
      if (view === 'month') {
        this.calendarDays.forEach((calendarDay) => {
          if (this.areDatesOnSameDay(calendarDay.date, cellDate)) {
            dateState = calendarDay.state;
          }
        });

        switch (dateState) {
          case CalendarDayState.FullyFree: {
            return 'fully-free-dates';
          }
          case CalendarDayState.FullyReserved: {
            return 'fully-reserved-dates';
          }
          case CalendarDayState.FullySelected: {
            return 'fully-chosen-dates';
          }
          case CalendarDayState.FirstHalfFreeSecondHalfReserved: {
            return 'first-half-free-second-half-reserved';
          }
          case CalendarDayState.FirstHalfFreeSecondHalfSelected: {
            return 'first-half-reserved-second-half-chosen';
          }
          case CalendarDayState.FirstHalfReservedSecondHalfFree: {
            return 'first-half-reserved-second-half-free';
          }
          case CalendarDayState.FirstHalfReservedSecondHalfSelected: {
            return 'first-half-reserved-second-half-chosen';
          }
          case CalendarDayState.FirstHalfSelectedSecondHalfFree: {
            return 'first-half-chosen-second-half-free';
          }
          case CalendarDayState.FirstHalfSelectedSecondHalfReserved: {
            return 'first-half-chosen-second-half-reserved';
          }
        }
      }
    };

    this.dateFilter = (d: Date | null): boolean => {
      const calendarDate = d || new Date();
      const today = new Date();
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      let isSelectable = true;

      if (calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear()) {
        for (let i = 1; i < lastDayOfMonth.getDate(); i++){
          if (calendarDate.getDate() === i && i < today.getDate()) {
            isSelectable = false;
          }
        }
      }

      return isSelectable;
    };

    this.isLoaded = true;
  }

  areDatesOnSameDay(date: Date, date2: Date): boolean {
    const date1 = new Date(date);
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  ngOnDestroy(): void {
    this.calendarDaysSubscription.unsubscribe();
    this.selectedDatesSubscription.unsubscribe();
  }
}
