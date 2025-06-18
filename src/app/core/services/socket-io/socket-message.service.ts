import { Injectable, Injector } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketCoreService } from './socket-core.service';
import { JoinRomData } from './socket-room.service';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { take } from 'rxjs';

export type  MessageNotifierPayload = Omit<JoinRomData, 'chatId'> & {
  chatId: number;
  partnerStatus: 'in-room' | 'online'
}

@Injectable({
  providedIn: 'root',
})
export class SocketMessageService {
  private socket: Socket | null = null;
  private activeConversationService!: ActiveConversationService;
  constructor(
    private conversationService: ConversationService,
    private socketCoreService: SocketCoreService,
    private injector: Injector,
   ) { }

  initializeMessageListener(): void{
    console.log("Hello from inti Listnere")
    this.socket = this.socketCoreService.getSocket();
    this.listenToComingMessage();
  }

  notifyPartnerOfComingMessage(notificationData: MessageNotifierPayload): void {
    this.socket = this.socketCoreService.getSocket();
    this.socket?.emit('coming-message', notificationData);
  }

  listenToComingMessage(): void{
    this.socket?.on('coming-message', (comingNotification: MessageNotifierPayload)=> {
      if (!comingNotification.chatId) {
        return
      }
      if (comingNotification.partnerStatus === 'online') {
        this.conversationService.fetchConversationChatById(comingNotification.chatId)
        .pipe(take(1))
        .subscribe(()=>{
          return
        });

      }
      if (comingNotification.partnerStatus === 'in-room') {
       this.getActiveConversationService().fetchActiveConversation()
       .pipe(take(1))
       .subscribe((response)=>{
          // update the conversation with updated conversation
          const updatedConversations =  this.conversationService.updateConversationsList(response.data.chat);
          this.conversationService.setConversations([...updatedConversations]);
          return;
        });
      }
    });
  }

  private getActiveConversationService(): ActiveConversationService {
    if(!this.activeConversationService) {
      return this.activeConversationService = this.injector.get(ActiveConversationService);
    }
    return this.activeConversationService;
  }
}
