import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { WorkerMessage } from './conversations.service';
import { DecryptionActionType } from 'src/app/core/workers/decrypt.worker';

export class ConversationWorkerHandler {
  constructor() {}

  decryptConversations(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ): Observable<Conversation[]> {

    return new Observable<Conversation[]>((observer) => {
      const worker = new Worker(
        new URL('../../../core/workers/decrypt.worker.ts', import.meta.url),
        { type: 'module' }
      );
      const message: WorkerMessage = {
        action: DecryptionActionType.DecryptConversations,
        ...authData,
        conversations,
      };
      const handleMessage = (event: MessageEvent) => {
        const decrypted = event.data?.conversations;
        if (decrypted) {
          observer.next(decrypted);
          observer.complete();
        } else {
          observer.error(new Error('Decryption failed: Invalid data format.'));
        }
        cleanup();
      };

      const handleError = (error: ErrorEvent) => {
        observer.error(new Error(`Worker error: ${error.message}`));
        cleanup();
      };

      const cleanup = () => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        worker.terminate();
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);
      worker.postMessage(message);
    })
  }
}
