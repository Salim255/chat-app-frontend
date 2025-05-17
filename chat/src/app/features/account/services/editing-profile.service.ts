import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DatingProfileComponent } from "../components/dating-profile/dating-profile.component";
import { EditProfileFormComponent } from "../components/dating-profile/edit-profile/edit-profile-form/edit-profile-form.component";

export enum FieldName {
  City ='city',
  Country = 'country',
  Gender = 'gender',
  Bio = 'bio',
}
@Injectable({providedIn: 'root'})
export class EditingProfileService {
  constructor(private modalController: ModalController) {}

  async onPresentModal( ): Promise<void> {
    const modal = await this.modalController.create({
      component: DatingProfileComponent, }) ;
      await modal.present();
  }

  async onDismissModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  async onEditFormModal(fieldName: FieldName, value: string): Promise<void> {
    const modal = await this.modalController.create({
      component: EditProfileFormComponent,componentProps: {
        fieldName: fieldName,
        fieldValue: value,
      },
    });
    await modal.present();
  }
  async onDismissEditFormModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
