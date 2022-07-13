import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/app-header/header.component';
import { VoucherReservationComponent } from './public/menu-items/voucher/voucher-reservation/voucher-reservation.component';
import { PricesComponent } from './public/menu-items/prices/prices.component';
import { QuestionsComponent } from './public/menu-items/questions/questions.component';
import { AboutUsComponent } from './public/menu-items/about-us/about-us.component';
import { ReservationComponent } from './public/menu-items/reservation/reservation.component';
import { HomeComponent } from './public/menu-items/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './admin/auth/auth-interceptor';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ErrorDialogComponent } from './error-handling/error-dialog/error-dialog.component';
import { ErrorInterceptor } from './error-handling/error-interceptor';
import { AppPageTitleComponent } from './layout/app-page-title/app-page-title.component';
import { ImagesLayoutComponent } from './public/components/gallery/images-layout/images-layout.component';
import { OutsideGalleryComponent } from './public/menu-items/gallery/outside/outside-gallery.component';
import { GalleryLayoutComponent } from './layout/gallery-layout/gallery-layout.component';
import { GalleryHeaderComponent } from './layout/gallery-header/gallery-header.component';
import { VoucherCardComponent } from './public/menu-items/voucher/voucher-card/voucher-card.component';
import { VoucherLayoutComponent } from './layout/voucher-layout/voucher-layout.component';
import { PopupTelephoneDialogComponent } from './layout/app-header/popup-telephone-dialog/popup-telephone-dialog.component';
import { ImagesCarouselComponent } from './public/components/gallery/images-carousel/images-carousel.component';
import { InsideGalleryComponent } from './public/menu-items/gallery/inside/inside-gallery.component';
import { FirstCalendarHeaderComponent } from './public/components/calendar/headers/first-calendar-header/first-calendar-header.component';
// tslint:disable-next-line:max-line-length
import { SecondCalendarHeaderComponent } from './public/components/calendar/headers/second-calendar-header/second-calendar-header.component';
import { CalendarBodyComponent } from './public/components/calendar/body/calendar-body.component';
import { ReservationFormComponent } from './public/components/reservation-form/reservation-form.component';
import { ReservationFormStepperComponent } from './public/components/reservation-form/reservation-form-stepper/reservation-form-stepper.component';
import { ReservationFormDateComponent } from './public/components/reservation-form/reservation-form-steps/reservation-form-date/reservation-form-date.component';
import { ReservationFormDataComponent } from './public/components/reservation-form/reservation-form-steps/reservation-form-data/reservation-form-data.component';
import { BookingConfirmationDialogComponent } from './public/components/reservation-form/confirmation-dialog/booking-confirmation-dialog.component';
import { ReservationFormSummaryComponent } from './public/components/reservation-form/reservation-form-steps/reservation-form-summary/reservation-form-summary.component';
import { TermsAndConditionsComponent } from './public/legal-things/terms-and-conditions/terms-and-conditions.component';
import { TemporaryVoucherComponent } from './public/menu-items/voucher/temporary-voucher/temporary-voucher.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AdminModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyApe9j6D7YzsQmdmpPOI5zuMO1NS4KCbCA'
    })
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    VoucherReservationComponent,
    PricesComponent,
    QuestionsComponent,
    AboutUsComponent,
    ReservationComponent,
    HomeComponent,
    AppLayoutComponent,
    ErrorDialogComponent,
    AppPageTitleComponent,
    ImagesLayoutComponent,
    OutsideGalleryComponent,
    GalleryLayoutComponent,
    GalleryHeaderComponent,
    VoucherCardComponent,
    VoucherLayoutComponent,
    FirstCalendarHeaderComponent,
    SecondCalendarHeaderComponent,
    CalendarBodyComponent,
    PopupTelephoneDialogComponent,
    ImagesCarouselComponent,
    InsideGalleryComponent,
    ReservationFormComponent,
    ReservationFormStepperComponent,
    ReservationFormDateComponent,
    ReservationFormDataComponent,
    BookingConfirmationDialogComponent,
    ReservationFormSummaryComponent,
    TermsAndConditionsComponent,
    TemporaryVoucherComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]
})
export class AppModule { }
