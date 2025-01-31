import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Conversation } from "../../active-conversation/models/active-conversation.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private ENV = environment;

  private conversationsSource = new BehaviorSubject<Array<Conversation> | null> (null);


  constructor(private http: HttpClient) {

    }


  setConversations (chats: any) {
      this.conversationsSource.next(chats);
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
        })
      )
  }

  get getConversations () {
    return this.conversationsSource.asObservable()
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

}
