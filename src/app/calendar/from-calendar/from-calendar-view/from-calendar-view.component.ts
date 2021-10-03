import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {FromCalendarHeaderComponent} from '../from-calendar-header/from-calendar-header.component';
import {Subscription} from 'rxjs';
import {FromCalendarService} from '../from-calendar-service';

@Component({
  selector: 'app-from-calendar',
  templateUrl: './from-calendar-view.component.html',
  styleUrls: ['./from-calendar-view.component.css']
})
export class FromCalendarViewComponent implements OnInit, OnDestroy{
  @Output() fromDateChosen = new EventEmitter<{date: Date}>();
  @Output() toDateChosen = new EventEmitter<{date: Date}>();
  isLoaded = false;
  reservedDays: number[] = [];
  selectedStartDate: Date = null;
  selectedEndDate: Date = null;
  header = FromCalendarHeaderComponent;
  private currentYear: number;
  private currentMonth: number;
  private dateSubscription: Subscription;
  private fromDateSelectedSubscription: Subscription;
  private toDateSelectedSubscription: Subscription;
  dateFilter = (d: Date | null): boolean => true;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => '';

  constructor(public fromDateService: FromCalendarService) { }

  ngOnInit(): void {
    this.setMonthView();
  }

  private getFirstDayOfNextReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesBiggerThanSelectedDate: number[] = [];
    this.reservedDays.forEach((reservedDay) => {
      if (dayOfSelectedDate < reservedDay) {
        reservedDatesBiggerThanSelectedDate.push(reservedDay);
      }
    });
    if (reservedDatesBiggerThanSelectedDate === []){
      return 32;
    } else {
      let smallestOfReservedDatesBiggerThanSelectedDate = 31;
      reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
        if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
          smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
        }
      });
      return smallestOfReservedDatesBiggerThanSelectedDate;
    }
  }

  private getLastDayOfPreviousReservedDays(selectedDate: Date): number{
    const dayOfSelectedDate = selectedDate.getDate();
    const reservedDatesSmallerThanSelectedDate: number[] = [];
    this.reservedDays.forEach((reservedDay) => {
      if (dayOfSelectedDate > reservedDay) {
        reservedDatesSmallerThanSelectedDate.push(reservedDay);
      }
    });
    if (reservedDatesSmallerThanSelectedDate === []){
      return -1;
    } else {
      let biggestOfReservedDatesSmallerThanSelectedDate = -1;
      reservedDatesSmallerThanSelectedDate.forEach((reservedDay) => {
        if (reservedDay > biggestOfReservedDatesSmallerThanSelectedDate) {
          biggestOfReservedDatesSmallerThanSelectedDate = reservedDay;
        }
      });
      return biggestOfReservedDatesSmallerThanSelectedDate;
    }
  }

  addEvent(chosenDate: Date): void {
    if (this.selectedStartDate == null){
      this.selectedStartDate = chosenDate;
      this.fromDateChosen.emit({date: chosenDate});
    } else if (this.selectedStartDate.getMonth() === chosenDate.getMonth() && this.selectedStartDate.getFullYear() === chosenDate.getFullYear()){
      if (chosenDate.getDate() === this.selectedStartDate.getDate()) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.fromDateChosen.emit({date: null});
        this.toDateChosen.emit({date: null});
      } else if (this.selectedStartDate != null && this.selectedEndDate != null && this.selectedStartDate.getDate() > chosenDate.getDate() && chosenDate.getDate() > this.getLastDayOfPreviousReservedDays(this.selectedStartDate)) {
        this.selectedStartDate = chosenDate;
        this.fromDateChosen.emit({date: chosenDate});
      } else if (this.selectedEndDate == null && chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() < this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
        this.toDateChosen.emit({date: chosenDate});
      } else if (this.selectedEndDate != null && chosenDate.getDate() > this.selectedStartDate.getDate() && chosenDate.getDate() < this.getFirstDayOfNextReservedDays(this.selectedStartDate)){
        this.selectedEndDate = chosenDate;
        this.toDateChosen.emit({date: chosenDate});
      }
    } else {
      this.selectedStartDate = chosenDate;
      this.fromDateChosen.emit({date: chosenDate});
    }
    this.fromDateService.getReservedDays(chosenDate.getFullYear(), chosenDate.getMonth());
  }

  setMonthView(): void{
    const today: Date = new Date();
    this.fromDateService.getReservedDays(today.getFullYear(), today.getMonth());
    this.fromDateSelectedSubscription = this.fromDateService.getStartDateUpdateListener()
      .subscribe((subData) => {
        this.selectedStartDate = subData.startDate;
        this.fromDateService.getReservedDays(this.selectedStartDate.getFullYear(), this.selectedStartDate.getMonth());
      });
    this.toDateSelectedSubscription = this.fromDateService.getEndDateUpdateListener()
      .subscribe((subData) => {
        this.selectedEndDate = subData.endDate;
        this.fromDateService.getReservedDays(this.selectedEndDate.getFullYear(), this.selectedEndDate.getMonth());
      });
    this.dateSubscription = this.fromDateService.getReservedDaysUpdateListener()
      .subscribe((subData) => {
        //this.currentYear = subData.currentYear;
        //this.currentMonth = subData.currentMonth;
        this.reservedDays = subData.reservedDays;
        this.isLoaded = false;

        this.dateClass = (cellDate, view) => {
          if (view === 'month') {
            const date = cellDate.getDate();

            let isReserved = false;
            let isPending = false;
            let isChosen = false;

            const pendingDates: number[] = [];
            const chosenDates: number[] = [];

            if (this.selectedStartDate != null && this.selectedEndDate == null){
              const dayOfSelectedDate = this.selectedStartDate.getDate();
              const reservedDatesBiggerThanSelectedDate: number[] = [];
              this.reservedDays.forEach((reservedDay) => {
                if (dayOfSelectedDate < reservedDay) {
                  reservedDatesBiggerThanSelectedDate.push(reservedDay);
                }
              });
              if (reservedDatesBiggerThanSelectedDate === []){
               for (let i = dayOfSelectedDate + 1; i <= 31; i++){
                 pendingDates.push(i);
               }
             } else {
                let smallestOfReservedDatesBiggerThanSelectedDate = 31;
                reservedDatesBiggerThanSelectedDate.forEach((reservedDay) => {
                  if (reservedDay < smallestOfReservedDatesBiggerThanSelectedDate) {
                    smallestOfReservedDatesBiggerThanSelectedDate = reservedDay;
                  }
                });
                for (let i = dayOfSelectedDate + 1; i <= smallestOfReservedDatesBiggerThanSelectedDate; i++){
                  pendingDates.push(i);
                }
              }
              chosenDates.push(this.selectedStartDate.getDate());
            }

            if (this.selectedStartDate != null && this.selectedEndDate != null){
              for (let i = this.selectedStartDate.getDate(); i <= this.selectedEndDate.getDate(); i++){
                chosenDates.push(i);
              }
            }

            this.reservedDays.forEach((day) => {
              if (date === day) {
                isReserved = true;
              }
            });

            pendingDates.forEach((day) => {
              if (date === day) {
                isPending = true;
              }
            });

            chosenDates.forEach((day) => {
              if (date === day) {
                isChosen = true;
              }
            });

            if (isReserved) {
              return 'reserved-dates';
            } else if (isPending) {
              return 'pending-dates';
            } else if (isChosen){
              return 'chosen-dates';
            } else {
              return 'free-dates';
            }
          }

          return '';
        };

        this.dateFilter = (d: Date | null): boolean => {
          const date = (d || new Date()).getDate();

          let isFree = true;

          this.reservedDays.forEach((day) => {
            if (date === day) {
              isFree = false;
            }
          });
          return isFree;
        };

        this.isLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }
}
