import { NgModule } from "@angular/core";

import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from "./native-components/search-bar/search-bar.component";
import { LogoComponent } from "./components/app-logo/logo.component";
import { CardComponent } from "./native-components/card/card.component";

import { BadgeComponent } from "./native-components/badge/badge.component";

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SliderComponent } from "./components/profile/slider/slider.component";

import { AppHeaderComponent } from "./components/app-header/app-header.component";

import { AppButtonComponent } from "./components/app-button/app-button.component";

import { AppPlaceHolderComponent } from "./components/app-place-holder/app-place-holder.component";
import { AppWaveComponent } from "./components/app-wave/app-wave.component";


import { ProfileCoordinationComponent } from "./components/profile/profile-coordination/profile-coordination.component";
import { DistanceComponent } from "./components/profile/profile-coordination/distance/distance.component";
import { NameAgeComponent } from "./components/profile/profile-coordination/name-age/name-age.component";
import { HammerSwipeDirective } from "./directives/hammer-swiper/hammer-swipe.directive";
import { CustomSwiperDirective } from "./directives/custom-swiper/custom-swiper.directive";


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  declarations: [
    SearchBarComponent,
    LogoComponent,
    CardComponent,
    SliderComponent,
    BadgeComponent,
    AppHeaderComponent,
    AppButtonComponent,
    AppPlaceHolderComponent,
    AppWaveComponent,
    ProfileCoordinationComponent,
    DistanceComponent,
    NameAgeComponent,
    HammerSwipeDirective,
    CustomSwiperDirective
   ],
  exports: [
    SearchBarComponent,
    LogoComponent,
    CardComponent,
    SliderComponent,
    BadgeComponent,
    AppHeaderComponent,
    AppButtonComponent,
    AppPlaceHolderComponent,
    AppWaveComponent,
    ProfileCoordinationComponent,
    DistanceComponent,
    NameAgeComponent,
    HammerSwipeDirective,
    CustomSwiperDirective
   ],
  imports:
  [
    IonicModule,
    CommonModule
  ]
})
export class SharedModule {

}
