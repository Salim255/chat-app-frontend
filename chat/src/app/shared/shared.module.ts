import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { SearchBarComponent } from "./native-component/search-bar/search-bar.component";
import { LogoComponent } from "./app-logo/logo.component";
import { CardComponent } from "./native-component/card/card.component";

@NgModule({
  declarations: [TagComponent,ActionComponent, SearchBarComponent, LogoComponent, CardComponent ],
  exports: [TagComponent, ActionComponent,SearchBarComponent, LogoComponent, CardComponent ],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
