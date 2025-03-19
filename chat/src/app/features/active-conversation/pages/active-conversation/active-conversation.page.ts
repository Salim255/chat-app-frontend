import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { SendMessageEmitterData, SocketIoService, JoinRomData } from "src/app/core/services/socket-io/socket-io.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { MessageService } from "src/app/features/active-conversation/services/message.service";
import { ChatService } from "src/app/features/active-conversation/services/chat.service";
import { SocketMessageHandler } from "src/app/core/services/socket-io/socket-message-handler";
import { SocketRoomHandler } from "src/app/core/services/socket-io/socket-room-handler";


export type CreateMessageData = {
  chatId: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  partnerConnectionStatus: string;
}

export type CreateChatInfo = {
  content: string;
  fromUserId: number;
  toUserId: number
}

export type ReadDeliveredMessage = Omit<CreateMessageData, 'content'>

@Component({
    selector: 'app-active-conversation',
    templateUrl: './active-conversation.page.html',
    styleUrls: ['./active-conversation.page.scss'],
    standalone: false
})

export class ActiveConversationPage implements OnInit, OnDestroy {
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private conversationRoomIdSubscription!: Subscription;
  private userIdSubscription!: Subscription;
  private partnerInfoSubscription!: Subscription;
  private activeRoomMessagesSubscription!: Subscription ;
  private updatedMessagesToReadWithPartnerJoinSubscription!: Subscription;
  private readMessageSubscription!:  Subscription;
  private deliveredMessageSubscription!: Subscription;

  private conversationRoomId: string | null = null;
  activeChat: Conversation | null = null;
  userId: number | null = null;
  partnerInfo: Partner | null = null;
  messagesList = signal< Message []> ([]) ;

  constructor(
    private authService: AuthService, private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService,
    private messageService: MessageService, private chatService: ChatService,
    private socketMessageHandler:  SocketMessageHandler,
    private socketRoomHandler: SocketRoomHandler
    ){}

  ngOnInit(): void {
    this.subscribeToUserId();
  }

  ionViewWillEnter() {

    this.subscribeDeliveredMessage();
    this.subscribeToConversation();
    this.subscribeToConversationRoom();
    this.subscribeToPartner();
    this.subscribeToUserId();

    // Sockets
    this.subscribeUpdatedMessagesToReadWithPartnerJoin();
    this.subscribeReadMessage();
 }


