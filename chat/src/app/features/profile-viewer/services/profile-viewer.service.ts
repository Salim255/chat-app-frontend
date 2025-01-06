import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Foreigner } from "src/app/models/foreigner.model";
import { ModalController } from "@ionic/angular";
import { ProfileViewerPage } from "src/app/pages/profile-viewer/profile-viewer.page";
@Injectable({
  providedIn: 'root'
})

export class ProfileViewerService {
  private  profileToDisplaySource = new BehaviorSubject <Foreigner | null>(null) ;

  constructor(private modalController: ModalController){}

  setProfileToDisplay (profile: Foreigner) {
    console.log(profile, "Hello from profile from profile service");

    this.profileToDisplaySource.next(profile);
  }
  get getProfileToDisplay() {
    return this.profileToDisplaySource.asObservable();
  }

  async openProfileViewerModal() {
    const modal = await this.modalController.create({
      component: ProfileViewerPage
    })

    await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
