import { from, Observable, switchMap } from "rxjs";
import { Conversation } from "../models/active-conversation.model";
import { Preferences } from "@capacitor/preferences";
import { DecryptionActionType } from "src/app/core/workers/decrypt.worker";

type WorkerMessage = {
  action: DecryptionActionType;
  email: string;
  privateKey: string;
  conversations: Conversation []
}

export class DecryptConversationsObserver {
  static decryptConversation(conversations: Conversation [], worker: Worker): Observable< Conversation []> {
    return from(Preferences.get({key: 'authData'})).pipe(
      switchMap((storedData) => {
        if (!storedData || !storedData.value) {
          throw new Error('Something went wrong')
        }

        const parsedData = JSON.parse(storedData.value) as {
          _privateKey: string;
          _email: string;
        };

        const decryptionData = {
          email: parsedData._email,
          privateKey: parsedData._privateKey,
        };

        return new Observable<Conversation []>((observer) =>{
          if (!worker) {
            observer.error(new Error('Web worker not available'));
            return;
          }

          const workerMessageData:  WorkerMessage  = {
            action: DecryptionActionType.decryptConversations,
            ...decryptionData,
            conversations: conversations,
          }

          worker.postMessage(workerMessageData);

          // Handle successful decryption
          worker.onmessage = (event: MessageEvent) => {
            const decryptedData = event.data;
            if (decryptedData && decryptedData.conversations) {
              observer.next(decryptedData.conversations);
              observer.complete();
            } else {
              observer.error(new Error('Decryption failed'));
            }
            // Terminate worker safely
            worker.terminate();
          };


          // Handle worker errors
          worker.onerror = (error) => {
            observer.error(new Error(`Worker error: ${error.message}`));
            // Ensure the worker is properly terminated
            worker.terminate();

        };
        })
      })
    )
  }
}
