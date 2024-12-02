import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Conversation } from 'src/app/models/activeConversation.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';

import { Router } from '@angular/router';
import { Partner } from 'src/app/interfaces/partner.interface';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationComponent  implements OnChanges {
  @Input() conversation!: Conversation;
  lastMessage: any ;
  partnerInfo: Partner;
  private userId: any;

  constructor (private authService: AuthService, private conversationService: ConversationService, private router: Router ) {
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

  ngOnChanges (changes: SimpleChanges): void {
    if(this.conversation.messages){
     let messagesSize = this.conversation.messages.length;
     this.setLastMessage(this.conversation.messages[messagesSize - 1].content);
      this.getPartnerInfo(this.conversation.users);
    }
  }

  openChat () {
    console.log(this.conversation, "🥰🥰");
    if (this.conversation && this.partnerInfo.partner_id) {



      this.conversationService.setActiveConversation(this.conversation);
      this.conversationService.getActiveConversation.subscribe((conversation) => {
        if (conversation ) {
              this.conversationService.setPartnerInfo(this.partnerInfo);
              this.router.navigate(['tabs/active-conversation'], { queryParams: { partner: this.partnerInfo.partner_id }, replaceUrl: true });
        }
      })
    }
  }

  setLastMessage (message: string) {
    this.lastMessage = message
  }

  getPartnerInfo (users: any) {
    let partner =   users.filter((user: any) => user.user_id !== this.userId);
    if (!partner) {
      return;
    }
    this.partnerInfo.partner_id = partner[0]?.user_id;
    this.partnerInfo.avatar = partner[0]?.avatar;
    this.partnerInfo.last_name = partner[0]?.last_name;
    this.partnerInfo.first_name = partner[0]?.last_name;
  }

}
