import { NgModule } from "@angular/core";
import { MediaComponent } from "./edit-media/media.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { EditProfileComponent } from "./edit-profile.component";
import { SharedModule } from "../../../../../shared/shared.module";
import { EditBioComponent } from "./edit-bio/edit-bio.component";
import { EditGenderComponent } from "./edit-gender/edit-gender.component";
import { EditHomeTownComponent } from "./edit-home-town/edit-home-town.component";
import { EditProfileFormComponent } from "./edit-profile-form/edit-profile-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditChildrenComponent } from "./edit-children/edit-children.component";
import { EditSexComponent } from "./edit-sex-orientation/edit-sex.component";

@NgModule({
  declarations: [
    MediaComponent,
    EditProfileComponent,
    EditBioComponent,
    EditGenderComponent,
    EditHomeTownComponent,
    EditProfileFormComponent,
    EditChildrenComponent,
    EditSexComponent
   ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    MediaComponent,
    EditProfileComponent,
    EditBioComponent,
    EditGenderComponent,
    EditHomeTownComponent,
    EditProfileFormComponent,
    EditChildrenComponent,
    EditSexComponent,
  ],
})

export class EditProfileModule {}
