import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';

@Component({
    selector: 'app-conversations',
    templateUrl: './conversations.page.html',
    styleUrls: ['./conversations.page.scss'],
    standalone: false
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  private updatedUserDisconnectionSubscription!: Subscription;
  private updatedChatCounterSubscription!: Subscription;

  conversations: Array<Conversation> = [] ;
  isEmpty: boolean = true ;
  constructor(private conversationService: ConversationService,
    private accountService: AccountService, private socketIoService: SocketIoService
  ) { }

  ngOnInit() {
    this.subscribeToConversations();
    this.subscribeUpdatedUserDisconnection();
  }

  ionViewWillEnter () {
    if (!this.conversationsSource || this.conversationsSource.closed) {
        this.subscribeToConversations();
    }

    if (!this.updatedUserDisconnectionSubscription || this.updatedUserDisconnectionSubscription.closed) {
      this.subscribeUpdatedUserDisconnection();
    }

    if (!this.updatedChatCounterSubscription || this.updatedChatCounterSubscription.closed) {
      this.subscribeToUpdateChatCounter();
    }

    this.conversationService.fetchConversations().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  ionViewWillLeave () {
    this.cleanUp();
  }

  private subscribeToConversations() {
    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      if(chats){
        this.conversations = chats;
        this.isEmpty = chats.length === 0 ;
      }
    })
  }

  private subscribeUpdatedUserDisconnection() {
    this.updatedUserDisconnectionSubscription = this.socketIoService.updatedUserDisconnectionGetter.subscribe(data => {
      this.conversationService.fetchConversations().subscribe();
     })
  }

  private subscribeToUpdateChatCounter() {
    this.updatedChatCounterSubscription = this.socketIoService.getUpdatedChatCounter.subscribe(updatedChat => {
      //console.log(this.conversations, 'from conversation', updatedChat)
      this.conversations = this.conversations.map(chat => {
        if (chat.id === updatedChat?.id) {
          return {
            ...chat,
            updated_at: updatedChat?.updated_at,
            no_read_messages: updatedChat?.no_read_messages
          }
        } else {
          return chat
        }
      });

      // Then sort the conversations by updated_at in descending order
      this.conversations = this.conversations.sort((a, b) => {
      return new Date(b.updated_at ?? new Date(0)).getTime() - new Date(a.updated_at ?? new Date(0)).getTime();
        });
    })
  }

  private cleanUp() {
    this.conversationsSource?.unsubscribe();
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.updatedChatCounterSubscription?.unsubscribe();
  }

  ngOnDestroy () {
    this.cleanUp();
  }
}
