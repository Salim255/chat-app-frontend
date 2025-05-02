import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConversationResponse, FetchedConversationsResponse } from "../interfaces/conversations.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({'providedIn': 'root'})
export class ConversationsHttpService {
  private ENV =  environment;
  private readonly basePath = `${this.ENV.apiUrl}/chats`;
  constructor(private http: HttpClient){}

  fetchConversations(): Observable<FetchedConversationsResponse>{
    return this.http
      .get<FetchedConversationsResponse>(`${this.ENV.apiUrl}/chats`)
  }

  fetchSingleConversation(chatId: number): Observable<ConversationResponse>{
    return this.http
      .get<ConversationResponse>(`${this.ENV.apiUrl}/chats/${chatId}`)
  }
}
