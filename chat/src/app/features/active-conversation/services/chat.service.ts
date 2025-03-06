import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateChatInfo } from 'src/app/features/active-conversation/interfaces/chat.interface';
import { ActiveConversationService } from './active-conversation.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private activeConversationService: ActiveConversationService
  ) {}

  createNewChat(data: CreateChatInfo): Observable<any> {
    return this.activeConversationService.createConversation(data);
  }
}
