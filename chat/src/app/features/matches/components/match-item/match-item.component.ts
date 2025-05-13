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
export class MatchItemComponent implements OnInit {
  @Input() partnerInfo!: Match;

  constructor(private activeConversationService: ActiveConversationService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello', this.partnerInfo);
  }

  getAvatarUrl(): string{
    return  StringUtils.getAvatarUrl(this.partnerInfo?.photos[0]);
  }
  onOpenConversation(): void {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;
    const partner = this.setActiveConversationsData(this.partnerInfo);
    this.activeConversationService.openConversation(partner, null);
  }

  setActiveConversationsData(match: Match): Partner {
    return {
      partner_id: match.partner_id,
      name: match.name,
      connection_status: match.connection_status,
      public_key: match.public_key,
      updated_at: match.match_updated_at,
      created_at: match.match_created_at,
      photos: match.photos,
    }
  }
}
