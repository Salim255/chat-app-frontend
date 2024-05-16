import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.page.html',
  styleUrls: ['./active-conversation.page.scss'],
})
export class ActiveConversationPage {
  activeChat: any;
  message= '';
  userId: any;
  partnerInfo: any;

  constructor (private conversationService: ConversationService, private router: Router, private authService: AuthService ) {
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
   }

  ionViewWillEnter () {
      this.conversationService.getActiveConversation.subscribe( data => {
        if (data) {
          this.conversationService.getActiveConversation.subscribe( data=>{
            this.activeChat = data;
          });
        }
      });

     this.conversationService.getPartnerInfo.subscribe( partnerInfo => {
        if (partnerInfo) {
          this.partnerInfo = partnerInfo
        }
     })
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
     this.router.navigate(['./tabs/conversations']);
  }

  onProfile () {
      this.router.navigate(['./tabs/profile'])
  }
}
