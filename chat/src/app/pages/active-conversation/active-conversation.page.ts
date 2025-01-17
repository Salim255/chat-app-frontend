import { Component, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { createChatInfo } from "src/app/interfaces/chat.interface";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ConversationService } from "src/app/features/conversations/services/conversations.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";

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

  private userId: any;
  private partnerInfo: any;
  private activeChat: any;
  private messagesList: any;
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
    this.activeConversationSubscription = this.activeConversationService.getActiveConversation.subscribe( data =>
      {
        this.activeChat = data;
        this.messagesList = this.activeChat?.messages;
        this.activeConversationService.setActiveConversationMessages(this.messagesList);
      });

    // Here we get the partner information
     this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {
       this.partnerInfo = partnerInfo
     })

     // listen to receiver message delivered event, in case receiver is in current conversation
     this.deliveredEventSubscription = this.socketIoService.getMessageDeliveredToReceiver.subscribe((data:any) => {
      if (data) {
        const {chatId, toUserId, fromUserId} = data
        if (chatId && toUserId && fromUserId) {
          this.readMessageEmitter(chatId, fromUserId, toUserId)
        }
      }
     })

     if ( this.partnerInfo && this.activeChat) {
      let toUserId = this.partnerInfo.partner_id;
      let chatId = this.activeChat.id;

      // Read messages emitter
      this.readMessageEmitter(chatId, this.userId, toUserId)
     }
   }

  createNewChatObs(message: string) {

    if (!this.partnerInfo?.partner_id) {
      return
    };

    let createChatObs: Observable<any> ;

    const chatData: createChatInfo = { content: message, toUserId: this.partnerInfo.partner_id, fromUserId: this.userId };

    createChatObs = this.conversationService.createConversation(chatData);

    createChatObs.subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        if (res?.data) {
          this.activeChat = res.data;

          let lastMessage = this.getLastMessage(this.activeChat);

          this.pushMessageToMessagesList(lastMessage);

          this.conversationService.setActiveConversation(res.data);

           // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.id, message)
        }
      }
    })
  }

  sendMessageObs(message: any) {
    let sendMessageObs: Observable<any> ;
    const data = {  content: message, fromUserId: this.userId, toUserId: this.partnerInfo.id,  chatId: this.activeChat.id};
    sendMessageObs = this.conversationService.sendMessage(data);

    sendMessageObs.subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (response) => {
          this.activeChat = response.data[0];
          let lastMessage = this.getLastMessage(this.activeChat)
          console.log(this.activeChat);
          this.pushMessageToMessagesList(lastMessage)
          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.partner_id, data.content)
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

 getLastMessage(activeChat: any) {
   if (activeChat?.messages) {
     const lastMessageIndex = activeChat.messages.length - 1 ;
     return activeChat.messages[lastMessageIndex]
   }
   return  null
 }

 readMessageEmitter(chatId: number, fromUserId: number,toUserId: number) {
    this.socketIoService.readMessage(chatId, fromUserId, toUserId)
  }


 onSubmit(message: string) {
     if (!this.activeChat) {
        this.createNewChatObs(message)
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
    console.log('destroying active conversation')
    this.activeConversationService.setActiveConversation(null);
    this.activeConversationService.setPartnerInfo(null);
    // Destroy the active conversation source
    //this.conversationService.destroyActiveConversation();
  }
}
