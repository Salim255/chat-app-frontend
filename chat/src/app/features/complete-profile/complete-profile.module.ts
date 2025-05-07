import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { CompleteProfilePage } from "./complete-profile.page";
import { CompleteProfileRoutingModule } from "./complete-profile-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CompleteProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule
    ],
  declarations: [CompleteProfilePage],
})

export class CompleteProfileModule {}
