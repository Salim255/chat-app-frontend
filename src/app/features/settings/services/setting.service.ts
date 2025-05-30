import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SettingsPage } from "../settings.page";

@Injectable({providedIn: 'root'})
export class SettingService {
  constructor(private modalController : ModalController ){}

  async openSettings():Promise<void>{
    const modal = await this.modalController.create({
      component: SettingsPage
    })

    await modal.present();
  }

  async dismissSetting():Promise<void> {
    await this.modalController.dismiss();
  }
}
