import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ProfileViewerPage } from 'src/app/features/profile-viewer/pages/profile-viewer/profile-viewer.page';

export type ViewProfileData = {
  birth_date: Date;
  city: string;
  connection_status: string;
  country: string;
  name: string;
  partner_id: number;
  photos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileViewerService {
  private profileToDisplaySource = new BehaviorSubject<ViewProfileData | null>(null);

  constructor(private modalController: ModalController) {}


  get getProfileToDisplay(): Observable<ViewProfileData | null> {
    return this.profileToDisplaySource.asObservable();
  }

  async openProfileViewerModal(profile: ViewProfileData): Promise<void> {
    const modal = await this.modalController.create({
      component: ProfileViewerPage,
      componentProps: profile
    });

    await modal.present();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
