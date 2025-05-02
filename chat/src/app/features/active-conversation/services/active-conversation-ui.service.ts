import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ActiveConversationPage } from "../pages/active-conversation/active-conversation.page";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ActiveConversationUIService {
  private triggerMessagePageScrollSource = new BehaviorSubject<string>('scroll');

  constructor(private modalController: ModalController){}

  async openChatModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: ActiveConversationPage,
    });
    await modal.present();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  setMessagePageScroll(): void {
    this.triggerMessagePageScrollSource.next('scroll');
  }

  get getTriggerMessagePageScroll():Observable<string> {
    return this.triggerMessagePageScrollSource.asObservable();
  }
}
