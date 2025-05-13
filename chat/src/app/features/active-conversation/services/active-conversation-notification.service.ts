import { Injectable } from "@angular/core";
import {
  MessageNotifierPayload,
  SocketMessageService,
} from "src/app/core/services/socket-io/socket-message.service";
import { SocketChatService } from "src/app/core/services/socket-io/socket-chat.service";

@Injectable({providedIn: 'root'})
export class ActiveConversationNotificationService {
  constructor(
    private socketChatService: SocketChatService,
    private socketMessageService: SocketMessageService,
  ){}

  notifyPartnerOfNewMessage(notificationData: MessageNotifierPayload): void {
    this.socketMessageService.notifyPartnerOfComingMessage(notificationData);
  }

  notifyPartnerOfNewConversation(chatId: number, partnerId: number ): void {
    this.socketChatService.notifyPartnerOfNewConversation({ chatId, partnerId })
  }
}
