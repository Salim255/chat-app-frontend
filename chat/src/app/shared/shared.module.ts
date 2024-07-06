import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { SearchBarComponent } from "./native-component/search-bar/search-bar.component";
import { LogoComponent } from "./app-logo/logo.component";
import { CardComponent } from "./native-component/card/card.component";
import { SliderComponent } from "./native-component/slider/slider.componet";
import { BadgeComponent } from "./native-component/badge/badge.component";


@NgModule({
  declarations: [TagComponent,ActionComponent, SearchBarComponent, LogoComponent, CardComponent, SliderComponent, BadgeComponent ],
  exports: [TagComponent, ActionComponent,SearchBarComponent, LogoComponent, CardComponent, SliderComponent, BadgeComponent ],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
