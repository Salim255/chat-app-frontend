import { Component,  Input} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Partner } from 'src/app/interfaces/partner.interface';
import { Match } from 'src/app/models/friend.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { TapService } from 'src/app/services/tap/tap.service';
import { Foreigner } from 'src/app/models/foreigner.model';
@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
})
export class MatchItemComponent {
 @Input() match!: any;
 partnerInfo: Partner;
 private userId: any;

  constructor (private router: Router, private conversationService: ConversationService,
     private authService: AuthService) {
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
    if (!this.match?.friend_id) return;

    this.preparePartnerInfo(this.match);

    let fetchChatObs: Observable<any>;

    fetchChatObs = this.conversationService.fetchChatByUsers(this.match?.friend_id);

    fetchChatObs.subscribe({
      error: () => {
        console.error()
      },
      next: (chat) => {
          console.log(chat.data, 'Hello chat🐈');

          this.conversationService.setPartnerInfo(this.partnerInfo);
          this.router.navigate(['./tabs/active-conversation'], { queryParams: { partner: this.match?.friend_id } });
      }
    })
  }



  preparePartnerInfo (data: Match) {
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
