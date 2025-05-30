import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DistancePrefComponent } from "./distance/distance.component";
import { PreferencesComponent } from "./preferences.component";
import { AgeRangeRefComponent } from "./age-range/age-range.component";
import { LookingForPrefComponent } from "./looking-for/looking-for.component";
import { PrefFormComponent } from "./pref-form/pref-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  imports:[
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [
    DistancePrefComponent,
    PreferencesComponent,
    AgeRangeRefComponent,
    LookingForPrefComponent,
    PrefFormComponent
  ],
  exports: [PreferencesComponent]
})

export class PreferencesModule {

}
