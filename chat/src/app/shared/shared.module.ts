import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";
import { SearchBarComponent } from "./native-component/search-bar/search-bar.component";

@NgModule({
  declarations: [TagComponent,ActionComponent, SearchBarComponent],
  exports: [TagComponent, ActionComponent,SearchBarComponent],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
