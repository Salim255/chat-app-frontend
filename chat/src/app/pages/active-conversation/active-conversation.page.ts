import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.page.html',
  styleUrls: ['./active-conversation.page.scss'],
})
export class ActiveConversationPage implements OnInit {
  activeChat: any;
  message= '';
  partnerId: any = null;
  userId: any;
  partnerData: any;
  constructor(private conversationService: ConversationService, private route: ActivatedRoute, private authService: AuthService ) {

    this.authService.userId.subscribe( data =>{
      this.userId = data
    });

    this.route.queryParams.subscribe(params => {
      this.partnerId = params['partner'] * 1;
    });

   }

  ngOnInit() {
    console.log('Hello');

   }

  ionViewWillEnter() {
      this.conversationService.getActiveConversation.subscribe(data => {
        if (data) {
          this.partnerData = this.getPartnerInfo(data.users);

        }
      })
   }

  onSubmit(f: NgForm) {
    if (!f.valid || this.message.trim().length === 0) {
      return
    }

    if (!this.activeChat) {
      this.createConversation(this.message)
      f.reset()
      return;
    }

    this.sendMessage(this.message);
    f.reset()
  }

  createConversation(message: string) {
    let createChatObs: Observable<any> ;
    let chatData = { partnerId: this.partnerId, message}
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
          this.activeChat = response.data[0]
          console.log( this.activeChat);

      }
    })

  }

  getPartnerInfo(users: any){
    console.log('====================================');
    console.log(users);
    console.log('====================================');
    let partner =   users.filter((user: any) => user.user_id !== this.userId);;
    return partner[0]
  }
}
