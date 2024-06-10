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
    this.typingSubscription = this.socketIoService.comingTypingEvent.subscribe((data) => {
      if (data) {
        this.typingState = true
      } else {
        this.typingState = false
      }
    })

    this.conversationService.getActiveConversation.subscribe( data=>{
      this.activeChat = data;
        const conversationId = data?.id;
        if (data?.id) {
          this.joinConversation(data)
            }
        });

     this.conversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
     })
   }

   onTextChange(text: any) {
    if (text.length !== 0) {
      console.log(text.length);

      this.socketIoService.userIsTyping()
    }
   }
  onSubmit (f: NgForm) {
    if (!f.valid || this.message.trim().length === 0) {
      return
    }



    if (!this.activeChat) {
      this.createConversation(this.message)
      f.reset()
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
      }
    })
  }

  onBackArrow () {
    console.log("Hello world");

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
  }
}
