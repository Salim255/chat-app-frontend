import { Injectable } from "@angular/core";
import { Socket } from "socket.io-client";
import { SocketCoreService } from "./socket-core.service";
import { ConversationService } from "src/app/features/conversations/services/conversations.service";

type NewChatNotifier = {
  chatId: number;
  partnerId: number;
}
@Injectable({providedIn: 'root'})
export class SocketChatService {
  private socket: Socket | null = null;
  constructor(
    private conversationService: ConversationService,
    private socketCoreService: SocketCoreService){}

  initializeChatListener(): void{
    this.socket = this.socketCoreService.getSocket();
    this.listenToNewChat();
  }
  notifyPartnerOfNewConversation(data:  NewChatNotifier ): void{
    this.socket = this.socketCoreService.getSocket();
    this.socket?.emit('new-chat', (data));
  }

  listenToNewChat(): void{
    this.socket?.on('coming-new-chat', (data: NewChatNotifier) => {
      if (!data.chatId) return;
      this.conversationService.fetchConversationChatById(data.chatId).subscribe();
    })
  }
}
