import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PartnerConnectionStatus, SocketRoomService } from 'src/app/core/services/socket-io/socket-room.service';
import { ActiveConversationUIService } from '../../services/active-conversation-ui.service';
import { ActiveConversationPartnerService } from '../../services/active-conversation-partner.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';

@Component({
  selector: 'app-active-conversation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class headerComponent implements OnChanges {
  @Input() partnerInfo!: Partner ;

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
    if (!this.partnerInfo.partner_id) return;
    this.socketTypingService.userStopTyping(this.partnerInfo?.partner_id);
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

  onDisplayProfile(profile: Partner | null): void {
    if (!profile || !profile.partner_id) return;
    const { partner_id, ...rest } = profile;
    this.profileViewerService.setProfileToDisplay({ user_id: partner_id, ...rest });
    this.profileViewerService.openProfileViewerModal();
  }
}
