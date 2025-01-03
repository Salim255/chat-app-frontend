import { CommonModule } from "@angular/common";
import {  NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";
import { ProfileCardComponent } from "./components/profile-card/profile-card.component";





@NgModule({
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule],
  exports: [
    ProfileCardComponent
   ],
  declarations: [
    ProfileCardComponent
   ]
})

export class DiscoverProfilesFeatureModule {

}
