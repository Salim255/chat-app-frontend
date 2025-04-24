import { Injectable } from '@angular/core';
import { Message } from '../../messages/model/message.model';
import { ActiveConversationService } from '../../active-conversation/services/active-conversation.service';
import { Observable } from 'rxjs';
import { CreateMessageDto } from '../../active-conversation/pages/active-conversation/active-conversation.page';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private activeConversationService: ActiveConversationService) {}

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

  getLastMessage(messages: Message[]): Message | null {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }


  handleNewMessages(messages: any[], pushMessage: Function) {
    const message = this.getLastMessage(messages);
    if (message) {
      pushMessage(message);
    }
  }
}
