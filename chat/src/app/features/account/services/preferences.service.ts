import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { PreferencesComponent } from "../components/preferences/preferences.component";
import { PrefFormComponent } from "../components/preferences/pref-form/pref-form.component";
import { FieldName } from "./editing-profile.service";

export enum PrefFieldName {
  Age ='age',
  Distance = 'distance',
  LookingFor = 'looking-for',
}

@Injectable({providedIn: 'root'})

export class PreferencesService {
  constructor(private modalController: ModalController){}

  async presentPreferences(): Promise<void>{
    const modal = await this.modalController.create({
      component: PreferencesComponent,
    });
    await modal.present();
  }

  async dismissPreferences(): Promise<void>{
    await this.modalController.dismiss();
  }

  async presentPrefForm(prefFieldName : PrefFieldName ): Promise<void>{
    const modal = await this.modalController.create({
      component: PrefFormComponent,
      componentProps:{
        fieldName:  prefFieldName
      },
    });

    await modal.present();
  }

  async dismissPrefForm(): Promise<void> {
    await  this.modalController.dismiss();
  }
}
