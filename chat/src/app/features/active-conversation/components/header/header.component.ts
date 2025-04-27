import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {
  ConnectionStatus,
  SocketIoService,
} from 'src/app/core/services/socket-io/socket-io.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Subscription } from 'rxjs';
import { ActiveConversationService } from '../../services/active-conversation.service';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PartnerConnectionStatus, SocketRoomService } from 'src/app/core/services/socket-io/socket-room.service';

@Component({
  selector: 'app-active-conversation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class headerComponent implements OnChanges, OnDestroy {
  @Input() partnerInfo: Partner | null = null;
  private partnerInfoSubscription!: Subscription;

  partnerConnectionStatus: ConnectionStatus = ConnectionStatus.Offline;

  constructor(
    private activeConversationService: ActiveConversationService,
    private profileViewerService: ProfileViewerService,
    private socketRoomService: SocketRoomService
  ) {}

  onBackArrow():void {
    this.socketRoomService.emitLeaveRoom();
    this.activeConversationService.closeModal();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.activeConversationService.getPartnerConnectionStatus.subscribe((status:PartnerConnectionStatus) => {
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

  ngOnDestroy(): void {
    this.partnerInfoSubscription?.unsubscribe();
  }
}