  createNewChatObs(data: CreateChatInfo) {
    this.chatService.createNewChat(data).subscribe({
      next: () => {
        this.handleNewMessage();
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  onSendMessageEmitter (message: Message) {
    if (!(this.userId && this.partnerInfo?.partner_id && this.conversationRoomId)) return;

    const sendMessageEmitterData: SendMessageEmitterData  = {
      message: message,
      roomId: this.conversationRoomId,
      fromUserId: this.userId,
      toUserId: this.partnerInfo.partner_id
    };

    this.socketIoService.sentMessageEmitter(sendMessageEmitterData);
  }

  onSubmit(message: string) {
     if (!this.activeChat && this.userId && this.partnerInfo?.partner_id) {
        const createChatData: CreateChatInfo = {
           content: message,
           toUserId: this.partnerInfo.partner_id,
           fromUserId: this.userId
           };
        this.createNewChatObs(createChatData);
     } else  {
      this.sendMessageObs(message);
     }
  }

  sendMessageObs(message: string) {
    if (!(this.partnerInfo?.partner_id && this.userId && this.activeChat?.id) ) {
      return
    }

    const data: CreateMessageData =
    {
       content: message,
       fromUserId: this.userId,
       toUserId: this.partnerInfo.partner_id,
       chatId: this.activeChat?.id,
       partnerConnectionStatus: this.partnerInfo.connection_status ?? 'offline'
    };

    this.messageService.sendMessage(data).subscribe({
      next: (response) => {
        if (!response) return;
        // Add the new message to the chat
        this.activeChat?.messages?.push(response);
        this.handleNewMessage();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

 private handleNewMessage() {
    if (!(this.activeChat && this.activeChat.messages)) return;

    const messages: Message[] = this.activeChat?.messages;

    let lastMessage = this.messageService.getLastMessage(messages);

    if (!lastMessage) return;

    // Trigger "send-message" emitter
    this.onSendMessageEmitter(lastMessage);
  }

  private subscribeToConversationRoom() {
    // Getting roomId from socket.service
    this.conversationRoomIdSubscription = this.socketIoService.getConversationRoomId
    .subscribe(roomId => {
      this.conversationRoomId = roomId;
    });
  }

  private subscribeToConversation() {
    // Here we get active conversation
    this.activeConversationSubscription = this.activeConversationService
    .getActiveConversation.subscribe(data => {

      if (data && data?.messages ) {
          this.activeChat = data;
      }
    });
  }

  private subscribeToUserId() {
    this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  private subscribeToPartner( ) {
    // Here we get the partner information
    this.partnerInfoSubscription = this.activeConversationService
    .getPartnerInfo.subscribe( partnerInfo => {
      if (partnerInfo) {
        this.partnerInfo = partnerInfo;
        if (!(this.partnerInfo.partner_id && this.userId))  return;

        const usersData: JoinRomData = {
            fromUserId: this.userId,
            toUserId: this.partnerInfo?.partner_id,
            chatId: this.activeChat && this.activeChat.id,
            lastMessageSenderId: (this.activeChat && this.activeChat.last_message?.from_user_id) ?? null
          };
        this.socketIoService.userJoinChatRoom(usersData);
      }
    });
  }

  private subscribeDeliveredMessage () {
    this.deliveredMessageSubscription = this.socketMessageHandler.getDeliveredMessage.subscribe(deliveredMessage => {
      if (deliveredMessage) {
        this.messageService.updateMessageStatus(this.messagesList(), deliveredMessage );
      }
    })
  }

  private subscribeUpdatedMessagesToReadWithPartnerJoin() {
    this.updatedMessagesToReadWithPartnerJoinSubscription =  this.socketRoomHandler.getUpdatedMessagesToReadAfterPartnerJoinedRoom.subscribe(messages => {
      // Update chat messages
      if (messages && messages.length > 0) {
        this.messageService.updateMessagesOnPartnerJoin(this.messagesList(), messages)
      }
    })
  }

  private subscribeReadMessage() {
    this.readMessageSubscription = this.socketMessageHandler.getReadMessage.subscribe(message => {
      if (message) {
        this.messageService.updateMessageStatus(this.messagesList(), message);
      }
    })
  }

  private cleanUp() {
    if (this.comingMessageEvent) this.comingMessageEvent.unsubscribe();
    if (this.activeConversationSubscription) this.activeConversationSubscription.unsubscribe();
    if (this.conversationRoomIdSubscription) this.conversationRoomIdSubscription.unsubscribe();
    if (this.userIdSubscription) this.userIdSubscription.unsubscribe();
    if (this.partnerInfoSubscription) this.partnerInfoSubscription.unsubscribe();
    if (this.activeRoomMessagesSubscription) this.activeRoomMessagesSubscription.unsubscribe();

    this.activeConversationService.setPartnerInfo(null);
    this.activeConversationService.setActiveConversation(null);

    // Socket
    if (this.updatedMessagesToReadWithPartnerJoinSubscription) this.updatedMessagesToReadWithPartnerJoinSubscription.unsubscribe();
    if (this.readMessageSubscription) this.readMessageSubscription.unsubscribe();
    if (this.deliveredMessageSubscription) this.deliveredMessageSubscription.unsubscribe();

    this.socketMessageHandler.setReadMessageSource(null);
    this.socketMessageHandler.setDeliveredMessage(null);
    this.socketRoomHandler.setUpdatedMessagesToReadAfterPartnerJoinedRoom(null);
    this.socketIoService.setConversationRoomId(null);
  }

  ionViewWillLeave() {
    console.log('Leaving active conversation', this.partnerInfo);
    this.cleanUp();
  }

  ngOnDestroy() {
    this.cleanUp();
  }
}
