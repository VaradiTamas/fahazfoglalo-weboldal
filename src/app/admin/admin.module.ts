import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MaterialModule} from '../material.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BookingsComponent} from './bookings/bookings.component';
import {NavbarComponent} from '../layout/admin-header/navbar.component';
import {NewBookingComponent} from './bookings/new-booking/new-booking.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminLayoutComponent} from '../layout/admin-layout/admin-layout.component';

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
    BookingsComponent,
    NavbarComponent,
    NewBookingComponent,
    LoginComponent,
    AdminLayoutComponent,
  ],
    exports: [
        BookingsComponent,
        NavbarComponent,
        NewBookingComponent,
        LoginComponent,
        AdminLayoutComponent
    ]
})
export class AdminModule { }
