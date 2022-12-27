import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricesComponent } from './public/menu-items/prices/prices.component';
import { QuestionsComponent } from './public/menu-items/questions/questions.component';
import { AboutUsComponent } from './public/menu-items/about-us/about-us.component';
import { ReservationComponent } from './public/menu-items/reservation/reservation.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { HomeComponent } from './public/menu-items/home/home.component';
import { OutsideGalleryComponent } from './public/menu-items/gallery/outside/outside-gallery.component';
import { GalleryLayoutComponent } from './layout/gallery-layout/gallery-layout.component';
import { InsideGalleryComponent } from './public/menu-items/gallery/inside/inside-gallery.component';
import { TermsAndConditionsComponent } from './public/legal-things/terms-and-conditions/terms-and-conditions.component';

const appRoutes: Routes = [
  { path: '', component: AppLayoutComponent, children:
      [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'gallery', redirectTo: 'gallery/inside' },
        { path: 'gallery', component: GalleryLayoutComponent, children:
            [
              { path: 'inside', component: InsideGalleryComponent },
              { path: 'outside', component: OutsideGalleryComponent }
            ]
        },
        { path: 'prices', component: PricesComponent },
        { path: 'questions', component: QuestionsComponent },
        { path: 'about-us', component: AboutUsComponent },
        { path: 'reservation', component: ReservationComponent },
        { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
        { path: '**', redirectTo: 'home' },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
