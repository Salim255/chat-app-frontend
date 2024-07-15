import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Message } from "src/app/interfaces/message.interface";
import { AuthService } from "src/app/services/auth/auth.service";
import { ConversationService } from "src/app/services/conversation/conversation.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";

@Component({
  selector: 'app-active-chat',
  templateUrl: './active-chat.page.html',
  styleUrls: ['./active-chat.page.scss']
})

export class ActiveChatPage implements OnDestroy {

  private typingSubscription!: Subscription;
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private deliveredEventSubscription!: Subscription;

  userId: any;
  partnerInfo: any;
  activeChat: any;
  messagesList: any;
  typingState: boolean = false;


  constructor(private conversationService: ConversationService, private router: Router, private authService: AuthService, private socketIoService: SocketIoService){
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }


  ionViewWillEnter () {

    // Here we get active conversation
    this.activeConversationSubscription = this.conversationService.getActiveConversation.subscribe( data =>{
      this.activeChat = data;
      this.messagesList = this.activeChat?.messages;
      //console.log(this.partnerInfo && this.activeChat, this.partnerInfo, this.activeChat, 'Test to read');
      this.conversationService.setActiveConversationMessages(this.messagesList)
        });

    // Here we get the partner id
     this.conversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
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

   createNewChatObs(newChatData: any) {
    let createChatObs: Observable<any> ;
    if (!this.partnerInfo.partner_id) {
      return
    };

    let chatData = { partnerId: this.partnerInfo.partner_id, message: newChatData.message}
    createChatObs = this.conversationService.createConversation(chatData);

    createChatObs.subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        this.conversationService.getActiveConversation.subscribe(data=>{


          this.activeChat = data;

          let lastMessage = this.getLastMessage(this.activeChat);

          this.pushMessageToMessagesList(lastMessage);


          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.id, newChatData.message)

          // Update
        })
      }
    })
  }

   submitMessageObs(data: any) {
    let sendMessageObs: Observable<any> ;

    sendMessageObs = this.conversationService.sendMessage(data);

    sendMessageObs.subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (response) => {

          this.activeChat = response.data[0];

          let lastMessage = this.getLastMessage(this.activeChat)

          this.pushMessageToMessagesList(lastMessage)
          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.partner_id, data.content)
      }
    })
  }

  pushMessageToMessagesList(message: Message){
    this.messagesList.push(message)
 }

 getLastMessage(activeChat: any) {
   if (activeChat?.messages) {
     const lastMessageIndex = activeChat.messages.length - 1 ;
     return activeChat.messages[lastMessageIndex]
   }
   return  null
 }

 readMessageEmitter (chatId: number, fromUserId: number,toUserId: number) {
    this.socketIoService.readMessage(chatId, fromUserId, toUserId)
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
}
}
