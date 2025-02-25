import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, tap } from "rxjs";
import { Conversation } from "../../active-conversation/models/active-conversation.model";

@Injectable({
  providedIn: 'root'
})

export class ConversationService {
  private ENV = environment;
  private conversationsSource = new BehaviorSubject< Conversation [] | null> (null);

  constructor(private http: HttpClient) {}

  setConversations (chats: any) {
      this.conversationsSource.next(chats);
  }

  fetchConversations () {
    return this.http.get<any>(`${this.ENV.apiUrl}/chats`)
    .pipe(tap ( (response) =>
      {
      if (response) {
        if (response.data) {
          this.setConversations(response.data)
          }
        }
      }
      )
    )
  }

  get getConversations () {
    return this.conversationsSource.asObservable()
  }

}
