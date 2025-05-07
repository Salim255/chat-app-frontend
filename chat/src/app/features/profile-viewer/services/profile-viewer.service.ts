import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ProfileViewerPage } from 'src/app/features/profile-viewer/pages/profile-viewer/profile-viewer.page';
import { Member } from 'src/app/shared/interfaces/member.interface';
@Injectable({
  providedIn: 'root',
})
export class ProfileViewerService {
  private profileToDisplaySource = new BehaviorSubject<Member | null>(null);

  constructor(private modalController: ModalController) {}

  setProfileToDisplay(profile: Member): void {
    console.log(profile, 'Hello from profile from profile service');
    this.profileToDisplaySource.next(profile);
  }

  get getProfileToDisplay() {
    return this.profileToDisplaySource.asObservable();
  }

  async openProfileViewerModal() {
    const modal = await this.modalController.create({
      component: ProfileViewerPage,
    });

    await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
