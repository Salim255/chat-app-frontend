import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Partner } from "src/app/interfaces/partner.interface";
import { createChatInfo } from "src/app/interfaces/chat.interface";
import { Conversation } from "../../active-conversation/models/active-conversation.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private ENV = environment;
  private activeConversationSource = new BehaviorSubject<Conversation | null > (null);
  private conversationsSource = new BehaviorSubject<Array<Conversation> | null> (null);
  private partnerInfoSource = new BehaviorSubject<any | null > (null);
  private activeChatMessagesListSource = new BehaviorSubject<any | null> (null);


  constructor(private http: HttpClient) {

    }

  createConversation (data: createChatInfo) {
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
          return this.http.post<any>(`${this.ENV.apiUrl}/chats`,
            data,
             {
              headers:
              {
                Authorization: `Bearer ${token}`
              }
            }
        )
      } )
    )
  }

  setActiveConversation(conversation: Conversation) {
    if (!conversation) {
      this.activeConversationSource.next(null);
    } else {
      const buildActiveChat = new Conversation(conversation.id, conversation.created_at, conversation.updated_at, conversation.messages, conversation.users);
      this.activeConversationSource.next(buildActiveChat)
    }
  }

  setConversations (chats: any) {
      this.conversationsSource.next(chats);
  }

  setPartnerInfo(data: Partner) {
    this.partnerInfoSource.next(data)
  }

  fetchChatByChatId(chatId: number) {
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
        }
      ),
      switchMap( (token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/chats/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
           }
        )
      }),
      tap( (response) => {
        this.setActiveConversation(response.data[0])

      })
    )
  }


  //
  sendMessage(data: any) {
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
          this.fetchConversations()
        })
      )
  }

  fetchConversations () {
    return from(Preferences.get({key: 'authData'})).pipe(
      map( (storedData) => {
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
      switchMap ( (token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
         }
        )
      }),
      tap ( (response) => {
        if (response) {
          if (response.data) {
            this.setConversations(response.data)
          }
        }

      })
    )
  }

  fetchChatByUsers (partnerId: number) {
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

  // Once user connected we want to mark all messages with status sent to delivered
  markMessagesAsDeliveredOnceUserConnected () {
    return from(Preferences.get({key: 'authData'}))
      .pipe (
        map (
          ( storedData ) => {
              if (!storedData || !storedData.value) {
                return null
              }
              return this.subtractToken(storedData);
          }
        ),
        switchMap ( (token) => {
          return this.http.put<any>(`${this.ENV.apiUrl}/messages/user`, {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
             }
          )
        }),
        tap ( (response) => {

          console.log(response , 'Hello response ⛱️⛱️⛱️');

        })
      )
  }

  //
  updateMessagesStatus (chatId: number, messageStatus: string) {
    return from (Preferences.get({key: 'authData'}))
      .pipe (
        map (
          (storedData ) => {
            if (!storedData || !storedData.value) {
              return null
            }
            return this.subtractToken(storedData);
          }
        ),
        switchMap ( (token) => {
          return this.http.put<any>(`${this.ENV.apiUrl}/chats/${chatId}/messages/${messageStatus}`, {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
           })
        }),
        tap ( (response) => {
          console.log(response, "Hello from updated messages");
        }

        )
      )
  }


  get getConversations () {
    return this.conversationsSource.asObservable()
  }

  get getActiveChatMessages() {
    return this.activeChatMessagesListSource.asObservable()
  }

  subtractToken (storedData: any) {
    const parseData = JSON.parse(storedData.value) as {
      _token: string;
      userId: string;
      tokenExpirationDate: string;
    }

    let token = parseData._token;
    return token;
  }

 setActiveConversationMessages(messagesList: any){
    this.activeChatMessagesListSource.next(messagesList)
 }
}
