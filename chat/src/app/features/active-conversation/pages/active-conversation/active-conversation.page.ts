import { Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Message } from '../../../messages/model/message.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Conversation } from 'src/app/features/conversations/models/conversation.model';
import { IonContent } from '@ionic/angular';
import { SocketRoomService, JoinRomData} from 'src/app/core/services/socket-io/socket-room.service';
import { ActiveConversationPartnerService } from '../../services/active-conversation-partner.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';

export type CreateMessageDto = {
  chat_id: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  partner_connection_status: string;
};

export type CreateChatDto = {
  content: string;
  from_user_id: number;
  to_user_id: number;
  partner_connection_status: string;
};

export type ReadDeliveredMessage = Omit<CreateMessageDto , 'content'>;

@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.page.html',
  styleUrls: ['./active-conversation.page.scss'],
  standalone: false,
})
export class ActiveConversationPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private conversationRoomIdSubscription!: Subscription;
  private userIdSubscription!: Subscription;
  private partnerInfoSubscription!: Subscription;
  private partnerConnectionSubscription!: Subscription;
  private activeRoomMessagesSubscription!: Subscription;
  private updatedMessagesToReadWithPartnerJoinSubscription!: Subscription;
  private readMessageSubscription!: Subscription;
  private deliveredMessageSubscription!: Subscription;

  activeChat: Conversation | null = null;
  userId: number | null = null;
  partnerInfo: Partner | null = null;
  messagesList = signal<Message[]>([]);
  isTyping = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private activeConversationService: ActiveConversationService,
    private socketRoomService: SocketRoomService,
    private activeConversationPartnerService: ActiveConversationPartnerService,
  ) {}

  ngOnInit(): void {
    this.subscribeToUserId();
  }

  ionViewWillEnter(): void {
    this.subscribeToConversation();
    this.subscribeToPartner();
    this.subscribeToUserId();
  }

  onSubmit(message: string): void {
    if (!this.activeChat) {
      this.activeConversationService.createConversation(message).subscribe();
    } else {
      this.activeConversationService.sendMessage(message).subscribe();
    }
  }

  private subscribeToConversation(): void {
    this.activeConversationSubscription =
      this.activeConversationService.getActiveConversation.subscribe((data) => {
        this.activeChat = data;
    });
  }

  private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId.subscribe((data) => {
      this.userId = data;
    });
  }

  private subscribeToPartner(): void {
    // Here we get the partner information
    this.partnerInfoSubscription = this.activeConversationPartnerService.getPartnerInfo.subscribe(
      (partnerInfo) => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo;
          if (!(this.partnerInfo.partner_id && this.userId)) return;

          const usersData: JoinRomData = {
            fromUserId: this.userId,
            toUserId: this.partnerInfo?.partner_id,
            chatId: this.activeChat && this.activeChat.id,
          };
          this.socketRoomService.initiateRoom(usersData);
        }
      }
    );
  }

  private cleanUp(): void {
    if (this.comingMessageEvent) this.comingMessageEvent.unsubscribe();
    if (this.activeConversationSubscription) this.activeConversationSubscription.unsubscribe();
    if (this.conversationRoomIdSubscription) this.conversationRoomIdSubscription.unsubscribe();
    if (this.userIdSubscription) this.userIdSubscription.unsubscribe();
    if (this.partnerInfoSubscription) this.partnerInfoSubscription.unsubscribe();
    if (this.activeRoomMessagesSubscription) this.activeRoomMessagesSubscription.unsubscribe();

    this.activeConversationService.setPartnerInfo(null);
    this.activeConversationService.setActiveConversation(null);

    // Socket
    if (this.updatedMessagesToReadWithPartnerJoinSubscription)
      this.updatedMessagesToReadWithPartnerJoinSubscription.unsubscribe();
    if (this.readMessageSubscription) this.readMessageSubscription.unsubscribe();
    if (this.deliveredMessageSubscription) this.deliveredMessageSubscription.unsubscribe();
    if (this.partnerConnectionSubscription) this.partnerConnectionSubscription.unsubscribe();
    this.socketRoomService.setConversationRoomId(null)
  }

  ionViewWillLeave(): void {
    console.log('Leaving active conversation', this.partnerInfo);
    this.cleanUp();
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
