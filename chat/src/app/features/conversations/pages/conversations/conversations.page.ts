import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SocketMessageHandler } from 'src/app/core/services/socket-io/socket-message-handler';

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
  private userIdSubscription!: Subscription;

  private messageDeliverySubscription!: Subscription;
  userId: number | null = null;

  conversations: Conversation [] = [] ;
  isEmpty: boolean = true ;

  constructor(private conversationService: ConversationService,
    private accountService: AccountService,
    private socketIoService: SocketIoService,
    private authService: AuthService,
    private socketMessageHandler: SocketMessageHandler
  ) { }

  ngOnInit() {
    this.subscribeToUserId();
    this.subscribeToConversations();
    this.subscribeUpdatedUserDisconnection();
    this.subscribeToMessageDelivery();
  }

  ionViewWillEnter () {
    if (!this.messageDeliverySubscription || this.messageDeliverySubscription.closed) {
      this.subscribeToMessageDelivery();
    }
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

  // Subscribe to message delivery
  private subscribeToMessageDelivery(){
    this.messageDeliverySubscription = this.socketMessageHandler.getMessageDeliveredToReceiver.subscribe(message => {
       if (message) {
        this.updateGlobalConversations(message);
        this.updateChatWithReceivedMessage(message)
       }
    })
  }

  private updateChatWithReceivedMessage(message: any) {
     message && this.updateGlobalConversations(message);
  }

  private updateGlobalConversations(message: any) {
    this.conversations = this.conversations.map(chat => {
      if (chat.id === message.chat_id) {
        const messageExits = chat.messages?.some(msg => msg.id === message.id);
        const currentMessages = chat.messages || [];
        return {
          ...chat,
          last_message: message,
          messages: messageExits
          ? currentMessages.map( msg => ( msg.id === message.id ? message : msg) )
          : [...(chat.messages|| [] ), message],
        }
      }
      return chat;
   })
  }


   // Subscribe to the user ID from aAuthservice
   private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }
  // Add a trackBy function for better performance
  trackById(index: number, conversation: any) {
    return conversation.id;
  }


  private subscribeToConversations() {
    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      //, "just here console.log(chats, "hello")
      if(chats){
        this.conversations = [...chats];
        this.conversations= [...this.conversations]
        console.log( this.conversations, "just here")
        this.isEmpty = chats.length === 0 ;
        this.sortConversations();
      }
    })
  }

  private subscribeUpdatedUserDisconnection() {
    this.updatedUserDisconnectionSubscription = this.socketIoService.updatedUserDisconnectionGetter.subscribe(data => {
      this.conversationService.fetchConversations().subscribe();
     })
  }

  private subscribeToUpdateChatCounter() {
    this.updatedChatCounterSubscription = this.socketMessageHandler.getUpdatedChatCounter.subscribe(updatedChat => {
      console
      this.updateAndSortConversations(updatedChat);
    })
  }

  /**
   * Function to update a conversation, sort the list
   */
  private updateAndSortConversations(updatedChat: any) {
    this.conversations = this.conversations.map(chat => {
      if (chat.id === updatedChat?.id) {
        return {
          ...chat,
          updated_at: updatedChat?.updated_at,
          no_read_messages: updatedChat?.no_read_messages,
        };
      }
      return chat;
    });

    this.sortConversations();
  }

  private sortConversations() {
    console.log(  this.conversations, "From herhehe  s jsj ")
    this.conversations.sort((a, b) => {
      return new Date(b.updated_at ?? new Date(0)).getTime() - new Date(a.updated_at ?? new Date(0)).getTime();
        });
  }
  private cleanUp() {
    this.conversationsSource?.unsubscribe();
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.updatedChatCounterSubscription?.unsubscribe();
    this.userIdSubscription?.unsubscribe();
  }

  ionViewWillLeave () {
    this.cleanUp();
  }

  ngOnDestroy () {
    this.cleanUp();
  }
}
