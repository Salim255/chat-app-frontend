import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CompleteProfilePage } from "../complete-profile.page";

@Injectable({providedIn: 'root'})
export class CompleteProfileService {
  constructor(private modalController:  ModalController){}

  async openModal(): Promise<void>{
    const modal = await this.modalController.create({
      component: CompleteProfilePage
    });

    await modal.present();
  }

  async closeModal(): Promise<void>{
    await this.modalController.dismiss();
  }
}
