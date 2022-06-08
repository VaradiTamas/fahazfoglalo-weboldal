export interface CalendarDay {
  date: Date;
  isReserved: boolean;
  state: CalendarDayState;
}

export enum CalendarDayState {
  FullyFree = 'FULLY_FREE',
  FullyReserved = 'FULLY_RESERVED',
  FullySelected = 'FULLY_SELECTED',
  FirstHalfFreeSecondHalfReserved = 'FIRST_HALF_FREE_SECOND_HALF_RESERVED',
  FirstHalfFreeSecondHalfSelected = 'FIRST_HALF_FREE_SECOND_HALF_SELECTED',
  FirstHalfReservedSecondHalfFree = 'FIRST_HALF_RESERVED_SECOND_HALF_FREE',
  FirstHalfReservedSecondHalfSelected = 'FIRST_HALF_RESERVED_SECOND_HALF_RESERVED',
  FirstHalfSelectedSecondHalfReserved = 'FIRST_HALF_SELECTED_SECOND_HALF_RESERVED',
  FirstHalfSelectedSecondHalfFree = 'FIRST_HALF_SELECTED_SECOND_HALF_FREE',
}
