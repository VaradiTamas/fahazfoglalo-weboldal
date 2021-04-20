import {NgModule} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MaterialModule} from "../material.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AdminComponent} from "./admin.component";
import {BookingsComponent} from "./bookings/bookings.component";
import {NavbarComponent} from "../layout/admin-header/navbar.component";
import {CouponsComponent} from "./coupons/coupons.component";
import {NewBookingComponent} from "./bookings/new-booking/new-booking.component";
import {NewCouponComponent} from "./coupons/new-coupon/new-coupon.component";
import {DatepickerComponent} from "../datepicker/datepicker.component";
import {LoginComponent} from "./auth/login/login.component";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {CommonModule} from "@angular/common";
import {AdminRoutingModule} from "./admin-routing.module";
import {AdminLayoutComponent} from "../layout/admin-layout/admin-layout.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AdminComponent,
    BookingsComponent,
    NavbarComponent,
    CouponsComponent,
    NewBookingComponent,
    NewCouponComponent,
    DatepickerComponent,
    LoginComponent,
    AdminLayoutComponent
  ],
  exports: [
    AdminComponent,
    BookingsComponent,
    NavbarComponent,
    CouponsComponent,
    NewBookingComponent,
    NewCouponComponent,
    DatepickerComponent,
    LoginComponent,
  ]
})
export class AdminModule { }
