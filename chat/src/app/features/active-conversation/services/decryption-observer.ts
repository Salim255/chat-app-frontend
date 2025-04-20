import { Observable } from 'rxjs';
import { Conversation } from '../../conversations/models/conversation.model';
import { DecryptionActionType } from 'src/app/core/workers/decrypt.worker';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';

type WorkerMessagePayload = {
  action: DecryptionActionType;
  email: string;
  privateKey: string;
  conversations: Conversation[];
};

export class DecryptConversationsObserver {
  static async decryptConversation(
    conversations: Conversation[],
  ): Promise<Observable<Conversation[]>> {
        const { _privateKey: privateKey, _email: email } = await GetAuthData.getAuthData();

        return new Observable<Conversation[]>((observer) => {
          // Create a new worker instance for this specific task
          const worker = new Worker(
              new URL('../../../core/workers/decrypt.worker', import.meta.url), {type: 'module',},
            );

          if (!worker) {
            observer.error(new Error('Web worker not available'));
            return;
          }

          const workerMessageData: WorkerMessagePayload = {
            action: DecryptionActionType.decryptConversations,
            email,
            privateKey,
            conversations: conversations,
          };

          // Act
          worker.postMessage(workerMessageData);

          // Handle successful decryption
          const handleMessage = (event: MessageEvent) => {
            const decryptedData = event.data;
            if (decryptedData && decryptedData.conversations) {
              observer.next(decryptedData.conversations);
              observer.complete();
            } else {
              observer.error(new Error('Decryption failed'));
            }
            // Terminate worker safely
            cleanup();
          };

          // Handle worker errors
          const handleError = (error: ErrorEvent) => {
            observer.error(new Error(`Worker error: ${error.message}`));
            // Ensure the worker is properly terminated
            worker.terminate();
          };

          const cleanup = () => {
            worker.removeEventListener('message', handleMessage);
            worker.removeEventListener('error', handleError);
            worker.terminate();
          };
          worker.addEventListener('message', handleMessage);
          worker.addEventListener('error', handleError);
        });

  }


}
