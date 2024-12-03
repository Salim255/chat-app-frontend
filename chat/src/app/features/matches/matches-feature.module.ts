import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MatchItemComponent } from "./components/match-item/match-item.component";

@NgModule({
  imports: [IonicModule],
  exports: [ MatchItemComponent ],
  declarations: [ MatchItemComponent ]
})

export class MatchesFeatureModule {

}
