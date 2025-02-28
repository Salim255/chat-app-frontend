import { Component,  Input, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { Partner } from 'src/app/interfaces/partner.interface';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';

@Component({
    selector: 'app-match-item',
    templateUrl: './match-item.component.html',
    styleUrls: ['./match-item.component.scss'],
    standalone: false
})
export class MatchItemComponent implements OnChanges {
  @Input() partnerInfo: Partner | null = null ;

  constructor (private router: Router,private activeConversationService: ActiveConversationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.partnerInfo?.avatar)
    if (this.partnerInfo) {
      this.partnerInfo.avatar = StringUtils.getAvatarUrl(this.partnerInfo.avatar)
    }
  }

  onOpenChat () {
    console.log("Open chat with partner:", this.partnerInfo);
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;

    this.activeConversationService.setPartnerInfo(this.partnerInfo);
    // Check if there are a chat with the this partner
    this.activeConversationService.fetchChatByPartnerID(this.partnerInfo.partner_id)
    .subscribe({
      next: () => {
        this.router.navigate([`./tabs/active-conversation/${this.partnerInfo?.partner_id}`],
          { queryParams: { partner: this.partnerInfo?.partner_id }, replaceUrl: true });
      },
      error: () => {
        console.error()
        this.activeConversationService.setActiveConversation(null);
      }
    })

  }
}
