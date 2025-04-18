import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';

@Injectable({
  providedIn: 'root',
})
export class SocketNewConversationHandler {
  private newConversationSubject = new BehaviorSubject<Conversation | null>(null);
  constructor(private conversationService: ConversationService) {}

  //
  handleIncomingNewConversationEvent(socket: Socket): void {
    socket?.on('listen-to-new-conversation', (conversation: Conversation) => {
      console.log(conversation, 'hEllo from  created conversation from parnter');
      if (!conversation) return;
      this.setNewConversation(conversation);
      this.conversationService.addNewlyCreatedConversation(conversation);
    });
  }

  handleNewConversationEmitter(socket: Socket, conversation: Conversation): void {
    socket?.emit('new-conversation', conversation);
  }

  setNewConversation(conversation: Conversation | null): void {
    this.newConversationSubject.next(conversation);
  }

  get getNewConversation(): Observable<Conversation | null> {
    return this.newConversationSubject.asObservable();
  }
}
