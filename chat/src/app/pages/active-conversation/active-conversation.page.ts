import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { SendMessageEmitterData, SocketIoService, JoinRomData } from "src/app/core/services/socket.io/socket.io.service";
import { Partner } from "src/app/interfaces/partner.interface";
import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { MessageService } from "src/app/features/active-conversation/services/message.service";
import { ChatService } from "src/app/features/active-conversation/services/chat.service";


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
  private conversationRoomId: string | null = null;
  private userIdSubscription!: Subscription;
  private partnerInfoSubscription!: Subscription;
  private activeRoomMessagesSubscription!: Subscription ;
  private updatedMessagesToReadWithPartnerJoinSubscription!: Subscription;
  private readMessageSubscription!:  Subscription;
  private deliveredMessageSubscription!: Subscription;
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToUserId();
  }

  ionViewWillEnter() {
    console.log('Will enrer ', this.partnerInfoSubscription )
    this.subscribeToActiveChatMessages();
    this.subscribeToConversationRoom();
    this.subscribeToConversation();
    if (!this.partnerInfoSubscription || this.partnerInfoSubscription.closed) {
      console.log("from inside 😍😍😍")
      this.subscribeToPartner();

    }
    this.subscribeToUserId();

    // Sockets
    this.subscribeDeliveredMessage();
    this.subscribeUpdatedMessagesToReadWithPartnerJoin();
    this.subscribeReadMessage();
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
       chatId: this.activeChat?.id,
       partnerConnectionStatus: this.partnerInfo.connection_status ?? 'offline'
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


  private subscribeToActiveChatMessages() {
    this.activeRoomMessagesSubscription = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
      if (messages )  this.messagesList = messages;
    })
  }
  private subscribeToConversationRoom() {
     // Getting roomId from socket.service
     this.conversationRoomIdSubscription = this.socketIoService.getConversationRoomId.subscribe(roomId => {
      this.conversationRoomId = roomId;
  })

  }
  private subscribeToConversation() {
     // Here we get active conversation
     this.activeConversationSubscription = this.activeConversationService.getActiveConversation.subscribe(data =>
      {
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
    console.log("😍😍😍😍😍😍😍 Par")
      // Here we get the partner information
      this.partnerInfoSubscription = this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {

        if (partnerInfo) {
          console.log(partnerInfo, "hello parnter ....", this.userId, !(this.partnerInfo?.partner_id && this.userId))
          this.partnerInfo = partnerInfo;
          if (!(this.partnerInfo.partner_id && this.userId))  return;

          console.log(this.activeChat, 'Hello chat')
          if (this.activeChat)  {

          }
          const usersData: JoinRomData = {
              fromUserId: this.userId,
              toUserId: this.partnerInfo?.partner_id,
              chatId: this.activeChat && this.activeChat.id
            };

          this.socketIoService.userJoinChatRoom(usersData);
        }
    })
  }

  private subscribeDeliveredMessage () {
    this.deliveredMessageSubscription = this.socketIoService.getDeliveredMessage.subscribe(deliveredMessage => {
      if (deliveredMessage) {
        this.messageService.updateMessageStatus(this.messagesList, deliveredMessage );
        this.activeConversationService.setActiveConversationMessages(this.messagesList);
      }
    })
  }

  private subscribeUpdatedMessagesToReadWithPartnerJoin() {
    this.updatedMessagesToReadWithPartnerJoinSubscription =  this.socketIoService.getUpdatedMessagesToReadAfterPartnerJoinedRoom.subscribe(messages => {
      // Update chat messages
      if (messages && messages.length > 0) {
        this.messageService.updateMessagesOnPartnerJoin(this.messagesList, messages)
      }
    })
  }


  private subscribeReadMessage() {
    this.readMessageSubscription = this.socketIoService.getReadMessage.subscribe(message => {
      if (message) {
        this.messageService.updateMessageStatus(this.messagesList, message);
        this.activeConversationService.setActiveConversationMessages(this.messagesList);
      }
    })
  }

  ionViewWillLeave() {
    console.log("Leaveing......")
    this.cleanUp();
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
    this.activeConversationService.setActiveConversationMessages(null);

    // Socket
    if (this.updatedMessagesToReadWithPartnerJoinSubscription) this.updatedMessagesToReadWithPartnerJoinSubscription.unsubscribe();
    if (this.readMessageSubscription) this.readMessageSubscription.unsubscribe();
    if (this.deliveredMessageSubscription) this.deliveredMessageSubscription.unsubscribe();

    this.socketIoService.setReadMessageSource(null);
    this.socketIoService.setUpdatedMessagesToReadAfterPartnerJoinedRoom(null);
    this.socketIoService.setDeliveredMessage(null);

  }

  ngOnDestroy() {
    this.cleanUp();
  }
}
