import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketCoreService } from './socket-core.service';
import { JoinRomData } from './socket-room.service';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';

export type  MessageNotifierPayload = Omit<JoinRomData, 'chatId'> & {
  chatId: number
}

@Injectable({
  providedIn: 'root',
})
export class SocketMessageService {
  private socket: Socket | null = null;
  constructor(
    private conversationService: ConversationService,
    private socketCoreService: SocketCoreService,
   ) { }

  initializeMessageListener(): void{
    this.socket = this.socketCoreService.getSocket();
    this.listenToComingMessage();
  }

  notifyPartnerOfComingMessage(notificationData: MessageNotifierPayload): void {
    console.log(notificationData, 'hello wrold', this.socket)
    this.socket = this.socketCoreService.getSocket();
    this.socket?.emit('coming-message', notificationData);
  }

  listenToComingMessage(): void{
    this.socket?.on('coming-message', (comingNotification: MessageNotifierPayload)=> {
      console.log(comingNotification, 'Hello from coming notificationnotification😍😍😍');
      if (!comingNotification.chatId) return
      this.conversationService.fetchConversationChatById(comingNotification.chatId).subscribe();

    });
  }
}
