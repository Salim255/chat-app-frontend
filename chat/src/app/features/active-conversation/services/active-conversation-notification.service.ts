import { Injectable } from "@angular/core";
import { MessageNotifierPayload, SocketMessageService } from "src/app/core/services/socket-io/socket-message.service";

@Injectable({providedIn: 'root'})

export class ActiveConversationNotificationService {
  constructor(private socketMessageService: SocketMessageService){}

  notifyPartnerOfNewMessage(notificationData: MessageNotifierPayload): void {
    this.socketMessageService.notifyPartnerOfComingMessage(notificationData);
  }
  /*   handlePartnerNotification(partnerInRoomStatus: 'in-room'| 'online'): void {
      const toUserId = this.partnerInfoSource.value?.partner_id;
      const chatId = this.activeConversationSource.value?.id;
      const fromUserId = this.userId;
      if (!(this.userId && toUserId && chatId && fromUserId)) return;
      const notificationData: MessageNotifierPayload =
        {
          fromUserId,
          toUserId,
          chatId,
          partnerStatus: partnerInRoomStatus,
         }
      this.socketMessageService.notifyPartnerOfComingMessage(notificationData);
    } */
}
