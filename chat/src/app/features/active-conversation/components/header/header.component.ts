import { Component, Input} from "@angular/core";
import { Router } from "@angular/router";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Foreigner } from "src/app/models/foreigner.model";
import { TapService } from "src/app/services/tap/tap.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";

@Component({
  selector: 'app-chat-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class headerComponent {
  @Input() partnerInfo: any;
  constructor(private router: Router, private discoverService: DiscoverService,
    private tapService: TapService, private profileViewerService: ProfileViewerService ) {}


  onBackArrow () {
    this.router.navigate(['./tabs/conversations']);
 }

  // It's function that responsible of viewing details of the clicked profile
  //
  onDisplayProfile(profile: Foreigner) {
    this.tapService.setTapHidingStatus('hide');
    console.log('====================================');
    console.log("hello");
    console.log('====================================');
    //this.discoverService.setDisplayedProfile(profile)
    this.profileViewerService.setProfileToDisplay(profile)
    this.router.navigate(['./tabs/view-profile']);
  }
}
