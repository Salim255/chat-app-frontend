import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { SearchBarComponent } from "./native-component/search-bar/search-bar.component";
import { LogoComponent } from "./app-logo/logo.component";

@NgModule({
  declarations: [TagComponent,ActionComponent, SearchBarComponent, LogoComponent],
  exports: [TagComponent, ActionComponent,SearchBarComponent, LogoComponent],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
