import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { Conversation } from "../models/active-conversation.model";
import { Partner } from "src/app/interfaces/partner.interface";
import { Message } from "../interfaces/message.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CreateMessageData } from "src/app/pages/active-conversation/active-conversation.page";
import { ConversationService } from "../../conversations/services/conversations.service";
import { CreateChatInfo } from "src/app/pages/active-conversation/active-conversation.page";


@Injectable({
  providedIn: 'root'
})

export class ActiveConversationService {
  private ENV = environment;
  private partnerInfoSource = new BehaviorSubject< Partner | null > (null);
  private activeConversationSource = new BehaviorSubject< Conversation | null > (null);
  private activeChatMessagesListSource = new BehaviorSubject< Message[] | null> (null);

  constructor(private http: HttpClient, private conversationService: ConversationService
  ) { }

  // A function that create a new conversation
  createConversation (data: CreateChatInfo) {
    return this.http.post<any>(`${this.ENV.apiUrl}/chats`, data).pipe(tap((response) => {
        if (response.data) {
          this.setActiveConversation(response.data)
        }
    }))
  }

  // Function that fetch conversation by partner ID
  fetchChatByPartnerID (partnerId: number) {
    return this.http.get<any>(`${this.ENV.apiUrl}/chats/chat-by-users-ids/${partnerId}`).pipe(tap((response) => {
      if (response?.data !== undefined) {
        this.setActiveConversation(response.data);
      } else {
        this.setActiveConversation(null); // Or handle it differently
      }
    }))
  }

  // We use this function to update the current conversation with receiving  new message
  // This trigged by socket.js service
  fetchChatByChatId(chatId: number) {
     return this.http.get<any>(`${this.ENV.apiUrl}/chats/${chatId}`).pipe(tap((response) => {
      if (response?.data !== undefined && response.data.length > 0) {
        this.setActiveConversation(response.data);
      } else {
        this.setActiveConversation(null); // Or handle it differently
      }
     }))
  }

  // Here we set the active conversation
  setActiveConversation(conversation: Conversation | null) {
    if (!conversation?.id) {
      this.activeConversationSource.next(null);
    } else {
      const builtActiveChat = {...conversation }; // Immutable copy
      this.activeConversationSource.next(builtActiveChat);
      this.setActiveConversationMessages(builtActiveChat.messages);
    }
  }

  // Here we send a message to a current conversation
  sendMessage(data: CreateMessageData) {
    return this.http.post<any>(`${this.ENV.apiUrl}/messages`, data).pipe(tap(() => {
      //To trigger conversations in conversations page
      this.conversationService.fetchConversations();
    }))
  }

  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null) {
    this.partnerInfoSource.next(data)
  }

  // Here we set active conversation's messages
  setActiveConversationMessages(messagesList: Message [] | null) {
    this.activeChatMessagesListSource.next(messagesList);
  }

  get getActiveConversationMessages() {
    return this.activeChatMessagesListSource.asObservable()
  }

  get getPartnerInfo (){
    return this.partnerInfoSource.asObservable();
  }

  get getActiveConversation () {
    return this.activeConversationSource.asObservable()
  }

}
