import { Component, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { CreateChatInfo } from "src/app/interfaces/chat.interface";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ConversationService } from "src/app/features/conversations/services/conversations.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";
import { Partner } from "src/app/interfaces/partner.interface";
import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";


export type CreateMessageData = {
  chatId: number;
  fromUserId: number;
  toUserId: number;
  content: string
}

export type ReadDeliveredMassage = Omit<CreateMessageData, 'content'>

@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.page.html',
  styleUrls: ['./active-conversation.page.scss']
})

export class ActiveConversationPage implements OnDestroy {

  private typingSubscription!: Subscription;
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private deliveredEventSubscription!: Subscription;

  private userId: number | null = null;
  private partnerInfo: Partner | null = null;
  private activeChat: Conversation | null = null;
  private messagesList: Message [] = [] ;
  typingState: boolean = false;


  constructor(private conversationService: ConversationService,
     private authService: AuthService, private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService){
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  ionViewWillEnter () {
    // Here we get active conversation
    this.activeConversationSubscription = this.activeConversationService.getActiveConversation.subscribe(data =>
      {
        if (data && data?.messages) {
          this.activeChat = data;
          if (!this.activeChat?.messages) return;
          this.messagesList = this.activeChat?.messages;
          this.activeConversationService.setActiveConversationMessages(this.messagesList);
        }
      });

    // Here we get the partner information
     this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
     })

     // listen to receiver message delivered event, in case receiver is in current conversation
     this.deliveredEventSubscription = this.socketIoService.getMessageDeliveredToReceiver.subscribe(data => {
      if (data) {
        const {chatId, toUserId, fromUserId} = data
        if (chatId && toUserId && fromUserId) {
          const readDeliveredMassageData: ReadDeliveredMassage = {
            chatId,
            fromUserId,
            toUserId
          };
          this.readDeliveredMessageEmitter(readDeliveredMassageData)
        }
      }
     })

     if ( this.partnerInfo?.partner_id && this.activeChat) {
      let toUserId = this.partnerInfo.partner_id;
      let chatId = this.activeChat.id;
      // Read messages emitter
      if (this.userId && chatId) {
        const readDeliveredMassageData: ReadDeliveredMassage = {
          chatId,
          fromUserId: this.userId,
          toUserId
        };
        this.readDeliveredMessageEmitter(readDeliveredMassageData)
      }

     }
   }

  createNewChatObs(data: CreateChatInfo) {

    if (!this.partnerInfo?.partner_id) {
      // Treat error
      return
    };

    let createChatObs: Observable<any> ;

    createChatObs = this.activeConversationService.createConversation(data);

    createChatObs.subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        this.activeChat = res.data;
        if (this.activeChat ) {
          let lastMessage = this.getLastMessage(this.activeChat);
          this.pushMessageToMessagesList(lastMessage);

          // this.conversationService.setActiveConversation(res.data);
          this.activeConversationService.setActiveConversation(res.data)
           // Sending this partnerId to be used in fetching active chat
          if (this.userId && this.partnerInfo?.partner_id && this.activeChat.id) {
            const createMessageData: CreateMessageData = {
              chatId: this.activeChat.id,
              fromUserId: this.userId,
              toUserId: this.partnerInfo?.partner_id,
              content: data.content
            };

            this.socketIoService.sendMessage(createMessageData)
          }
        }
      }
    })
  }

  sendMessageObs(message: string) {
    let sendMessageObs: Observable<any> ;
    if (!this.partnerInfo?.partner_id || !this.userId || !this.activeChat?.id ) {
      return
    }

    const data: CreateMessageData = { content: message, fromUserId: this.userId, toUserId: this.partnerInfo.partner_id,  chatId: this.activeChat?.id};
    sendMessageObs = this.activeConversationService.sendMessage(data);

    sendMessageObs.subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (response) => {
          this.activeChat = response.data[0];
          if (!this.activeChat) return;

          let lastMessage = this.getLastMessage(this.activeChat)
          this.pushMessageToMessagesList(lastMessage)
          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(data)
      }
    })
  }

  pushMessageToMessagesList(message: Message){
    if (!this.messagesList) {
      this.messagesList = [ message ];
    } else {
      this.messagesList.push(message)
    }
 }

 getLastMessage(activeChat: Conversation) {
   if (activeChat?.messages) {
     const lastMessageIndex = activeChat.messages.length - 1 ;
     return activeChat.messages[lastMessageIndex]
   }
   return  null
 }

 readDeliveredMessageEmitter(data: ReadDeliveredMassage) {
    this.socketIoService.readMessage(data)
  }


 onSubmit(message: string) {
     if (!this.activeChat && this.userId && this.partnerInfo?.partner_id) {
        const createChatData: CreateChatInfo = { content: message, toUserId: this.partnerInfo.partner_id, fromUserId: this.userId };
        this.createNewChatObs(createChatData);
     } else {
      this.sendMessageObs(message)
     }
  }

 ngOnDestroy() {
    this.partnerInfo =  null ;

    if (this.comingMessageEvent) {
        this.comingMessageEvent.unsubscribe()
    }

    if (this.activeConversationSubscription) {
      this.activeConversationSubscription.unsubscribe()
    }

    if (this.deliveredEventSubscription) {
      this.deliveredEventSubscription.unsubscribe()
    }
    this.activeConversationService.setActiveConversation(null);
    this.activeConversationService.setPartnerInfo(null);
  }
}
