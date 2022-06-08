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
        this.selectedStartDate = selectedDates.startDate;
        this.selectedEndDate = selectedDates.endDate;
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
    if (this.selectedStartDate === null) {
      return;
    }

    const indexOfSelectedStartDate = this.setCalendarDayStatusForSelectedStartDate();

    if (this.selectedEndDate !== null) {
      const indexOfSelectedEndDate = this.setCalendarDayStatusForSelectedEndDate();
      this.setCalendarDayStatusBetweenSelectedDates(indexOfSelectedStartDate, indexOfSelectedEndDate);
    }
  }

  private setCalendarDayStatusForSelectedStartDate(): number {
    for (let i = 0; i < this.calendarDays.length; i++) {
      if (this.calendarService.areDatesOnSameDay(this.calendarDays[i].date, this.selectedStartDate)) {
        if (i > 0) {
          if (this.calendarDays[i - 1].isReserved) {
            this.calendarDays[i].state = CalendarDayState.FirstHalfReservedSecondHalfSelected;
          } else {
            this.calendarDays[i].state = CalendarDayState.FirstHalfFreeSecondHalfSelected;
          }
        }
        return i;
      }
    }
  }

  private setCalendarDayStatusBetweenSelectedDates(from: number, to: number): void {
    for (let i = from + 1; i < to; i++) {
      this.calendarDays[i].state = CalendarDayState.FullySelected;
    }
  }

  private setCalendarDayStatusForSelectedEndDate(): number {
    for (let i = 0; i < this.calendarDays.length; i++) {
      if (this.calendarService.areDatesOnSameDay(this.calendarDays[i].date, this.selectedEndDate)) {
        if (i > 0) {
          if (this.calendarDays[i].isReserved) {
            this.calendarDays[i].state = CalendarDayState.FirstHalfSelectedSecondHalfReserved;
          } else {
            this.calendarDays[i].state = CalendarDayState.FirstHalfSelectedSecondHalfFree;
          }
        }
        return i;
      }
    }
  }

  onSelectedDateChange(chosenDate: Date): void {
    this.updateSelectedDates(chosenDate);
    this.calendarService.selectedDatesChanged(this.selectedStartDate, this.selectedEndDate);
    this.reservationFormStepsService.fromDateIsChanged(this.selectedStartDate);
    this.reservationFormStepsService.toDateIsChanged(this.selectedEndDate);
  }

  updateSelectedDates(chosenDate: Date): void {
    if (this.selectedStartDate) {
      this.selectedEndDate = chosenDate;
    } else {
      this.selectedStartDate = chosenDate;
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
        this.calendarDays.forEach((calendarDay) => {
          if (this.calendarService.areDatesOnSameDay(calendarDay.date, cellDate)) {
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
