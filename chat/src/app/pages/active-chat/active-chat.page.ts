import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { ConversationService } from "src/app/services/conversation/conversation.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";

@Component({
  selector: 'app-active-chat',
  templateUrl: './active-chat.page.html',
  styleUrls: ['./active-chat.page.scss']
})

export class ActiveChatPage {

  private typingSubscription!: Subscription;
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private deliveredEventSubscription!: Subscription;

  userId: any;
  partnerInfo: any;
  activeChat: any;
  messagesList: any;
  typingState: boolean = false;


  constructor(private conversationService: ConversationService, private router: Router, private authService: AuthService, private socketIoService: SocketIoService){}


  ionViewWillEnter () {

    // Here we get active conversation
    this.activeConversationSubscription = this.conversationService.getActiveConversation.subscribe( data =>{
      console.log('====================================');
      console.log("Hello from active chat🐱", data);
      console.log('====================================');
      this.activeChat = data;
      this.messagesList = this.activeChat?.messages;
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
          //this.readMessageEmitter(chatId, fromUserId, toUserId)
        }
      }
     })

     if ( this.partnerInfo && this.activeChat) {
      let toUserId = this.partnerInfo.partner_id;
      let chatId = this.activeChat.id;

      // Read messages emitter
      //this.readMessageEmitter(chatId, this.userId, toUserId)

     }


   }
}
