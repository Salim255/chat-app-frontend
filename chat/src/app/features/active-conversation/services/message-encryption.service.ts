import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Conversation } from '../../conversations/models/conversation.model';
import { ConversationWorkerHandler } from '../../conversations/services/conversation.worker-handler';
import { AuthData } from './active-conversation.service';
import { MessageEncryptDecrypt } from 'src/app/core/services/encryption/message-encrypt-decrypt-';
import { buildMessageEncryptionData } from './active-conversation.utils';
import { UserInChatDto } from '../../conversations/interfaces/conversations.dto';

@Injectable({
  providedIn: 'root'
})
export class MessageEncryptionService {
  private workerHandler!: ConversationWorkerHandler;
  constructor() {
     this.workerHandler = new ConversationWorkerHandler();
  }

  decryptConversation(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ): Observable<Conversation | null> {
    if (conversations.length === 0) return of(null);
    return this.workerHandler.decryptConversations(conversations, authData)
    .pipe(
        map(decrypted => decrypted[0] || null),
        catchError(() => of(null))
      );
  }

  encryptMessage(
    content: string,
    authData: AuthData,
    partnerInfo: UserInChatDto | null,
    activeConversation: Conversation | null,
  ): Observable<{ encryptedMessageBase64: string }>{
    const messageData = buildMessageEncryptionData(
      content,
      authData,
      partnerInfo,
      activeConversation
    );
    return from(MessageEncryptDecrypt.encryptMessage(messageData));
  }
}
