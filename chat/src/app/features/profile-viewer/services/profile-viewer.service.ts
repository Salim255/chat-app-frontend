import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileViewerPage } from 'src/app/features/profile-viewer/profile-viewer.page';
import { Profile } from '../../discover/model/profile.model';
import { ActiveConversationPage } from '../../active-conversation/pages/active-conversation/active-conversation.page';

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

  constructor(private modalController: ModalController) {}

  async openProfileViewerModal(profile: Profile): Promise<void> {
    if (!profile) return;

    const topModal = await this.modalController.getTop();
    // Check if the top modal is NOT the active conversation modal
    const isActiveConversationModal =
      topModal?.component === ActiveConversationPage;
    if (topModal && !isActiveConversationModal) {
      // There is already a conversation modal open; do not open profile viewer
      return;
    }
    const modal = await this.modalController.create({
      component: ProfileViewerPage,
      componentProps: { profile }
    });

    await modal.present();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
