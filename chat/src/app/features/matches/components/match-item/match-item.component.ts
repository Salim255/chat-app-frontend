import { Component,  Input, OnChanges, SimpleChanges} from '@angular/core';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { MatchesService } from '../../services/matches.service';

@Component({
    selector: 'app-match-item',
    templateUrl: './match-item.component.html',
    styleUrls: ['./match-item.component.scss'],
    standalone: false
})
export class MatchItemComponent implements OnChanges {
  @Input() partnerInfo: Partner | null = null ;

  constructor (
    private  matchesService:  MatchesService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.partnerInfo) {
      this.partnerInfo.avatar = StringUtils.getAvatarUrl(this.partnerInfo.avatar)
    }
  }

  onOpenConversation () {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;

    this.matchesService.onOpenChat(this.partnerInfo)
  }
}
