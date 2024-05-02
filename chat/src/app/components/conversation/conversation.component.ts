import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Conversation } from 'src/app/models/activeConversation.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent  implements OnInit, OnChanges {
  @Input() conversation!: Conversation;
  lastMessage: any ;
  private userId: any;

  constructor(private authService: AuthService, private conversationService: ConversationService, private router: Router) {
    this.authService.userId.subscribe( data =>{
      this.userId = data
    });
   }

  ngOnInit() {
   console.log();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.conversation.messages){
      let messagesSize = this.conversation.messages.length;
     this.setLastMessage(this.conversation.messages[messagesSize - 1].content);
      this.getPartnerInfo(this.conversation.users);
    }
  }

  openChat() {
      this.conversationService.onConversation(this.conversation)

      this.conversationService.getActiveConversation.subscribe((conversation) => {
        if (conversation){
         let partner = this.getPartnerInfo(conversation.users);
         if (partner[0]) {
               this.router.navigate(['/active-conversation'], { queryParams: { partner: partner[0].user_id } });
         }

        }
      })
  }

  setLastMessage(message: string){
    this.lastMessage = message
  }

  getPartnerInfo(users: any){
    let partner =   users.filter((user: any) => user.user_id !== this.userId);;
    return partner
  }
}
