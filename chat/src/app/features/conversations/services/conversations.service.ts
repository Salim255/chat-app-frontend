import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conversation } from '../models/conversation.model';
import { Message } from '../../messages/model/message.model';
import { WorkerService } from 'src/app/core/workers/worker.service';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { ConversationWorkerHandler } from './conversation.worker-handler';
import { sortConversations } from '../utils/conversations.utils';

export type WorkerMessage = {
  action: string;
  email: string;
  privateKey: string;
  conversations: Conversation[];
};

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private ENV = environment;
  private conversationsMap = new Map<string,Conversation>();
  private conversationsSource = new BehaviorSubject<Conversation[] | null>(null);
  private workerHandler!: ConversationWorkerHandler;

  constructor(private http: HttpClient, private workerService: WorkerService) {
    this.workerHandler = new ConversationWorkerHandler;
  }

  fetchConversations(): Observable<{ status: string; data: { chats: Conversation[] } }> {

    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        if (!authData) throw new Error('Missing auth data');
        return this.http
        .get<{ status: string; data: { chats: Conversation[] } }>(`${this.ENV.apiUrl}/chats`)
        .pipe(
          tap(response => {
            this.handleFetchedConversations(
              response.data.chats,
              { email: authData._email, privateKey: authData._privateKey },
            )
          })
        );
      })
    );
  }

  private handleFetchedConversations(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ) {
    if (conversations.length > 0) {
      this.workerHandler.decryptConversations(conversations, authData)
      .pipe(
        take(1),
        catchError((err) => {
          console.error(err)
          return of([]);
        }
      ))
      .subscribe(decrypted => {
        this.setConversations(decrypted)
      });
    } else {
      this.setConversations(null)
    }
  }

  setConversations(chats: Conversation[] | null): void {
    if (!chats) {
      this.conversationsSource.next([])
    } else {
      this.conversationsSource.next(sortConversations(chats));
    }
  }

  get getConversations(): Observable<Conversation[] | null> {
    return this.conversationsSource.asObservable();
  }

  addNewlyCreatedConversation(conversation: Conversation): void {
    if (!conversation) return;
    GetAuthData.getAuthData().then(authData => {
      if (!authData) throw new Error('Missing auth data');
      this.workerHandler
        .decryptConversations(
          [ conversation ],
          { email: authData._email, privateKey: authData._privateKey})
        .subscribe(decrypted => {
          if (!decrypted.length) return;
          const decryptedConversation: Conversation = decrypted[0];
          const current = this.conversationsSource.value || [];
          this.setConversations(sortConversations([...current, decryptedConversation]));

        });
    });
  }

  updateConversationWithNewMessage(message: Message): void {
    if (!message) return;

    const updatedConversations = this.conversationsSource?.value?.map(conversation => {
      if (conversation.id === message.chat_id) { // check if it's the correct conversation
        return {
          ...conversation,
          messages: [...(conversation.messages || []), message]
        };
      }
      return conversation; // leave other conversations unchanged
    });

    if (updatedConversations) {
      this.setConversations(sortConversations(updatedConversations));
    }

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
