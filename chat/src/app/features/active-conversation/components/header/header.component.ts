import { Component, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import { TapService } from "src/app/tabs/services/tap/tap.service";
import { ConnectionStatus, SocketIoService } from "src/app/core/services/socket.io/socket.io.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { Subscription } from "rxjs";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
import { SocketMessageHandler } from "src/app/core/services/socket.io/socket-message-handler";
@Component({
    selector: 'app-active-conversation-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class headerComponent implements OnChanges, OnDestroy {
  @Input() partnerInfo: Partner | null = null;
  private partnerInfoSubscription!: Subscription;

  partnerConnectionStatus: ConnectionStatus = "offline";

  constructor(
    private tapService: TapService,
    private socketIoService: SocketIoService,
    private activeConversationService:  ActiveConversationService,
    private profileViewerService: ProfileViewerService,
    private socketMessageHandler: SocketMessageHandler
    ) { }

  onBackArrow () {
    this.socketIoService.userLeftChatRoomEmitter();
    this.activeConversationService.closeModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.socketMessageHandler.getPartnerConnectionStatus.subscribe(updatedUser => {
       if (updatedUser && this.partnerInfo) {
         this.partnerInfo.connection_status = updatedUser.connection_status;
       }
    })
  }

  // It's function that responsible of viewing details of the clicked profile
  //
  onDisplayProfile(profile: Partner | null) {
    if (!profile || !profile.partner_id) return;
    const { partner_id, ...rest} = profile;
    this.profileViewerService.setProfileToDisplay({ user_id: partner_id, ...rest })
    this.profileViewerService.openProfileViewerModal()
  }

  ngOnDestroy(): void {
    this.partnerInfoSubscription?.unsubscribe();
  }
}
