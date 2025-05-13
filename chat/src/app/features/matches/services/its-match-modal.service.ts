import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ItsMatchModalComponent } from '../components/its-match-modal/its-match-modal.component';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root',
})
export class ItsMatchModalService {
  private matchedProfileSource = new BehaviorSubject<Match | null>(null);

  constructor(private modalController: ModalController) {}

  setProfileToDisplay(profile: Match): void {
    this.matchedProfileSource.next(profile);
  }
  get getProfileToDisplay(): Observable<Match | null> {
    return this.matchedProfileSource.asObservable();
  }

  async openItsMatchModal(matchedData: Match): Promise<void> {
    const modal = await this.modalController.create({
      component: ItsMatchModalComponent,
      componentProps: {
        matchedProfile: matchedData,
      },
    });

    await modal.present();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
