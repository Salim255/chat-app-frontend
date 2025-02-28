import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Foreigner } from "src/app/models/foreigner.model";
import { ModalController } from "@ionic/angular";
import { ItsMatchModalComponent } from "../components/its-match-modal/its-match-modal.component";
import { Partner } from "src/app/interfaces/partner.interface";

@Injectable({
  providedIn: 'root'
})

export class ItsMatchModalService {
  private  matchedProfileSource = new BehaviorSubject <Foreigner | null>(null) ;

  constructor(private modalController: ModalController){}

  setProfileToDisplay (profile: Foreigner) {
    console.log(profile, "From its match service");

    this.matchedProfileSource.next(profile);
  }
  get getProfileToDisplay() {
    return this.matchedProfileSource.asObservable();
  }

  async openItsMatchModal(matchedData: Partner) {
    const modal = await this.modalController.create({
      component: ItsMatchModalComponent,
      componentProps: {
        matchedProfile: matchedData
      }
    })

    await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
