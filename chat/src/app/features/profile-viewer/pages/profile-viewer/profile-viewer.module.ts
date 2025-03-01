import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ProfileViewerPage } from "./profile-viewer.page";
import { ProfileViewerPageRoutingModule } from "./profile-viewer-routing.module";
import { ProfileViewerFeatureModule } from "src/app/features/profile-viewer/profile-viewer-feature.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
    ProfileViewerPageRoutingModule,
    ProfileViewerFeatureModule,
    SharedModule
  ],
  declarations: [
    ProfileViewerPage
  ]
})

export class ProfileViewerPageModule {

}
