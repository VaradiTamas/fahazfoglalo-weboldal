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
  @Input() fromDate: Date;
  @Input() toDate: Date;
  calendarDays: CalendarDay[] = [];
  initialDate = new Date();
  isLoaded = false;
  private calendarDaysSubscription: Subscription;
  private selectedDatesSubscription: Subscription;
  private header;
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
        this.fromDate = selectedDates.startDate;
        this.toDate = selectedDates.endDate;
        this.setCalendarDaysStatuses();
        this.designCalendar();
      });
    this.calendarDaysSubscription = this.calendarService.getCalendarDaysUpdateListener()
      .subscribe((subData) => {
        this.calendarDays = subData.calendarDays;
        this.setCalendarDaysStatuses();
        this.designCalendar();
      });
  }

  private setCalendarDaysStatuses(): void {
    this.clearCalendarDaysSelectedStatuses();

    if (this.fromDate === null) {
      return;
    }

    const indexOfSelectedStartDate = this.setCalendarDayStatusForSelectedStartDate();
    if (this.toDate !== null) {
      const indexOfSelectedEndDate = this.setCalendarDayStatusForSelectedEndDate();
      this.setCalendarDayStatusBetweenSelectedDates(indexOfSelectedStartDate, indexOfSelectedEndDate);
    }
  }

  private clearCalendarDaysSelectedStatuses(): void {
    for (const calendarDay of this.calendarDays) {
      switch (calendarDay.state) {
        case CalendarDayState.FullySelected: {
          calendarDay.state = CalendarDayState.FullyFree;
          break;
        }
        case CalendarDayState.FirstHalfSelectedSecondHalfFree: {
          calendarDay.state = CalendarDayState.FullyFree;
          return;   // as this is the last day of the selection
        }
        case CalendarDayState.FirstHalfSelectedSecondHalfReserved: {
          calendarDay.state = CalendarDayState.FirstHalfFreeSecondHalfReserved;
          return;   // as this is the last day of the selection
        }
        case CalendarDayState.FirstHalfFreeSecondHalfSelected: {
          calendarDay.state = CalendarDayState.FullyFree;
          break;
        }
        case CalendarDayState.FirstHalfReservedSecondHalfSelected: {
          calendarDay.state = CalendarDayState.FirstHalfReservedSecondHalfFree;
          break;
        }
      }
    }
  }

  private setCalendarDayStatusForSelectedStartDate(): number {
    const indexOfSelectedStartDate = this.calendarService.getCalendarDayIndex(this.fromDate);
    if (indexOfSelectedStartDate > 0) {
      if (this.calendarDays[indexOfSelectedStartDate - 1].isReserved) {
        this.calendarDays[indexOfSelectedStartDate].state = CalendarDayState.FirstHalfReservedSecondHalfSelected;
      } else {
        this.calendarDays[indexOfSelectedStartDate].state = CalendarDayState.FirstHalfFreeSecondHalfSelected;
      }
    }
    return indexOfSelectedStartDate;
  }

  private setCalendarDayStatusBetweenSelectedDates(from: number, to: number): void {
    for (let i = from + 1; i < to; i++) {
      this.calendarDays[i].state = CalendarDayState.FullySelected;
    }
  }

  private setCalendarDayStatusForSelectedEndDate(): number {
    const indexOfSelectedEndDate = this.calendarService.getCalendarDayIndex(this.toDate);
    if (indexOfSelectedEndDate > 0) {
      if (this.calendarDays[indexOfSelectedEndDate].isReserved) {
        this.calendarDays[indexOfSelectedEndDate].state = CalendarDayState.FirstHalfSelectedSecondHalfReserved;
      } else {
        this.calendarDays[indexOfSelectedEndDate].state = CalendarDayState.FirstHalfSelectedSecondHalfFree;
      }
    }
    return indexOfSelectedEndDate;
  }

  onSelectedDateChange(selectedDate: Date): void {
    this.updateSelectedDates(selectedDate);
    this.calendarService.selectedDatesChanged(this.fromDate, this.toDate);
    this.reservationFormStepsService.fromDateIsChanged(this.fromDate);
    this.reservationFormStepsService.toDateIsChanged(this.toDate);
  }

  updateSelectedDates(selectedDate: Date): void {
    const selectedCalendarDay = this.calendarService.getCalendarDay(selectedDate);
    // fromDate is already selected
    if (this.fromDate) {
      // if we click on the start date all the selected dates should disappear
      if (this.calendarService.areDatesOnSameDay(this.fromDate, selectedDate)) {
        this.fromDate = null;
        this.toDate = null;
      }
      // if the selected date is before the start date and is not reserved, it should be the new from date
      else if (selectedDate < this.fromDate && !selectedCalendarDay.isReserved) {
        this.fromDate = selectedDate;
        this.toDate = null;
      }
      // if the selected date is after the start date
      else {
        // maximum reservation period is 2 months
        if (!this.calendarService.isSelectedDateWithinMaximumPeriod(this.fromDate, selectedDate)) {
          this.fromDate = selectedDate;
          this.toDate = null;
          return;
        }
        // if there are no reserved dates between from and selected dates
        if (!this.calendarService.areThereReservedDatesBetween(this.fromDate, selectedDate)) {
          // if to date is not selected yet the selected date should be the to date
          if (!this.toDate) {
            this.toDate = selectedDate;
          }
          // if to date is already selected and the selected date is not reserved, the selected date should be the new from date
          else if (!selectedCalendarDay.isReserved) {
            this.fromDate = selectedDate;
            this.toDate = null;
          }
        }
        // if there are some reserved dates between from and selected dates and the selected date is not reserved
        else if (!selectedCalendarDay.isReserved) {
          this.fromDate = selectedDate;
          this.toDate = null;
        }
      }
    }
    // fromDate is not selected yet and the selected date is not reserved
    else if (!selectedCalendarDay.isReserved) {
      this.fromDate = selectedDate;
      this.toDate = null;
    }
  }

  private designCalendar(): void{
    this.isLoaded = false;

    this.paintDates();
    this.filterDates();

    this.isLoaded = true;
  }

  private paintDates(): void {
    this.dateClass = (cellDate, view) => {
      let dateState: CalendarDayState;
      if (view === 'month') {
        const calendarDay = this.calendarService.getCalendarDay(cellDate);
        dateState = calendarDay.state;

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
            return 'first-half-free-second-half-chosen';
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
  }

  // disabling the dates before today
  private filterDates(): void {
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
  }

  ngOnDestroy(): void {
    this.calendarDaysSubscription.unsubscribe();
    this.selectedDatesSubscription.unsubscribe();
  }
}
