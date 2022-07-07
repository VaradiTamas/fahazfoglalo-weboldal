import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { PricesComponent } from './public/menu-items/prices/prices.component';
import { QuestionsComponent } from './public/menu-items/questions/questions.component';
import { AboutUsComponent } from './public/menu-items/about-us/about-us.component';
import { ReservationComponent } from './public/menu-items/reservation/reservation.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { HomeComponent } from './public/menu-items/home/home.component';
import { SaunaComponent } from './public/menu-items/gallery/sauna/sauna.component';
import { ParkComponent } from './public/menu-items/gallery/park/park.component';
import { GalleryLayoutComponent } from './layout/gallery-layout/gallery-layout.component';
import { VoucherReservationComponent } from './public/menu-items/voucher/voucher-reservation/voucher-reservation.component';
import { VoucherCardComponent } from './public/menu-items/voucher/voucher-card/voucher-card.component';
import { VoucherLayoutComponent } from './layout/voucher-layout/voucher-layout.component';
import { HouseComponent } from './public/menu-items/gallery/house/house.component';
import { TermsAndConditionsComponent } from './public/legal-things/terms-and-conditions/terms-and-conditions.component';

const appRoutes: Routes = [
  { path: '', /*redirectTo: '/gallery' pathMatch: 'full'*/ component: AppLayoutComponent, children:
      [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'gallery', redirectTo: 'gallery/house' },
        { path: 'gallery', component: GalleryLayoutComponent, children:
            [
              { path: 'house', component: HouseComponent },
              { path: 'sauna', component: SaunaComponent },
              { path: 'park', component: ParkComponent }
            ]
        },
        { path: 'voucher', redirectTo: 'voucher/information' },
        { path: 'voucher', component: VoucherLayoutComponent, children:
          [
            { path: 'information', component: VoucherCardComponent },
            { path: 'reservation', component: VoucherReservationComponent }
          ]
        },
        { path: 'prices', component: PricesComponent },
        { path: 'questions', component: QuestionsComponent },
        { path: 'about-us', component: AboutUsComponent },
        { path: 'reservation', component: ReservationComponent },
        { path: 'terms-and-conditions', component: TermsAndConditionsComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
