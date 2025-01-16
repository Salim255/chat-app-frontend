import { Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import { Router } from "@angular/router";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Foreigner } from "src/app/models/foreigner.model";
import { TapService } from "src/app/services/tap/tap.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";

@Component({
  selector: 'app-active-conversation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class headerComponent implements OnChanges {
  @Input() partnerInfo: any;
  partnerImage = 'assets/images/default-profile.jpg';
  constructor(private router: Router, private discoverService: DiscoverService,
    private tapService: TapService, private profileViewerService: ProfileViewerService ) {}


  onBackArrow () {
    this.router.navigate(['./tabs/conversations']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (this.partnerInfo) {
      if (this.partnerInfo?.avatar?.length > 0) {
      const partnerAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.partnerInfo?.avatar}`;
      this.partnerImage = partnerAvatar;
      }
    }
  }
  // It's function that responsible of viewing details of the clicked profile
  //
  onDisplayProfile(profile: Foreigner) {
    this.tapService.setTapHidingStatus('hide');
    //this.discoverService.setDisplayedProfile(profile)
    this.profileViewerService.setProfileToDisplay(profile)
    this.profileViewerService.openProfileViewerModal();
    //this.router.navigate(['./tabs/view-profile']);
  }
}
