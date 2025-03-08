import { CommonModule } from "@angular/common";
import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "src/app/shared/shared.module";
import { ProfileSwipeComponent } from "./components/profile-swipe/profile-swipe.component";
import { DiscoverTabsComponent } from "./components/discover-tabs/discover-tabs.component";
import { ProfileViewerDescriptionComponent } from "./components/profile-viewer-description/profile-viewer-description.component";
import { ProfileViewerFeatureModule } from "../profile-viewer/profile-viewer-feature.module";
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  imports: [ IonicModule, CommonModule, FormsModule, SharedModule,  ProfileViewerFeatureModule],
  exports: [
    ProfileSwipeComponent,
    DiscoverTabsComponent,
    ProfileViewerDescriptionComponent,
   ],
  declarations: [
    ProfileSwipeComponent,
    DiscoverTabsComponent,
    ProfileViewerDescriptionComponent,
   ]
})

export class DiscoverProfilesFeatureModule {

}
