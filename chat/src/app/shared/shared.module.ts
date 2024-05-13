import { NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { ActionComponent } from "./profile/action/action.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [TagComponent,ActionComponent],
  exports: [TagComponent, ActionComponent],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
