import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Conversation } from "../../conversations/models/conversation.model";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Message } from "../../messages/model/message.model";
import { CreateMessageDto } from "../pages/active-conversation/active-conversation.page";

export type CreateConversationPost = {
  content: string;
  from_user_id: number;
  to_user_id: number;
  partner_connection_status: string;
  session_key_sender: string;
  session_key_receiver: string;
}

@Injectable({
  providedIn: 'root'
})

export class ActiveConversationHttpService {
  private ENV = environment;
  constructor(private http:  HttpClient){}

  createChat(payload: CreateConversationPost  ): Observable< {status: string, data: { chat: Conversation } }>{
    return this.http
    .post<{ status: string, data: { chat: Conversation } }>(`${this.ENV.apiUrl}/chats`,payload);
  }

  fetchActiveConversation(chatId: number): Observable<{ status: string; data: { chat: Conversation } }>{
    return this.http
    .get<{ status: string; data: { chat: Conversation } }>(`${this.ENV.apiUrl}/chats/${chatId}`)
  }

  updateChatMessagesToRead(
    chatId: number,
  ): Observable<{ status: string, data: { messages: Message[] } }>{
    return this.http
    .patch<{ status: string; data: { messages: Message[] } }>(
      `${this.ENV.apiUrl}/chats/${chatId}/update-ms-to-read`,{});
 }

 createMessage(
  requestData: CreateMessageDto,
  ): Observable<{ status: string; data: { message: Message } }>{
    return this.http
    .post<{ status: string; data: { message: Message } }>(`${this.ENV.apiUrl}/messages`, requestData)
 }
}
