import { CommonModule } from "@angular/common";
import {  NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";

import { ProfileCoordinationComponent } from "./components/profile-coordination/profile-coordination.component";
import { ProfileCardComponent } from "./components/profile-card/profile-card.component";
import { NameAgeComponent } from "./components/profile-coordination/name-age/name-age.component";
import { DistanceComponent } from "./components/profile-coordination/distance/distance.component";





@NgModule({
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule],
  exports: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent
   ],
  declarations: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent
   ]
})

export class DiscoverProfilesFeatureModule {

}
