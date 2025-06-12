import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Match } from '../../models/match.model';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { UserInChatDto } from 'src/app/features/conversations/interfaces/conversations.dto';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
  standalone: false,
})
export class MatchItemComponent {
  @Input() partnerInfo!: Match;

  constructor(private activeConversationService: ActiveConversationService) {}

  getAvatarUrl(): string{
    return  StringUtils.getAvatarUrl(this.partnerInfo?.photos[0]);
  }
  onOpenConversation(): void {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;
    const partner = this.setActiveConversationsData(this.partnerInfo);
    this.activeConversationService.openConversation(partner, null);
  }

  setActiveConversationsData(match: Match): UserInChatDto {
    return {
      user_id: match.partner_id,
      name: match.name,
      birth_date: match.birth_date,
      city: match.city,
      country: match.country,
      is_admin: false,
      connection_status: match.connection_status,
      public_key: match.public_key,
      photos: match.photos,
      bio: match.bio,
      sexual_orientation: match.sexual_orientation,
      looking_for: match.looking_for,
      matched_at: match.match_updated_at
    }
  }
}
