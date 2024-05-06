import { Component,  Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Partner } from 'src/app/interfaces/partner.interface';
import { Friend } from 'src/app/models/friend.model';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-card-friend',
  templateUrl: './card-friend.component.html',
  styleUrls: ['./card-friend.component.scss'],
})
export class CardFriendComponent {
 @Input() friend!: any;
 partnerInfo: Partner;
 private userId: any;

  constructor (private router: Router, private conversationService: ConversationService, private authService: AuthService) {
    this.partnerInfo = {
      partner_id: null ,
      avatar: null,
      first_name: null,
      last_name: null
    },
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  openChat () {
    if (!this.friend?.friend_id) return;

    this.preparePartnerInfo(this.friend);

    let fetchChatObs: Observable<any>;

    fetchChatObs = this.conversationService.fetchChatByUsers(this.friend?.friend_id);

    fetchChatObs.subscribe({
      error: () => {
        console.error()
      },
      next: () => {
          this.conversationService.setPartnerInfo(this.partnerInfo);

          this.router.navigate(['/active-conversation'], { queryParams: { partner: this.friend?.friend_id } });
      }
    })
  }

  preparePartnerInfo (data: Friend) {
    if (this.userId === data.user_id) {
      this.partnerInfo.partner_id = data.friend_id;
    } else {
      this.partnerInfo.partner_id = data.user_id;
    };
    this.partnerInfo.avatar = data.avatar;
    this.partnerInfo.last_name = data.last_name;
    this.partnerInfo.first_name = data.last_name;
  }
}
