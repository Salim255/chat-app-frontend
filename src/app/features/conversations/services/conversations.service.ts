import { Injectable } from '@angular/core';
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
import { Conversation } from '../models/conversation.model';
import { Message } from '../../messages/model/message.model';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { ConversationWorkerHandler } from './conversation.worker-handler';
import { sortConversations } from '../utils/conversations.utils';
import { ConversationResponse, FetchedConversationsResponse } from '../interfaces/conversations.dto';
import { ConversationsHttpService } from './conversation-http.service';

export type WorkerMessage = {
  action: string;
  email: string;
  privateKey: string;
  conversations: Conversation[];
};

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private conversationsSource = new BehaviorSubject<Conversation[] | []>([]);
  private workerHandler!: ConversationWorkerHandler;

  constructor(private conversationsHttpService: ConversationsHttpService) {
    this.workerHandler = new ConversationWorkerHandler;
  }

  fetchConversations(): Observable<FetchedConversationsResponse> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        if (!authData) throw new Error('Missing auth data');
        return this.conversationsHttpService.fetchConversations()
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

  fetchConversationChatById(chatId: number): Observable<ConversationResponse>{
    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        if (!authData) throw new Error('Missing auth data');
        return this.conversationsHttpService.fetchSingleConversation(chatId)
        .pipe(
          tap(response => {
            console.log('Hello from chat by id', response.data.chat);
            this.handleFetchedSingleConversation(
              [response.data.chat],
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
        this.setConversations([...decrypted])
      });
    } else {
      this.setConversations(null)
    }
  }

  private handleFetchedSingleConversation(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ) {
    if (!conversations.length) return

    this.workerHandler.decryptConversations(conversations, authData)
    .pipe(
      take(1),
      catchError((err) => {
        console.error(err)
        return of([]);
      }
    ))
    .subscribe(decryptedConversations => {
      const updatedConversation = decryptedConversations[0];
      if (!this.isChatPresent(updatedConversation.id)){
        this.setConversations([...this.conversationsSource.value, updatedConversation]);
      } else {
        const updatedConversations = this.updateConversationsList(updatedConversation);
        this.setConversations([...updatedConversations]);
      }
    });

  }

  restActiveConversationCounterWithJoinRoom(updatedConversation: Conversation): void{
    const updatedConversations = this.updateConversationsList(updatedConversation);
    this.setConversations([...updatedConversations]);
  }

  updateConversationsList(
     updatedConversation: Conversation
    ): Conversation[] {
      const conversations = this.conversationsSource.value;
    if (!conversations) {
      return updatedConversation.id ? [updatedConversation] : [];
    }
    return conversations.map(chat => {
      if (chat.id === updatedConversation.id) {
        return {
          ...chat,
          messages: updatedConversation.messages,
          delivered_messages_count: updatedConversation.delivered_messages_count,
        };
      } else {
        return chat;
      }
    });
  }

  setConversations(chats: Conversation[] | null): void {
    if (!chats) {
      this.conversationsSource.next([])
    } else {
      this.conversationsSource.next(sortConversations(chats));
    }
  }

  isChatPresent(chatId: number): boolean{
    if (!this.conversationsSource?.value) return false
    return this.conversationsSource.value.some(chat => chat.id === chatId);
  }
  get getConversations(): Observable<Conversation[] | null> {
    return this.conversationsSource.asObservable();
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
}
