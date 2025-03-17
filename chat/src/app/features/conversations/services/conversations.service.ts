import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
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

  fetchConversations (): Observable < Conversation [] | null > {
    return this.http.get<{ data: Conversation [] }>(`${this.ENV.apiUrl}/chats`)
    .pipe(

      map( response => response.data || null ),

      tap ( (data) => {
      if ( data) {
        console.log(data, "hello from chats ")
        this.setConversations(data);
        }
       }
      )
    )
  }

  get getConversations () {
    return this.conversationsSource.asObservable()
  }

}
