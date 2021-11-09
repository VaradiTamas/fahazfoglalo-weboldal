import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import {BookingsComponent} from './bookings/bookings.component';
import {CouponsComponent} from './coupons/coupons.component';
import {AuthGuard} from './auth/auth.guard';
import {NewBookingComponent} from './bookings/new-booking/new-booking.component';
import {NewCouponComponent} from './coupons/new-coupon/new-coupon.component';
import {LoginComponent} from './auth/login/login.component';
import {AdminLayoutComponent} from '../layout/admin-layout/admin-layout.component';

const adminRoutes: Routes =
  [
    {path: 'admin', redirectTo: 'admin/login'},
    {path: 'admin', component: AdminLayoutComponent, children: [
      {path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard]},
      {path: 'vouchers', component: CouponsComponent, canActivate: [AuthGuard]},
      {path: 'bookings/new', component: NewBookingComponent, canActivate: [AuthGuard]},
      {path: 'bookings/edit/:id', component: NewBookingComponent, canActivate: [AuthGuard]},
      {path: 'vouchers/new', component: NewCouponComponent, canActivate: [AuthGuard]},
      {path: 'vouchers/edit/:id', component: NewCouponComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent}
      ]}
  ];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AdminRoutingModule {}
