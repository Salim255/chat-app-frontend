import { CommonModule } from "@angular/common";
import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";
import { ProfileSwipeComponent } from "./components/profile-swipe/profile-swipe.component";


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule],
  exports: [
    ProfileSwipeComponent
   ],
  declarations: [
    ProfileSwipeComponent
   ]
})

export class DiscoverProfilesFeatureModule {

}
