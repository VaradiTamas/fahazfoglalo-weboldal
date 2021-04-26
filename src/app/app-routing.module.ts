import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import {GalleryComponent} from "./gallery/gallery.component";
import {PricesComponent} from "./prices/prices.component";
import {OffersComponent} from "./offers/offers.component";
import {VoucherComponent} from "./voucher/voucher.component";
import {QuestionsComponent} from "./questions/questions.component";
import {AboutusComponent} from "./aboutus/aboutus.component";
import {ReservationComponent} from "./reservation/reservation.component";
import {AppLayoutComponent} from "./layout/app-layout/app-layout.component";
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  { path: '', /*redirectTo: '/gallery' pathMatch: 'full'*/ component: AppLayoutComponent, children: [
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'gallery', component: GalleryComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'voucher', component: VoucherComponent },
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
