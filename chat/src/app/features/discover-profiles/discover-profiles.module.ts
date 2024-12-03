import { CommonModule } from "@angular/common";
import {  NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";

import { ProfileCoordinationComponent } from "./components/profile-coordination/profile-coordination.component";
import { ProfileCardComponent } from "./components/profile-card/profile-card.component";
import { NameAgeComponent } from "./components/profile-coordination/name-age/name-age.component";
import { DistanceComponent } from "./components/profile-coordination/distance/distance.component";
import { AboutMeComponent } from "./components/profile-details/about-me/about-me.component";
import { LookingForComponent } from "./components/profile-details/looking-for/looking-for.component";
import { EssentialsComponent } from "./components/profile-details/essentials/essentials.component";
import { blockComponent } from "./components/profile-details/security/block-profile/block.component";
import { ReportComponent } from "./components/profile-details/security/report-profile/report.component";
import { ProfileDetailsComponent } from "./components/profile-details/profile-details.component";

@NgModule({
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule],
  exports: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent, AboutMeComponent, LookingForComponent,
    EssentialsComponent, blockComponent, ReportComponent, ProfileDetailsComponent
   ],
  declarations: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent, AboutMeComponent, LookingForComponent, EssentialsComponent,
    blockComponent, ReportComponent, ProfileDetailsComponent
   ]
})

export class DiscoverProfilesModule {

}
