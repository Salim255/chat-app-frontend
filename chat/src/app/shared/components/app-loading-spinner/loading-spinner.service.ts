import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { LoadingSpinnerComponent } from "./loading-spinner.component";

@Injectable({
  providedIn: 'root'
})

export class LoadingSpinnerService {
  constructor (private modalController:  ModalController) {}

  async showSpinner() {
    const createdModel = await this.modalController.create({
      component: LoadingSpinnerComponent
    })
    await createdModel.present()
  }

  async hideSpinner() {
    this.modalController.dismiss();
  }

}
