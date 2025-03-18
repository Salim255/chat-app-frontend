import { from, Observable, switchMap } from "rxjs";
import { Conversation } from "../models/active-conversation.model";
import { Preferences } from "@capacitor/preferences";

type WorkerMessage = {
  action: 'decrypt' | 'decrypted';
  email: string;
  privateKey: string;
  conversations: Conversation []
}

export class DecryptConversationsUtils {
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
          if (worker) {
            const workerMessageData:  WorkerMessage  = {
              action: 'decrypt',
              ...decryptionData,
              conversations: conversations,
            }
            worker.postMessage(workerMessageData);

            worker.onmessage = (event: MessageEvent) => {
              const decryptedData = event.data;
              if (decryptedData && decryptedData.conversations) {
                observer.next(decryptedData.conversations);
              } else {
                observer.error(new Error('Decryption failed'));
              }
              observer.complete();
            }
          } else {
            observer.error(new Error('Web worker not available'));
          }
        })
      })
    )
  }
}
