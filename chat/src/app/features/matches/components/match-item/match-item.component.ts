import { Component,  Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Partner } from 'src/app/interfaces/partner.interface';

import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
})
export class MatchItemComponent implements OnInit {
  @Input() partnerInfo!: Partner ;

  defaultImage = 'assets/images/default-profile.jpg';

  constructor (private router: Router,private activeConversationService: ActiveConversationService) {}

  ngOnInit(): void {
    if (this.partnerInfo?.avatar) {
      const partnerAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.partnerInfo?.avatar}`;
      this.defaultImage = partnerAvatar;
    }
  }

  onOpenChat () {
    if (!this.partnerInfo?.partner_id) return;

    // Check if there are a chat with the this partner
     this.activeConversationService.fetchChatByPartnerID(this.partnerInfo?.partner_id)
    .subscribe({
      next: () => {
        this.activeConversationService.setPartnerInfo(this.partnerInfo);
        this.router.navigate([`./tabs/active-conversation/${this.partnerInfo?.partner_id}`],
          { queryParams: { partner: this.partnerInfo?.partner_id } });
      },
      error: () => {
        console.error()
      }
    })
  }
}
