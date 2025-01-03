import { NgModule } from "@angular/core";
import { TagComponent } from "./native-components/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from "./native-components/search-bar/search-bar.component";
import { LogoComponent } from "./app-logo/logo.component";
import { CardComponent } from "./native-components/card/card.component";

import { BadgeComponent } from "./native-components/badge/badge.component";
import { ActionBtnComponent } from "./profile/action/action-btn/action-btn.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SliderComponent } from "./profile/slider/slider.component";

import { AppHeaderComponent } from "./app-header/app-header.component";
import { NetworkConnectionComponent } from "./network-connection/network-connection.component";
import { AppButtonComponent } from "./app-button/app-button.component";

import { AppPlaceHolderComponent } from "./app-place-holder/app-place-holder.component";
import { AppWaveComponent } from "./app-wave/app-wave.component";


import { ProfileCoordinationComponent } from "./profile/profile-coordination/profile-coordination.component";
import { DistanceComponent } from "./profile/profile-coordination/distance/distance.component";
import { NameAgeComponent } from "./profile/profile-coordination/name-age/name-age.component";

import { ProfileImagesCardComponent } from "./profile/profile-images-card/profile-images-card.component";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  declarations: [TagComponent,ActionComponent, SearchBarComponent, LogoComponent,
    CardComponent, SliderComponent, BadgeComponent, ActionBtnComponent, AppHeaderComponent,  NetworkConnectionComponent, AppButtonComponent
  , AppPlaceHolderComponent,
    AppWaveComponent, ProfileCoordinationComponent,
    DistanceComponent, NameAgeComponent, ProfileImagesCardComponent
   ],
  exports:
  [TagComponent, ActionComponent,SearchBarComponent, LogoComponent,
    CardComponent, SliderComponent, BadgeComponent, ActionBtnComponent,
      AppHeaderComponent,  NetworkConnectionComponent,
    AppButtonComponent, AppPlaceHolderComponent,
    AppWaveComponent, ProfileCoordinationComponent,
    DistanceComponent, NameAgeComponent, ProfileImagesCardComponent
   ],
  imports:
  [
    IonicModule,
    CommonModule
  ]
})
export class SharedModule {

}
