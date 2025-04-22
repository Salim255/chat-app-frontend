import { Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../../../messages/model/message.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  ActiveConversationService,
  PartnerRoomStatus,
} from 'src/app/features/active-conversation/services/active-conversation.service';
import {
  SendMessageEmitterData,
  SocketIoService,
  JoinRomData,
  ConnectionStatus,
} from 'src/app/core/services/socket-io/socket-io.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Conversation } from 'src/app/features/conversations/models/conversation.model';
import { MessageService } from 'src/app/features/messages/services/message.service';
import { SocketMessageHandler } from 'src/app/core/services/socket-io/socket-message-handler';
import { SocketRoomHandler } from 'src/app/core/services/socket-io/socket-room-handler';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { IonContent } from '@ionic/angular';

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

  private conversationRoomId: string | null = null;
  activeChat: Conversation | null = null;
  userId: number | null = null;
  partnerInfo: Partner | null = null;
  messagesList = signal<Message[]>([]);

  constructor(
    private authService: AuthService,
    private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService,
    private messageService: MessageService,
    private socketMessageHandler: SocketMessageHandler,
    private socketRoomHandler: SocketRoomHandler,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.subscribeToUserId();
  }

  ionViewWillEnter(): void {
    this.subscribeToConversation();
    this.subscribeToConversationRoom();
    this.subscribeToPartner();
    this.subscribeToUserId();

    // Sockets
    this.subscribeUpdatedMessagesToReadWithPartnerJoin();
    this.subscribeReadMessage();
    this.subscribeToPartnerConnection();
  }

  createNewChatObs(data: CreateChatDto): void {
    this.activeConversationService.createConversation(data).subscribe({
      next: (response) => {
        console.log(response);
        // Notify partner of newly created conversation
        const newConversation: Conversation = { ...response?.data.chat };
        this.socketIoService.createdConversationEmitter(newConversation);
      },
      error: () => {
        //
      },
    });
  }

  onSendMessageEmitter(message: Message): void {
    if (!(this.userId && this.partnerInfo?.partner_id && this.conversationRoomId)) return;

    const sendMessageEmitterData: SendMessageEmitterData = {
      message: message,
      roomId: this.conversationRoomId,
      fromUserId: this.userId,
      toUserId: this.partnerInfo.partner_id,
    };
    this.socketIoService.sentMessageEmitter(sendMessageEmitterData);
  }

  onSubmit(message: string): void {
    if (!this.activeChat && this.userId && this.partnerInfo?.partner_id) {
      const createChatData: CreateChatDto = {
        content: message,
        to_user_id: this.partnerInfo.partner_id,
        from_user_id: this.userId,
      };
      this.createNewChatObs(createChatData);
    } else {
      this.sendMessageObs(message);
    }
  }

  sendMessageObs(message: string): void {
    if (!(this.partnerInfo?.partner_id && this.userId && this.activeChat?.id)) {
      return;
    }

    const data: CreateMessageDto = {
      content: message,
      from_user_id: this.userId,
      to_user_id: this.partnerInfo.partner_id,
      chat_id: this.activeChat?.id,
      partner_connection_status: this.partnerInfo.connection_status ?? 'offline',
    };

    this.messageService.sendMessage(data).subscribe({
      next: (response) => {
        if (!response) return;
        const sentMessage = response.data.message;
        if (
          this.activeConversationService?.partnerRoomStatusSource.value ===
          PartnerRoomStatus.IN_ROOM
        ) {
          sentMessage.status = 'read';
        }
        // Add the new message to the chat
        this.activeChat?.messages?.push(sentMessage);
        this.handleNewMessage();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private handleNewMessage(): void {
    if (!(this.activeChat && this.activeChat.messages)) return;

    const messages: Message[] = this.activeChat?.messages;

    const lastMessage = this.messageService.getLastMessage(messages);
    //this.activeChat.messages.push(messages)
    if (!lastMessage) return;

    // Trigger "send-message" emitter
    this.onSendMessageEmitter(lastMessage);
  }

  private subscribeToPartnerConnection(): void {
    this.partnerConnectionSubscription =
      this.socketMessageHandler.getPartnerConnectionStatus.subscribe((updatedUser) => {
        if (updatedUser && this.partnerInfo) {
          this.partnerInfo.connection_status = updatedUser.connection_status;
          if (this.partnerInfo.connection_status === ConnectionStatus.Offline) {
            this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.OFFLINE);
          } else {
            if (this.activeChat) {
              // Update active chat by reference
              this.activeConversationService.updateMessagesStatusToDeliveredWithPartnerConnection(
                this.activeChat
              );
              this.activeConversationService.setMessagePageScroll();
            }
            this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.CONNECTED);
          }
        }
      });
  }
  private subscribeToConversationRoom(): void {
    // Getting roomId from socket.service
    this.conversationRoomIdSubscription = this.socketIoService.getConversationRoomId.subscribe(
      (roomId) => {
        this.conversationRoomId = roomId;
      }
    );
  }

  private subscribeToConversation(): void {
    // Here we get active conversation
    this.activeConversationSubscription =
      this.activeConversationService.getActiveConversation.subscribe((data) => {
        if (data && data?.messages) {
          this.activeChat = data;
          console.log(data, 'hello');
        }
      });
  }

  private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId.subscribe((data) => {
      this.userId = data;
    });
  }

  private subscribeToPartner(): void {
    // Here we get the partner information
    this.partnerInfoSubscription = this.activeConversationService.getPartnerInfo.subscribe(
      (partnerInfo) => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo;
          if (!(this.partnerInfo.partner_id && this.userId)) return;

          const usersData: JoinRomData = {
            fromUserId: this.userId,
            toUserId: this.partnerInfo?.partner_id,
            chatId: this.activeChat && this.activeChat.id,
            lastMessageSenderId:
              (this.activeChat && this.activeChat.messages[-1]?.from_user_id) ?? null,
          };
          this.socketIoService.userJoinChatRoom(usersData);
        }
      }
    );
  }

  private subscribeUpdatedMessagesToReadWithPartnerJoin(): void {
    this.updatedMessagesToReadWithPartnerJoinSubscription =
      this.socketRoomHandler.getUpdatedMessagesToReadAfterPartnerJoinedRoom.subscribe(
        (updatedMessagesToRead) => {
          // Update chat messages
          if (updatedMessagesToRead && updatedMessagesToRead.length > 0) {
            // Get the active conversation
            const activeConversation = this.activeChat;
            if (!activeConversation) return;

            // Update only the status of messages that match
            activeConversation?.messages?.forEach((msg) => {
              const updatedMsg = updatedMessagesToRead.find((updated) => updated.id === msg.id);
              if (updatedMsg) {
                msg.status = 'read'; // Set the status to "read"
              }
            });

            // Update the active conversation to reflect changes
            this.activeChat = { ...activeConversation };
            this.conversationService.updatedActiveConversationMessagesToReadWithPartnerJoin(
              this.activeChat
            );
          }
        }
      );
  }

  // Here we push received message during live chat
  private subscribeReadMessage(): void {
    this.readMessageSubscription = this.socketMessageHandler.getReadMessage.subscribe((message) => {
      if (message) {
        // Here we push received message during live chat
        this.activeChat?.messages?.push(message);
        this.activeConversationService.setMessagePageScroll();
      }
    });
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
    this.socketMessageHandler.setReadMessageSource(null);
    this.socketMessageHandler.setDeliveredMessage(null);
    this.socketRoomHandler.setUpdatedMessagesToReadAfterPartnerJoinedRoom(null);
    this.socketIoService.setConversationRoomId(null);
  }

  ionViewWillLeave(): void {
    console.log('Leaving active conversation', this.partnerInfo);
    this.cleanUp();
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
