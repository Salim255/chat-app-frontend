import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Conversation } from "src/app/models/activeConversation.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private ENV = environment;
  private activeConversationSource = new BehaviorSubject<Conversation | null > (null);
  private conversationsSource = new BehaviorSubject<Array<Conversation> | null> (null);
  private partnerInfoSource = new BehaviorSubject<any | null > (null);
  constructor(private htp: HttpClient) {

    }

  createConversation(data: any) {
    return from(Preferences.get({key: 'authData'})).pipe(
      map( (storedData) => {
          if (!storedData || !storedData.value ) {
            return null
          };

          const parseData = JSON.parse(storedData.value) as {
            _token: string;
            userId: string;
            tokenExpirationDate: string;
          }

          let token = parseData._token;

          return token;
      }), switchMap( (token) => {
          return this.htp.post<any>(`${this.ENV.apiUrl}/chats`, {
            partnerId: data.partnerId,
            content: data.message
         }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
         })
      } ), tap( (response) => {
        this.setActiveConversation(response.data[0])

      })
    )
  }

  setActiveConversation(conversation: Conversation) {
    const buildActiveChat = new Conversation(conversation.id, conversation.created_at, conversation.updated_at, conversation.messages, conversation.users);
    this.activeConversationSource.next(buildActiveChat)
  }

  setConversations(chats: any){
     this.conversationsSource.next(chats)
  }

  setPartnerInfo(data:any) {
    this.partnerInfoSource.next(data)
  }

  sendMessage(data: any) {
      return from(Preferences.get({key: 'authData'})).pipe(
        map(( storedData ) => {
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
        switchMap((token) => {
          return this.htp.post<any>(`${this.ENV.apiUrl}/messages`, data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
           }
        )
        }),tap( () => {
          this.fetchConversations()
        })
      )
  }

  fetchConversations(){
    return from(Preferences.get({key: 'authData'})).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null
        }

        const parseData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
        }

        let token = parseData._token;

        return token;
      }),
      switchMap((token) => {
        return this.htp.get<any>(`${this.ENV.apiUrl}/chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
         }
        )
      }),
      tap((response) => {
        if (response) {
          if (response.data){
            this.setConversations(response.data)
          }
        }

      })
    )
  }

  onConversation(conversation: Conversation){
    this.setActiveConversation(conversation)

  }
  get getActiveConversation(){
    return this.activeConversationSource.asObservable()
  }

  get getConversations(){
    return this.conversationsSource.asObservable()
  }

  get getPartnerInfo(){
    return this.partnerInfoSource.asObservable();
  }
}
