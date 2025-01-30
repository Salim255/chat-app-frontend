import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';;
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

import { Router } from '@angular/router';
import { Partner } from 'src/app/interfaces/partner.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { User } from 'src/app/features/active-conversation/models/active-conversation.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent implements OnInit {
  @Input() conversation: Conversation = new Conversation( null, null, null, null, null);
  lastMessage: string | null = null;
  partnerInfo: Partner ;
  private userId: number | null = null;
  partnerImage: string = 'assets/images/default-profile.jpg';

  constructor (private authService: AuthService,
     private router: Router, private activeConversationService: ActiveConversationService) {
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });

    this.partnerInfo = {
      partner_id: null ,
      avatar: null,
      first_name: null,
      last_name: null
    }
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.conversation && this.conversation?.messages){
      let messagesSize = this.conversation?.messages.length;
      const lastMessage = this.conversation?.messages[messagesSize - 1].content;
      this.setLastMessage(lastMessage );

      if (this.conversation?.users) {
        this.setPartnerInfo(this.conversation.users);
      }

      if (this.partnerInfo?.avatar && this.partnerInfo?.avatar.length > 0) {
        const partnerAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.partnerInfo?.avatar}`;
        this.partnerImage = partnerAvatar;
      }
    }
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat (): void {
    if (this.conversation && this.partnerInfo?.partner_id) {
      this.activeConversationService.setActiveConversation(this.conversation);
      this.activeConversationService.getActiveConversation.subscribe((conversation) => {
        if (conversation) {
          if (this.partnerInfo.partner_id) {
            this.activeConversationService.setPartnerInfo(this.partnerInfo);
            this.router.navigate(['tabs/active-conversation'], { queryParams: { partner: this.partnerInfo.partner_id }, replaceUrl: true });
          }
        }
      })
    }
  }

  // Here we are setting the last message
  setLastMessage (message: string): void {
    this.lastMessage = message;
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo (users: User[]): void {
    let partner =   users.filter((user: User) => user.user_id !== this.userId);
    if (!partner) {
      return;
    }
    this.partnerInfo.partner_id = partner[0]?.user_id;
    this.partnerInfo.avatar = partner[0]?.avatar;
    this.partnerInfo.last_name = partner[0]?.last_name;
    this.partnerInfo.first_name = partner[0]?.last_name;
  }

}
