import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from, map, Observable, switchMap, tap } from "rxjs";
import { Conversation } from "../../active-conversation/models/active-conversation.model";
import { Preferences } from "@capacitor/preferences";

export type WorkerMessage = {
  action: 'decrypt' | 'decrypted';
  email: string;
  privateKey: string; // User's private key
  conversations: Conversation []; // Array of Conversation objects
}

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
          privateKey: parsedData._privateKey
        }

        return this.http.get<{ data: Conversation [] }>(`${this.ENV.apiUrl}/chats`)
        .pipe(

          map( response => response.data || null ),

          tap ( (incomingConversations) => {
            if (!incomingConversations || !this.worker) return;

            const existingConversations = this.conversationsSource.value;
            let conversationsToDecrypt = incomingConversations;
            if (existingConversations && existingConversations.length > 0) {
              // Store existing conversation IDs in a Set for O(1) lookup
              const existingIds = new Set(existingConversations.map(conv => conv.id));
              conversationsToDecrypt = incomingConversations.filter(conv => !existingIds.has(conv.id));

              if (conversationsToDecrypt.length === 0) return; // No new conversations
            }

            this.decryptAndAddConversation(
              conversationsToDecrypt,
              existingConversations ?? [],
              decryptionData
            )
            }
          )
        )
      }),

    )
  }

  private decryptAndAddConversation (
    conversationsToDecrypt: Conversation [],
    existingConversations: Conversation[] ,
    decryptionData: any) {

    if (!this.worker) return;

    const workerMessageData: WorkerMessage =
    {
      action: 'decrypt',
      ...decryptionData,
      conversations:  conversationsToDecrypt
    }

    this.worker.postMessage(workerMessageData);

    // Listen for the worker's response and update conversations
    this.worker.onmessage = (event: MessageEvent) => {
      const decryptedData = event.data;
      // Now update the conversations with decrypted data
      if (decryptedData && decryptedData.conversations) {
        this.setConversations(existingConversations ? [...existingConversations, ...decryptedData.conversations] : decryptedData.conversations);
      }
    };
  }

  get getConversations () {
    return this.conversationsSource.asObservable()
  }

}
