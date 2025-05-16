import { NgModule } from "@angular/core";
import { MediaComponent } from "./media/media.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { EditProfileComponent } from "./edit-profile.component";

@NgModule({
  declarations: [ MediaComponent, EditProfileComponent ],
  imports: [ CommonModule, IonicModule ],
  exports: [ MediaComponent,EditProfileComponent ],
})

export class EditProfileModule {}
