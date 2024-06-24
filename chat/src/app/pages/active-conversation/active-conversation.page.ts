import { Component, OnDestroy, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { SocketIoService } from 'src/app/services/socket.io/socket.io.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.page.html',
  styleUrls: ['./active-conversation.page.scss'],
})
export class ActiveConversationPage implements OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  activeChat: any;
  message= '';
  userId: any;
  partnerInfo: any;
  typingState: boolean = false;

  private typingSubscription!: Subscription;
  private comingMessageEvent!: Subscription;
  private activeConversationSubscription!: Subscription;
  private deliveredEventSubscription!: Subscription;

  constructor (private conversationService: ConversationService, private router: Router, private authService: AuthService, private socketIoService: SocketIoService ) {
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
   }

   // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
   ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ionViewWillEnter () {
    this.typingState = false;

    // Here we listen to partner typing event
    this.typingSubscription = this.socketIoService.getComingTypingEvent.subscribe((status) => {
        if (status) {
          // If data = true, then we set typing to true
          this.typingState = status
        } else {
          // If data = false, then we set typing to false
          this.typingState = status
        }
      })


    // Here we get active conversation
    this.activeConversationSubscription = this.conversationService.getActiveConversation.subscribe( data =>{
      this.activeChat = data;
        });

    // Here we get the partner id
     this.conversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
     })

     // listen to receiver message delivered event, in case receiver is in current conversation
     this.deliveredEventSubscription = this.socketIoService.getMessageDeliveredToReceiver.subscribe((data:any) => {


      console.log(data, "Hello data 🚨🚨🚨");

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

   // Here we listen to user typing event
   onTextChange(text: any) {
    if (!text || text.length === 0) {
      this.socketIoService.onTyping(this.partnerInfo.partner_id, false);
    } else if (text.length === 1) {
      // If text not "", user is typing
      this.socketIoService.onTyping(this.partnerInfo.partner_id, true);
    }
   }

  onSubmit (f: NgForm) {
    if (!f.valid || this.message.trim().length === 0) {
      return
    }

    if (!this.activeChat) {
      this.createConversation(this.message)
      f.reset();
      return;
    }

    this.sendMessage(this.message);
    f.reset();
  }

  createConversation(message: string) {
    let createChatObs: Observable<any> ;
    if (!this.partnerInfo.partner_id) {
      return
    };

    let chatData = { partnerId: this.partnerInfo.partner_id, message}
    createChatObs = this.conversationService.createConversation(chatData);

    createChatObs.subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        this.conversationService.getActiveConversation.subscribe(data=>{
          this.activeChat = data;
          // Sending this partnerId to be used in fetching  active chat

          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.id, this.message)

          // Update
        })
      }
    })
  }

  sendMessage(message: string){
    if (!this.userId) {
      return
    };
    const data = {  content: this.message, fromUserId: this.userId, toUserId: this.partnerInfo.partner_id,  chatId: this.activeChat.id};

    let sendMessageObs: Observable<any> ;

    sendMessageObs = this.conversationService.sendMessage(data);

    sendMessageObs.subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (response) => {

          this.activeChat = response.data[0];
          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sendMessage(this.activeChat.id, this.userId, this.partnerInfo.partner_id, message)
      }
    })
  }

  onBackArrow () {
     this.router.navigate(['./tabs/conversations']);
  }

  onProfile () {
      this.router.navigate(['./tabs/profile'])
  }

  //
  readMessageEmitter (chatId: number,  toUserId: number, fromUserId: number,) {
    this.socketIoService.readMessage(chatId, fromUserId, toUserId)
  }

  returnMessageStatus(messageStatus: string) {
    switch(messageStatus) {
      case 'read':
        return 'checkmark-done-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      default:
        return 'checkmark-outline'
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(300); // Scrolls to bottom with a duration of 300ms
  }

  ngOnDestroy() {
    this.partnerInfo =  null ;

    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }

    if (this.comingMessageEvent) {
        this.comingMessageEvent.unsubscribe()
    }

    if (this.activeConversationSubscription) {
      this.activeConversationSubscription.unsubscribe()
    }
  }


}
