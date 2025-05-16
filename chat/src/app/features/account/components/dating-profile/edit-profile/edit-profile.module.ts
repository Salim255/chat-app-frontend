import { NgModule } from "@angular/core";
import { MediaComponent } from "./media/media.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { EditProfileComponent } from "./edit-profile.component";
import { SharedModule } from "../../../../../shared/shared.module";
import { EditBioComponent } from "./edit-bio/edit-bio.component";
import { EditGenderComponent } from "./edit-gender/edit-gender.component";
import { EditHomeTownComponent } from "./edit-home-town/edit-home-town.component";

@NgModule({
  declarations: [
    MediaComponent,
    EditProfileComponent,
    EditBioComponent,
    EditGenderComponent,
    EditHomeTownComponent
   ],
  imports: [CommonModule, IonicModule, SharedModule],
  exports: [
    MediaComponent,
    EditProfileComponent,
    EditBioComponent,
    EditGenderComponent,
    EditHomeTownComponent ],
})

export class EditProfileModule {}
