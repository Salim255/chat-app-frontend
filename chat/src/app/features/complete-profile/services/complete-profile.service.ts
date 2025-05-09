import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CompleteProfilePage, ProfilePayload } from "../complete-profile.page";
import { CompleteProfileHttpService, PostResponse } from "./complete-profile-http.service";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class CompleteProfileService {
  constructor(
    private completeProfileHttpService: CompleteProfileHttpService,
    private modalController:  ModalController){}

  async openModal(): Promise<void>{
    const modal = await this.modalController.create({
      component: CompleteProfilePage
    });

    await modal.present();
  }

  async closeModal(): Promise<void>{
    await this.modalController.dismiss();
  }

  createProfile(profile: ProfilePayload): Observable<PostResponse>{
    return this.completeProfileHttpService.postProfile(profile);
  }
}
