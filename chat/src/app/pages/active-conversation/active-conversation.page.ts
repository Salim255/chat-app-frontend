import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { SendMessageEmitterData, SocketIoService } from "src/app/services/socket.io/socket.io.service";
import { Partner } from "src/app/interfaces/partner.interface";
import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { JoinRomData } from "src/app/services/socket.io/socket.io.service";
import { MessageService } from "src/app/features/active-conversation/services/message.service";
import { ChatService } from "src/app/features/active-conversation/services/chat.service";


export type CreateMessageData = {
  chatId: number;
  fromUserId: number;
  toUserId: number;
  content: string
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
  styleUrls: ['./active-conversation.page.scss']
})

export class ActiveConversationPage implements OnInit, OnDestroy {
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private conversationRoomIdSubscription!: Subscription;
  private conversationRoomId: string | null = null;
  private userIdSubscription!: Subscription;
  private partnerInfoSubscription!: Subscription;
  private activeRoomMessagesSubscription!: Subscription ;
  private userId: number | null = null;
  partnerInfo: Partner | null = null;
  private activeChat: Conversation | null = null;
  private messagesList: Message [] = [] ;

  typingState: boolean = false;

  constructor(
    private authService: AuthService, private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService,
    private messageService: MessageService, private chatService: ChatService
    ){

  }
  ngOnInit(): void {
    // Getting roomId from socket.service
    this.conversationRoomIdSubscription = this.socketIoService.getConversationRoomId.subscribe(roomId => {
          this.conversationRoomId = roomId;
    })

    this.activeRoomMessagesSubscription = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
      if (messages )  this.messagesList = messages;
    })
  }


  createNewChatObs(data: CreateChatInfo) {
    this.chatService.createNewChat(data).subscribe({
      next: (res) => {
          this.handleNewMessage();
      },
      error: (err) => {
        console.log(err)
      },
    })
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
       chatId: this.activeChat?.id
    };

    this.messageService.sendMessage(data).subscribe({
      next: (response) => {
        this.activeChat = response.data[0];

        this.handleNewMessage();
      },
      error: (err) => {
        console.error(err);
      }
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
      this.sendMessageObs(message)
     }
  }

 private handleNewMessage() {
    if (!(this.activeChat && this.activeChat.messages)) return;

    const messages: Message [] = [...this.activeChat?.messages];

    let lastMessage = this.messageService.getLastMessage(messages);

    if (!lastMessage) return;

    const updatedMessage = [...messages];
    this.activeConversationService.setActiveConversationMessages(updatedMessage);
    // Trigger "send-message" emitter
    this.onSendMessageEmitter(lastMessage);
  }

  ionViewWillEnter() {
    this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });

    // Here we get active conversation
    this.activeConversationSubscription = this.activeConversationService.getActiveConversation.subscribe(data =>
      {
        if (data && data?.messages ) {
            this.activeChat = data;
        }

    });

    // Here we get the partner information
    this.partnerInfoSubscription = this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo;
          if (!(this.partnerInfo.partner_id && this.userId))  return;

          const usersData: JoinRomData = {
              fromUserId: this.userId,
              toUserId: this.partnerInfo?.partner_id
            };
          this.socketIoService.userJoinChatRoom(usersData);
        }
    })

    // Socket ========
    this.socketIoService.getReadMessage.subscribe(message => {
      if (message) {
        this.messageService.updateMessageStatus(this.messagesList, message);
        this.activeConversationService.setActiveConversationMessages(this.messagesList);
      }
    })

    this.socketIoService.getUpdatedMessagesToReadAfterPartnerJoinedRoom.subscribe(messages => {
      // Update chat messages
      if (messages && messages.length > 0) {
        this.messageService.updateMessagesOnPartnerJoin(this.messagesList, messages)
      }
    })

    this.socketIoService.getDeliveredMessage.subscribe(deliveredMessage => {
      if (deliveredMessage) {
        this.messageService.updateMessageStatus(this.messagesList, deliveredMessage );
        this.activeConversationService.setActiveConversationMessages(this.messagesList);
      }
    })
  }

  ionViewWillLeave() {
    this.cleanUp();
  }

  private cleanUp() {
    if (this.comingMessageEvent) this.comingMessageEvent.unsubscribe();
    if (this.activeConversationSubscription) this.activeConversationSubscription.unsubscribe();
    if (this.activeConversationSubscription) this.activeConversationSubscription.unsubscribe();
    if (this.conversationRoomIdSubscription) this.conversationRoomIdSubscription.unsubscribe();
    if (this.userIdSubscription) this.userIdSubscription.unsubscribe();
    if (this.partnerInfoSubscription) this.partnerInfoSubscription.unsubscribe();
    if (this.activeRoomMessagesSubscription) this.activeRoomMessagesSubscription.unsubscribe();

    this.activeConversationService.setPartnerInfo(null);
    this.activeConversationService.setActiveConversation(null);
    this.activeConversationService.setActiveConversationMessages(null);

    // Socket
    this.socketIoService.setReadMessageSource(null);
    this.socketIoService.setUpdatedMessagesToReadAfterPartnerJoinedRoom(null);
    this.socketIoService.setDeliveredMessage(null);

  }
  ngOnDestroy() {
    this.cleanUp();
  }
}
