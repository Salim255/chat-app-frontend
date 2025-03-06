import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicModule } from "@ionic/angular";


import { MatchItemComponent } from "./components/match-item/match-item.component";
import { ItsMatchModalComponent } from "./components/its-match-modal/its-match-modal.component";
import { PairedPhotosComponent } from "./components/paired-photos/paired-photos.component";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, SharedModule],
  exports: [ MatchItemComponent ],
  declarations: [ MatchItemComponent, ItsMatchModalComponent, PairedPhotosComponent ]
})

export class MatchesFeatureModule {

}
