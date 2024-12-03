import { CommonModule } from "@angular/common";
import {  NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";

import { ProfileCoordinationComponent } from "./components/profile-coordination/profile-coordination.component";
import { ProfileCardComponent } from "./components/profile-card/profile-card.component";
import { NameAgeComponent } from "./components/profile-coordination/name-age/name-age.component";
import { DistanceComponent } from "./components/profile-coordination/distance/distance.component";
import { AboutMeComponent } from "./components/profile-details-viewer/about-me/about-me.component";
import { LookingForComponent } from "./components/profile-details-viewer/looking-for/looking-for.component";
import { EssentialsComponent } from "./components/profile-details-viewer/essentials/essentials.component";
import { blockComponent } from "./components/profile-details-viewer/security/block-profile/block.component";
import { ReportComponent } from "./components/profile-details-viewer/security/report-profile/report.component";
import { ProfileDetailsViewerComponent } from "./components/profile-details-viewer/profile-details-viewer.component";

@NgModule({
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule],
  exports: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent, AboutMeComponent, LookingForComponent,
    EssentialsComponent, blockComponent, ReportComponent, ProfileDetailsViewerComponent
   ],
  declarations: [ProfileCoordinationComponent, ProfileCardComponent, NameAgeComponent,
    DistanceComponent, AboutMeComponent, LookingForComponent, EssentialsComponent,
    blockComponent, ReportComponent, ProfileDetailsViewerComponent
   ]
})

export class DiscoverProfilesFeatureModule {

}
