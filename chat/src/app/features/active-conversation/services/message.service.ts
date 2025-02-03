import { Injectable } from "@angular/core";
import { Message } from "../interfaces/message.interface";
import { ActiveConversationService } from "./active-conversation.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
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
    updatedMessages.forEach(msg => {
      messages = this.updateMessageStatus(messages, msg);
    });
    return messages;
  }

  addMessageToMessagesList(messages: Message[], message: Message): Message[] {
    return [...messages, message];
  }

  getLastMessage(messages: Message[]): Message | null {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }

  sendMessage(data: any): Observable<any> {
    return this.activeConversationService.sendMessage(data);
  }


  handleNewMessages(messages: any[], pushMessage: Function) {
    const message = this.getLastMessage(messages);
    if (message) {
      pushMessage(message);
    }
  }
}
