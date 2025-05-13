import { Component, Input, OnInit } from '@angular/core';
import { ItsMatchModalService } from '../../services/its-match-modal.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

@Component({
  selector: 'app-its-modal-match',
  templateUrl: './its-match-modal.component.html',
  styleUrls: ['./its-match-modal.component.scss'],
  standalone: false,
})
export class ItsMatchModalComponent implements OnInit {
  @Input() matchedProfile!: Match;
  hostUserPhoto!: string;
  matchedAvatar!: string;

  constructor(
    private accountService: AccountService,
    private itsMatchModalService: ItsMatchModalService,
    private activeConversationService: ActiveConversationService
  ) {}

  ngOnInit(): void {
    this.getMatchedAvatar();
    this.subscribeToHostProfile();
    console.log(this.matchedProfile, 'hello from ')
  }

  onSendMessage(): void {
    const profileInChat: UserInChatDto = {
      user_id: this.matchedProfile.partner_id,
      name: this.matchedProfile.name,
      birth_date: this.matchedProfile.birth_date,
      city: this.matchedProfile.city,
      country: this.matchedProfile.country,
      connection_status: this.matchedProfile.connection_status,
      public_key: this.matchedProfile.public_key,
      photos: this.matchedProfile.photos,
      is_admin: false,
    }
    this.activeConversationService.openConversation(profileInChat, null);
    this.itsMatchModalService.closeModal();
  }

  onKeepSwiping(): void {
    this.itsMatchModalService.closeModal();
  }

  private subscribeToHostProfile() {
    this.accountService.getHostUserPhoto.subscribe((avatar) => {
       this.hostUserPhoto = StringUtils.getAvatarUrl(avatar);
       //if (!this.matchedAvatar) this.matchedAvatar = StringUtils.getAvatarUrl(this.matchedAvatar)
     });
  }

  getMatchedAvatar(): void{
    if (this.matchedProfile.photos) {
      this.matchedAvatar = StringUtils.getAvatarUrl(this.matchedProfile.photos[0]);
    }
  }
}
