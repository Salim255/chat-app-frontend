import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TagComponent } from "./native-component/tag/tag.component";
import { IonicModule } from "@ionic/angular";
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [TagComponent],
  exports: [TagComponent],
  imports: [
    IonicModule
  ]
})
export class SharedModule {

}
