import { Component, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SocketCoreService } from 'src/app/core/services/socket-io/socket-core.service';
import { RandomUserConnectionStatus, SocketPresenceService } from 'src/app/core/services/socket-io/socket-presence.service';
import { SocketChatService } from 'src/app/core/services/socket-io/socket-chat.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  standalone: false,
})
export class ConversationsPage implements OnDestroy {
  private conversationsSource!: Subscription;
  private updatedUserDisconnectionSubscription!: Subscription;
  private updatedChatCounterSubscription!: Subscription;
  private userIdSubscription!: Subscription;
  private updateConversationWithNewMessageSubscription!: Subscription;

  userId: number | null = null;
  conversations: Conversation[] = [];
  isEmpty: boolean = true;
  partnerConnection = signal<RandomUserConnectionStatus | null>(null)

  constructor(
    private socketChatService: SocketChatService,
    private conversationService: ConversationService,
    private accountService: AccountService,
    private authService: AuthService,
    private socketCoreService: SocketCoreService,
    private socketPresenceService: SocketPresenceService,
    private socketTypingService: SocketTypingService,
  ) {}

  ionViewWillEnter(): void {
    this.conversationService.fetchConversations().subscribe();
    this.accountService.fetchAccount().subscribe();

    this.subscribeToUserId();
    this.subscribeUpdatedUserDisconnection();
    this.subscribeToConversations();

    this.subscribeToPartnerConnectionStatus();
    this.socketChatService.initializeChatListener();
    this.socketTypingService.initializeTypingListener();
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
        if (conversation && conversation?.length > 0) {
          this.conversations = [...conversation];
          this.isEmpty = conversation.length === 0; //////
        }
        else {
          this.conversations = [];
          this.isEmpty =  true; //////
        }
      });
  }

  private subscribeUpdatedUserDisconnection(): void {
    this.socketCoreService.connectionStatus$.subscribe(user => console.log(user));
  }

  private subscribeToPartnerConnectionStatus() {
    this.updatedUserDisconnectionSubscription =
      this.socketPresenceService.getRandomUserConnectionStatus
      .subscribe((updatedUser) => {
        if (!updatedUser) return;
        this.partnerConnection.set(updatedUser);
      });
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
