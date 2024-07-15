import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from "./native-component/search-bar/search-bar.component";
import { LogoComponent } from "./app-logo/logo.component";
import { CardComponent } from "./native-component/card/card.component";

import { BadgeComponent } from "./native-component/badge/badge.component";
import { ActionBtnComponent } from "./profile/action/action-btn/action-btn.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SliderComponent } from "./profile/slider/slider.component";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  declarations: [TagComponent,ActionComponent, SearchBarComponent, LogoComponent, CardComponent, SliderComponent, BadgeComponent, ActionBtnComponent ],
  exports: [TagComponent, ActionComponent,SearchBarComponent, LogoComponent, CardComponent, SliderComponent, BadgeComponent, ActionBtnComponent ],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class SharedModule {

}
