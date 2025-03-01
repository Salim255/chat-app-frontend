import { Component, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import { Router } from '@angular/router';

import { TapService } from "src/app/tabs/services/tap/tap.service";
import { ConnectionStatus, SocketIoService } from "src/app/core/services/socket.io/socket.io.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { ActiveConversationService } from "../../services/active-conversation.service";

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
    private activeConversationService:  ActiveConversationService ) { }


  onBackArrow () {
    this.socketIoService.userLeftChatRoomEmitter();
    this.activeConversationService.closeModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.socketIoService.getPartnerConnectionStatus.subscribe(updatedUser => {
       if (updatedUser && this.partnerInfo) {
         this.partnerInfo.connection_status = updatedUser.connection_status;
       }
    })
  }

  // It's function that responsible of viewing details of the clicked profile
  //
  onDisplayProfile(profile: Partner | null) {
    this.tapService.setTapHidingStatus('hide');
  }

  ngOnDestroy(): void {
    this.partnerInfoSubscription?.unsubscribe();
  }
}
