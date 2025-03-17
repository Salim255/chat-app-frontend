import { Component,  Input, OnChanges, SimpleChanges} from '@angular/core';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { MatchesService } from '../../services/matches.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
@Component({
    selector: 'app-match-item',
    templateUrl: './match-item.component.html',
    styleUrls: ['./match-item.component.scss'],
    standalone: false
})
export class MatchItemComponent implements OnChanges {
  @Input() partnerInfo: Partner | null = null ;

  constructor (
    private activeConversationService: ActiveConversationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.partnerInfo) {
      this.partnerInfo.avatar = StringUtils.getAvatarUrl(this.partnerInfo.avatar)
    }
  }

  onOpenConversation () {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;
    this.activeConversationService.onOpenChat(this.partnerInfo)
  }
}
