import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import {PricesComponent} from "./prices/prices.component";
import {OffersComponent} from "./offers/offers.component";
import {QuestionsComponent} from "./questions/questions.component";
import {AboutusComponent} from "./aboutus/aboutus.component";
import {ReservationComponent} from "./reservation/reservation.component";
import {AppLayoutComponent} from "./layout/app-layout/app-layout.component";
import {HomeComponent} from "./home/home.component";
import {HouseComponent} from "./gallery/house/house.component";
import {SaunaComponent} from "./gallery/sauna/sauna.component";
import {ParkComponent} from "./gallery/park/park.component";
import {GalleryLayoutComponent} from "./layout/gallery-layout/gallery-layout.component";
import {VoucherReservationComponent} from "./voucher/voucher-reservation/voucher-reservation.component";
import {VoucherCardComponent} from "./voucher/voucher-card/voucher-card.component";
import {VoucherLayoutComponent} from "./layout/voucher-layout/voucher-layout.component";

const appRoutes: Routes = [
  { path: '', /*redirectTo: '/gallery' pathMatch: 'full'*/ component: AppLayoutComponent, children:
      [
        { path: '', component: HomeComponent, pathMatch: 'full'},
        { path: 'gallery', redirectTo: 'gallery/house'},
        { path: 'gallery', component: GalleryLayoutComponent, children:
            [
              { path: 'house', component: HouseComponent },
              { path: 'sauna', component: SaunaComponent },
              { path: 'park', component: ParkComponent }
            ]
        },
        { path: 'offers', component: OffersComponent },
        { path: 'voucher', redirectTo: 'voucher/information'},
        { path: 'voucher', component: VoucherLayoutComponent, children:
          [
            { path: 'information', component: VoucherCardComponent },
            { path: 'reservation', component: VoucherReservationComponent }
          ]
        },
        { path: 'prices', component: PricesComponent },
        { path: 'questions', component: QuestionsComponent},
        { path: 'about-us', component: AboutusComponent},
        { path: 'reservation', component: ReservationComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
