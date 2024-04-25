import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { ActiveConversation } from "src/app/models/activeConversation.model";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private ENV = environment;
  private activeConversationSource = new BehaviorSubject<ActiveConversation | null >(null)
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
        console.log(response.data);
        this.setActiveConversation(response.data)

      })
    )
  }
  setActiveConversation(data: any) {
    const buildActiveChat = new ActiveConversation(data[0].id, data[0].created_at, data[0].updated_at, data[0].messages, data[0].users);
    this.activeConversationSource.next(buildActiveChat)
  }

  sendMessage(data: any) {
      return from(Preferences.get({key: 'authData'})).pipe(
        map(( storedData ) => {
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
          return this.htp.post<any>(`${this.ENV.apiUrl}/messages`, data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
           }
        )
        })
      )
  }

  get getActiveConversation(){
    return this.activeConversationSource.asObservable()
  }
}
