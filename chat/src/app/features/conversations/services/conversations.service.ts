import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conversation } from '../models/conversation.model';
import { Message } from '../../active-conversation/interfaces/message.interface';
import { WorkerService } from 'src/app/core/workers/worker.service';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { ConversationWorkerHandler } from './conversation.worker-handler';
import { sortConversations, initializeConversationsMap } from '../utils/conversations.utils';

export type WorkerMessage = {
  action: string;
  email: string;
  privateKey: string;
  conversations: Conversation[];
};

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private ENV = environment;
  private conversationsMap = new Map<string, Conversation>();
  private conversationsSource = new BehaviorSubject<Conversation[] | null>(null);
  private workerHandler!: ConversationWorkerHandler;

  constructor(private http: HttpClient, private workerService: WorkerService) {
    this.setConversations(null);
  }

  fetchConversations(): Observable<{ status: string; data: { chats: Conversation[] } }> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        if (!authData) throw new Error('Missing auth data');
        return this.http.get<{ status: string; data: { chats: Conversation[] } }>(`${this.ENV.apiUrl}/chats`).pipe(
          tap(response => this.handleFetchedConversations(
            response.data.chats,
            { email: authData._email, privateKey: authData._privateKey },
          ))
        );
      })
    );
  }

  private handleFetchedConversations(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ) {
    const existing = this.conversationsSource.value || [];
    const existingIds = new Set(existing.map(conversation => conversation.id));
    const newConversations = conversations.filter(conversation => !existingIds.has(conversation.id));

    if (newConversations.length > 0) {
      this.workerHandler.decryptConversations(newConversations, authData)
      .pipe(
        catchError(err => {
          console.error('Decryption failed', err);
          return [];  // Or use: of([]) if you want to continue silently
        }
      ))
      .subscribe(decrypted => {
          this.mergeAndSetConversations(existing, decrypted);
      });
    }
  }

  private mergeAndSetConversations(
    existing: Conversation[],
    newOnes: Conversation[]) {
    const combined = [...existing, ...newOnes];
    this.setConversations(combined);
    this.conversationsMap = initializeConversationsMap(combined);
  }

  setConversations(chats: Conversation[] | null): void {
    if (!chats) return;
    this.conversationsSource.next(sortConversations(chats));
  }

  get getConversations(): Observable<Conversation[] | null> {
    return this.conversationsSource.asObservable();
  }

  addNewlyCreatedConversation(conversation: Conversation): void {
    if (!conversation) return;

    GetAuthData.getAuthData().then(authData => {
      if (!authData) throw new Error('Missing auth data');
      this.workerHandler.decryptConversations(
        [ conversation ],
        { email: authData._email,
          privateKey: authData._privateKey,
        }).subscribe(decrypted => {
          if (!decrypted.length) return;

          const decryptedConversation = decrypted[0];
          const lastMessageId = decryptedConversation.last_message?.id;
          const decryptedLastMessage = decryptedConversation.messages?.find(msg => msg.id === lastMessageId);

          if (!lastMessageId || !decryptedLastMessage) return;

          decryptedConversation.last_message = {
            ...decryptedConversation.last_message,
            content: decryptedLastMessage.content,
          };

          this.conversationsMap.set(decryptedConversation.id.toString(), decryptedConversation);
          const current = this.conversationsSource.value || [];
          this.setConversations([...current, decryptedConversation]);

        });
    });
  }

  updateConversationWithNewMessage(message: Message, received = false): void {
    if (!message) return;

    const id = message.chat_id.toString();
    const conversation = this.conversationsMap.get(id);
    if (!conversation) return;

    const updatedConversation = {
      ...conversation,
      messages: [...(conversation.messages || []), message],
      last_message: message,
      no_read_messages: received ? (conversation.no_read_messages || 0) + 1 : 0
    };

    this.conversationsMap.set(id, updatedConversation);
    this.setConversations(Array.from(this.conversationsMap.values()));
  }

  updatedActiveConversationMessagesToReadWithPartnerJoin(updatedConversation: Conversation): void {
    if (!updatedConversation || !updatedConversation.id || !updatedConversation.messages) return;

    const updatedList = (this.conversationsSource.value || []).map(conversation => {
      if (conversation.id === updatedConversation.id) {
        const newConversation = {
          ...conversation,
          messages: [...updatedConversation.messages],
          no_read_messages: 0,
          last_message: updatedConversation.messages[updatedConversation.messages.length - 1]
        };
        this.conversationsMap.set(updatedConversation.id.toString(), newConversation);
        return newConversation;
      }
      return conversation;
    });

    this.conversationsSource.next(updatedList);
  }

  updatedActiveConversationMessagesToDeliveredWithPartnerRejoinRoom(
    activeChat: Conversation,
    ): void {
      if (!activeChat.id || !activeChat.messages) return;

      const updatedConversation: Conversation = {
        ...this.conversationsMap.get(activeChat.id.toString()),
        messages: [...activeChat.messages]
      } as Conversation;

      this.conversationsMap.set(activeChat.id.toString(), updatedConversation);
      this.setConversations(Array.from(this.conversationsMap.values()));
  }
}
