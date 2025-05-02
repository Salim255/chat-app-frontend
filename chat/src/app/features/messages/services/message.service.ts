import { Injectable } from '@angular/core';
import { Message } from '../../messages/model/message.model';
import { ActiveConversationService } from '../../active-conversation/services/active-conversation.service';
import { from, Observable, switchMap } from 'rxjs';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private ENV = environment;
  constructor(
    private http: HttpClient,
    private activeConversationService: ActiveConversationService,
  ) {}

  updateMessageStatus(messages: Message[], deliveredMessage: Message): Message[] {
    const index = messages.findIndex((msg) => msg.id === deliveredMessage.id);
    if (index !== -1) {
      messages[index].status = deliveredMessage.status;
    } else {
      messages.push(deliveredMessage);
    }
    return messages;
  }

  updateMessagesOnPartnerJoin(messages: Message[], updatedMessages: Message[]): Message[] {
    updatedMessages.forEach((msg) => {
      messages = this.updateMessageStatus(messages, msg);
    });
    return messages;
  }

  //update-active-chat/messages/delivered
  updateActiveChatMessageToDelivered(
    toUserId: number,
  ): Observable<{ status: string, data:{ messages: Message[] }}> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) {
          throw new Error('Missing authentication data');
        }
        return this.http.patch<{ status: string; data: { messages: Message[] } }>(
          `${this.ENV.apiUrl}/messages/update-active-chat/messages/delivered`,
          { toUserId }
        )
      })
    )
  }
}
