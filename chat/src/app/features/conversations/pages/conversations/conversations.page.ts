import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SocketMessageHandler } from 'src/app/core/services/socket-io/socket-message-handler';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  standalone: false,
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  private updatedUserDisconnectionSubscription!: Subscription;
  private updatedChatCounterSubscription!: Subscription;
  private userIdSubscription!: Subscription;
  private updateConversationWithNewMessageSubscription!: Subscription;

  private messageDeliverySubscription!: Subscription;

  userId: number | null = null;

  conversations: Conversation[] = [];
  isEmpty: boolean = true;

  constructor(
    private conversationService: ConversationService,
    private accountService: AccountService,
    private socketIoService: SocketIoService,
    private authService: AuthService,
    private socketMessageHandler: SocketMessageHandler
  ) {}

  ngOnInit(): void {
    console.log('hello');
    this.subscribeToConversations();
  }

  ionViewWillEnter(): void {
    this.conversationService.fetchConversations();
    this.accountService.fetchAccount();
    this.subscribeToUserId();
    this.subscribeToMessageDelivery();
    this.subscribeToUpdateChatCounter();
    this.subscribeUpdatedUserDisconnection();
  }

  // Subscribe to message delivery
  private subscribeToMessageDelivery(): void {
    this.messageDeliverySubscription =
      this.socketMessageHandler.getMessageDeliveredToReceiver
        .subscribe((message) => {
          if (message) {
            this.updateGlobalConversations(message);
            this.updateChatWithReceivedMessage(message);
          }
        });
  }

  private updateChatWithReceivedMessage(message: Message): void {
    message && this.updateGlobalConversations(message);
  }

  private updateGlobalConversations(message: Message): void {
    this.conversations = this.conversations.map((conversation) => {
      if (conversation.id === message.chat_id) {
        const messageExits = conversation.messages?.some((msg) => msg.id === message.id);
        const currentMessages = conversation.messages || [];
        return {
          ...conversation,
          last_message: message,
          messages: messageExits
            ? currentMessages.map((msg) => (msg.id === message.id ? message : msg))
            : [...(conversation.messages || []), message],
        };
      }
      return conversation;
    });
  }

  // Subscribe to the user ID from aAuthservice
  private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId
      .subscribe((data) => {
        this.userId = data;
      });
  }

  // Add a trackBy function for better performance
  trackById(
    index: number,
    conversation: Conversation,
  ): number {
    return conversation.id;
  }

  private subscribeToConversations(): void {
    this.conversationsSource = this.conversationService
      .getConversations.subscribe((conversation) => {
        if (conversation) {
          this.conversations = [...conversation];
          this.isEmpty = conversation.length === 0; //////
          // this.sortConversations();
        }
      });
  }

  private subscribeUpdatedUserDisconnection(): void {
    this.updatedUserDisconnectionSubscription =
      this.socketIoService.updatedUserDisconnectionGetter
        .subscribe(() => {
          this.conversationService.fetchConversations().subscribe();
      });
  }

  private subscribeToUpdateChatCounter(): void{
    this.updatedChatCounterSubscription = this.socketMessageHandler
      .getUpdatedChatCounter.subscribe(
        (conversation) => {
          this.updateAndSortConversations(conversation);
        }
      );
  }

  // Function to update a conversation, sort the list
  private updateAndSortConversations(updatedChat: Conversation | null) {
    if (!updatedChat) return;
    this.conversations = this.conversations.map((conversation) => {
      if (conversation.id === updatedChat?.id) {
        return {
          ...conversation,
          updated_at: updatedChat?.updated_at,
          no_read_messages: updatedChat?.no_read_messages,
        };
      }
      return conversation;
    });
    // this.sortConversations();
  }

  private cleanUp() {
    this.conversationsSource?.unsubscribe();
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.updatedChatCounterSubscription?.unsubscribe();
    this.userIdSubscription?.unsubscribe();
    this.updateConversationWithNewMessageSubscription?.unsubscribe();
  }

  ionViewWillLeave(): void {
    this.cleanUp();
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
