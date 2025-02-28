import { Component, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import { Router } from '@angular/router';

import { TapService } from "src/app/tabs/services/tap/tap.service";
import { ConnectionStatus, SocketIoService } from "src/app/core/services/socket.io/socket.io.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { StringUtils } from "src/app/shared/utils/string-utils";

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
    private location: Location, private router: Router ) { }


  onBackArrow () {
    this.socketIoService.userLeftChatRoomEmitter();
    this.location.back(); // Default page if no history
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.partnerInfo)
    if (this.partnerInfo) {
      //this.partnerInfo.avatar = StringUtils.getAvatarUrl( this.partnerInfo?.avatar)
    }

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
    //this.discoverService.setDisplayedProfile(profile)
    //this.profileViewerService.setProfileToDisplay(profile)
    //this.profileViewerService.openProfileViewerModal();
    //this.router.navigate(['./tabs/view-profile']);
  }

  ngOnDestroy(): void {
    this.partnerInfoSubscription?.unsubscribe();
  }
}
