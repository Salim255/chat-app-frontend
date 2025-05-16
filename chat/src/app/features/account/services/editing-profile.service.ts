import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DatingProfileComponent } from "../components/dating-profile/dating-profile.component";
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
}
