import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Match } from '../../models/match.model';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
  standalone: false,
})
export class MatchItemComponent implements OnInit, OnChanges {
  @Input() partnerInfo!: Match;

  constructor(private activeConversationService: ActiveConversationService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello');
  }
  ngOnChanges(): void {
    console.log(this.partnerInfo, 'hello');
    if (this.partnerInfo) {
      this.partnerInfo.avatar = StringUtils.getAvatarUrl(this.partnerInfo.avatar);
    }
  }

  onOpenConversation(): void {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;
    const partner = this.setActiveConversationsData(this.partnerInfo);
    this.activeConversationService.openConversation(partner, null);
  }

  setActiveConversationsData(match: Match): Partner {
    return {
      partner_id: match.partner_id,
      first_name: match.first_name,
      last_name: match.last_name,
      avatar: match.avatar ?? '',
      connection_status: match.connection_status,
      public_key: match.public_key,
      updated_at: match.match_updated_at,
      created_at: match.match_created_at,
      images: [],
    }
  }
}
