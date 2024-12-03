import { NgModule } from "@angular/core";
import { headerComponent } from "./components/header/header.component";
import { FormInputComponent } from "./components/form-input/form-input.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [ IonicModule, CommonModule, FormsModule],
  exports: [headerComponent, FormInputComponent ],
  declarations: [ headerComponent, FormInputComponent ]
})

export class ActiveConversationFeatureModule {

}
