import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Conversation } from "../models/active-conversation.model";
import { Partner } from "src/app/interfaces/partner.interface";
import { Message } from "../interfaces/message.interface";
import { Preferences } from "@capacitor/preferences";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CreateMessageData } from "src/app/pages/active-conversation/active-conversation.page";
import { ConversationService } from "../../conversations/services/conversations.service";

@Injectable({
  providedIn: 'root'
})

export class ActiveConversationService {
  private ENV = environment;
  private partnerInfoSource = new BehaviorSubject< Partner | null > (null);
  private activeConversationSource = new BehaviorSubject< Conversation | null > (null);
  private activeChatMessagesListSource = new BehaviorSubject< Message[] | null> (null);

  constructor(private http: HttpClient, private conversationService: ConversationService) { }


  fetchChatByPartnerID (partnerId: number) {

    return from (Preferences.get({key: 'authData'}))
    .pipe(
      map ( (storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parseData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
        }

        let token = parseData._token;
        return token;
      }),
      switchMap ( (token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/chats/chat-by-users-ids/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
         }
        )
      }),
      tap ( (response) => {
         this.setActiveConversation(response.data)
      })
    )
  }

  setActiveConversation(conversation: Conversation | null) {
    if (!conversation || !conversation.id) {
      this.activeConversationSource.next(null);
    } else {
      const builtActiveChat = new Conversation(conversation.id, conversation.created_at, conversation.updated_at, conversation.messages, conversation.users);
      this.activeConversationSource.next(builtActiveChat)
    }
  }


  //
  sendMessage(data: CreateMessageData) {
    return from(Preferences.get({key: 'authData'})).pipe(
      map( ( storedData ) => {
          if (!storedData || !storedData.value) {
            return null;
          }

          const parseData = JSON.parse(storedData.value) as {
            _token: string;
            userId: string;
            tokenExpirationDate: string;
          }
          let token = parseData._token;

          return token;
      }),
      switchMap( (token) => {
        return this.http.post<any>(`${this.ENV.apiUrl}/messages`, data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
         }
      )
      }),tap( () => {
        // To trigger conversations in conversations page
        this.conversationService.fetchConversations();
      })
  )
}


  setPartnerInfo(data: Partner | null) {
    this.partnerInfoSource.next(data)
  }

  setActiveConversationMessages(messagesList: Message[] | null) {
    this.activeChatMessagesListSource.next(messagesList)
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
