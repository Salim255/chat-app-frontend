import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Conversation } from "../../conversations/models/conversation.model";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Message } from "../../messages/model/message.model";
import { CreateMessageDto } from "../active-conversation.page";

export enum RequestStatus {
  Success = 'success',
  Error = 'fail',
}

export type ConversationResponse = {
  status: RequestStatus;
  data: { chat: Conversation };
}

export type CreateMessageResponse = {
   status: RequestStatus
  data: {
    message: Message
  };

}

export type UpdateChatMessagesResponse = {
   status: RequestStatus;
  data: {
       messages: Message[]
  }
}
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
  private readonly basePath = `${this.ENV.apiUrl}/chats`;
  constructor(private http:  HttpClient){}

  createChat(payload: CreateConversationPost  ): Observable<ConversationResponse>{
    return this.http
    .post<ConversationResponse>(`${this.basePath}`,payload);
  }

  fetchActiveConversation(chatId: number): Observable< ConversationResponse >{
    return this.http
    .get<ConversationResponse>(`${this.basePath}/${chatId}`)
  }

  updateChatMessagesToRead(
    chatId: number,
  ): Observable<UpdateChatMessagesResponse>{
    return this.http
    .patch<UpdateChatMessagesResponse>(`${this.basePath}/${chatId}/update-ms-to-read`,{});
  }

  createMessage(
    requestData: CreateMessageDto,
    ): Observable<CreateMessageResponse>{
      return this.http
      .post<CreateMessageResponse>(`${this.ENV.apiUrl}/messages`, requestData)
  }
}
