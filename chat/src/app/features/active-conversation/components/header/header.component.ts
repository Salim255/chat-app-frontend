import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileViewerService, ViewProfileData } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PartnerConnectionStatus, SocketRoomService } from 'src/app/core/services/socket-io/socket-room.service';
import { ActiveConversationUIService } from '../../services/active-conversation-ui.service';
import { ActiveConversationPartnerService } from '../../services/active-conversation-partner.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { UserInChatDto } from 'src/app/features/conversations/interfaces/conversations.dto';

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

  const data: ViewProfileData =
          {
            birth_date: this.partnerInfo.birth_date,
            city: this.partnerInfo.city,
            connection_status: this.partnerInfo.connection_status,
            country: this.partnerInfo.country,
            name: this.partnerInfo.name,
            partner_id: this.partnerInfo.user_id,
            photos: this.partnerInfo.photos,
          }
    this.profileViewerService.openProfileViewerModal(data);
  }
}
