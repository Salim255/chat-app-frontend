import { Component, OnDestroy, OnInit } from '@angular/core';
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
  activeChat: any;
  message= '';
  userId: any;
  partnerInfo: any;
  typingState: boolean = false;
  private typingSubscription!: Subscription;

  constructor (private conversationService: ConversationService, private router: Router, private authService: AuthService, private socketIoService: SocketIoService ) {
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
   }

  ionViewWillEnter () {
    this.typingState = false;
    // Here we listen to partner typing event
    this.typingSubscription = this.socketIoService.comingTypingEvent.subscribe((data) => {
      if (data) {
        // If data = true, then we set typing to true
        this.typingState = true
      } else {
        // If data = false, then we set typing to false
        this.typingState = false
      }
    })


    // Here we get active conversation
    this.conversationService.getActiveConversation.subscribe( data=>{
      this.activeChat = data;
        const conversationId = data?.id;
        if (data?.id) {
          this.joinConversation(data)
            }
        });

    // Here we get the partner id
     this.conversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
     })
   }

   // Here we listen to user typing event
   onTextChange(text: any) {
    if (!text || text.length === 0) {
      this.socketIoService.userStopTyping();
      return;
    } else {
      // If text not "", user is typing
      this.socketIoService.userIsTyping()
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
          this.socketIoService.sentMessageEmitter(this.userId)
        })
      }
    })
  }

  sendMessage(message: string){
    if (!this.userId) {
      return
    };
    const data = {  content: this.message, userId: this.userId, chatId: this.activeChat.id};

    let sendMessageObs: Observable<any> ;

    sendMessageObs = this.conversationService.sendMessage(data);

    sendMessageObs.subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (response) => {
          this.activeChat = response.data[0];
          // Sending this partnerId to be used in fetching  active chat
          this.socketIoService.sentMessageEmitter(this.userId)
      }
    })
  }

  onBackArrow () {
     this.router.navigate(['./tabs/conversations']);
  }

  onProfile () {
      this.router.navigate(['./tabs/profile'])
  }

  joinConversation (activeConversation: any) {
    this.socketIoService.joinConversation(activeConversation)
  }

  ngOnDestroy() {
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }

  /*   if (this.comingMessageSubscription) {
      this.comingMessageSubscription.unsubscribe()
    } */
  }
}
