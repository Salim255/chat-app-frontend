import { Component,  Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Partner } from 'src/app/interfaces/partner.interface';

import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
})
export class MatchItemComponent implements OnInit {
  @Input() match: Partner | null = null;
  partnerInfo: Partner;
  defaultImage = 'assets/images/default-profile.jpg';

  constructor (private router: Router,private activeConversationService: ActiveConversationService) {
    this.partnerInfo = {
      partner_id: null ,
      avatar: null,
      first_name: null,
      last_name: null
    }
  }

  ngOnInit(): void {
    if (this.match) {
      this.setItemImage();
      this.preparePartnerInfo(this.match);
    }
  }

  openChat () {

    if (!this.match?.partner_id) return;

    let fetchChatObs: Observable<any>;

    // Here weather there are a chat with the current partner
    fetchChatObs = this.activeConversationService.fetchChatByPartnerID(this.match?.partner_id);

    fetchChatObs.subscribe({
      error: () => {
        console.error()
      },
      next: (chat) => {
        this.activeConversationService.setPartnerInfo(this.partnerInfo);
        this.router.navigate(['./tabs/active-conversation'], { queryParams: { partner: this.match?.partner_id } });
      }
    })
  }

  preparePartnerInfo (data: Partner) {
    this.partnerInfo.partner_id = data.partner_id;
    this.partnerInfo.avatar = data.avatar;
    this.partnerInfo.last_name = data.last_name;
    this.partnerInfo.first_name = data.last_name;
  }

  setItemImage () {
    if (this.match?.avatar) {
      const accountAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.match?.avatar}`;
      this.defaultImage = accountAvatar
    }
  }
}
