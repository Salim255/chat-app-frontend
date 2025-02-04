import { Component, OnDestroy, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { TapService } from "src/app/services/tap/tap.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
import { ActiveConversationService } from "src/app/features/active-conversation/services/active-conversation.service";
import { ConnectionStatus, SocketIoService } from "src/app/services/socket.io/socket.io.service";
import { Partner } from "src/app/interfaces/partner.interface";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-active-conversation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class headerComponent implements OnInit, OnDestroy {
  partnerInfo: Partner | null = null;
  private partnerInfoSubscription!: Subscription;
  partnerImage = 'assets/images/default-profile.jpg';
  partnerConnectionStatus: ConnectionStatus = "offline";

  constructor(private router: Router, private discoverService: DiscoverService,
    private tapService: TapService, private profileViewerService: ProfileViewerService,
    private activeConversationService: ActiveConversationService, private socketIoService: SocketIoService ) {
    }


  onBackArrow () {
    // Clean up the active conversation and navigate to the conversations page
    this.partnerImage = 'assets/images/default-profile.jpg';
    this.socketIoService.userLeftChatRoomEmitter();
    this.router.navigateByUrl('/tabs/conversations');
  }

  ngOnInit(): void {

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.partnerInfoSubscription  = this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {
      this.partnerInfo = partnerInfo;
      if (this.partnerInfo && this.partnerInfo.avatar) {
        if (this.partnerInfo.avatar.length > 0) {
          const partnerAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.partnerInfo.avatar}`;
          this.partnerImage = partnerAvatar;
        }
      }
    })

    this.socketIoService.getPartnerConnectionStatusSubject.subscribe(updatedUser => {
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
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if ( this.partnerInfoSubscription ){
      this.partnerInfoSubscription.unsubscribe();
    }
  }
}
