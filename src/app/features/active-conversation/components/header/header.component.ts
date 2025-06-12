import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PartnerConnectionStatus, SocketRoomService } from 'src/app/core/services/socket-io/socket-room.service';
import { ActiveConversationUIService } from '../../services/active-conversation-ui.service';
import { ActiveConversationPartnerService } from '../../services/active-conversation-partner.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { UserInChatDto } from 'src/app/features/conversations/interfaces/conversations.dto';
import { Profile } from 'src/app/features/discover/model/profile.model';

@Component({
  selector: 'app-active-conversation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class headerComponent implements OnChanges {
  @Input() partnerInfo!: UserInChatDto ;

  constructor(
    private socketTypingService: SocketTypingService,
    private profileViewerService: ProfileViewerService,
    private socketRoomService: SocketRoomService,
    private activeConversationUIService: ActiveConversationUIService,
    private activeConversationPartnerService: ActiveConversationPartnerService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.subscribeToPartnerConnectionStatus();
  }

  onBackArrow():void {
    this.socketRoomService.emitLeaveRoom();
    this.activeConversationUIService.closeModal();
    if (!this.partnerInfo.user_id) return;
    this.socketTypingService.userStopTyping(this.partnerInfo?.user_id);
  }

  private subscribeToPartnerConnectionStatus() {
    this.activeConversationPartnerService
    .getPartnerConnectionStatus
    .subscribe((status) => {
      if (!this.partnerInfo) return;

      if (status === PartnerConnectionStatus.OFFLINE ) this.partnerInfo.connection_status = 'offline';
      else this.partnerInfo.connection_status = 'online';
    });
  }

  setAvatarUrl(): string {
    return StringUtils.getAvatarUrl(this.partnerInfo?.photos[0]);
  }

  onDisplayProfile(): void {
    if (!this.partnerInfo || !this.partnerInfo.user_id) return;

  const data: Profile =
          {
            user_id: this.partnerInfo.user_id,
            profile_id: 0,
            birth_date: this.partnerInfo.birth_date,
            city: this.partnerInfo.city,
            connection_status: this.partnerInfo.connection_status,
            country: this.partnerInfo.country,
            name: this.partnerInfo.name,
            match_id: 0,
            match_status: 0,
            photos: this.partnerInfo.photos,
            bio: this.partnerInfo.bio,
            looking_for: this.partnerInfo.looking_for,
            sexual_orientation: this.partnerInfo.sexual_orientation
          }
    this.profileViewerService.openProfileViewerModal(data);
  }

   getStatusColor(status: string): string {
    return status === 'online'
      ? 'var(--ion-color-online)'
      : 'var(--ion-color-offline)';
  }
}
