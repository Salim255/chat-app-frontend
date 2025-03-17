import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from, map, Observable, pipe, switchMap, tap } from "rxjs";
import { Conversation } from "../../active-conversation/models/active-conversation.model";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})

export class ConversationService {
  private ENV = environment;
  private conversationsSource = new BehaviorSubject< Conversation [] | null> (null);
  private worker: Worker | null = null;

  constructor(private http: HttpClient) {
    if (typeof Worker !== undefined) {
      this.worker = new Worker (new URL('../../../core/workers/decrypt.worker', import.meta.url), { type: 'module' });
      console.log(this.worker, "worker")
    }

  }

  setConversations (chats: any) {
      this.conversationsSource.next(chats);
  }

  fetchConversations (): Observable < Conversation [] | null > {
    return from(Preferences.get({key: 'authData'})).pipe(
      switchMap((storedData ) => {
        if (!storedData || !storedData.value) {
          throw new Error('Something going wrong.')
        }

        const parsedData = JSON.parse(storedData.value) as {
          _privateKey: string,
          _publicKey: string,
          _email: string
        }

        const decryptionData = {
          email: parsedData._email,
          privateKey: parsedData._privateKey }

          return this.http.get<{ data: Conversation [] }>(`${this.ENV.apiUrl}/chats`)
          .pipe(

            map( response => response.data || null ),

            tap ( (data) => {
              if (data ) {
                console.log(data, "hello from chats ")
                // Send messages to the worker for decryption
                if (this.worker ) {
                  this.worker.postMessage(
                    {
                    action: 'decrypt',
                    ...decryptionData,
                    conversations: data
                    }
                  );

                  // Listen for the worker's response and update conversations
                  this.worker.onmessage = (event: MessageEvent) => {
                    const decryptedData = event.data;
                    //this.setConversations(event.data.conversations);
                    //console.log(event)
                    // Now update the conversations with decrypted data
                    if (decryptedData && decryptedData.conversations) {
                      this.setConversations(decryptedData.conversations);
                      console.log('Decrypted conversations:', this.conversationsSource.value);
                    }
                  };
                }
                }
             }
            )
          )
      }),

    )
  }

  get getConversations () {
    return this.conversationsSource.asObservable()
  }

}
