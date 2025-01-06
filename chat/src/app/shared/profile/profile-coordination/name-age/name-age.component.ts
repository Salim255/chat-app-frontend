import { Component, Input} from "@angular/core";
import { TapService } from "src/app/services/tap/tap.service";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Router } from "@angular/router";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
@Component({
  selector: 'app-name-age',
  templateUrl: './name-age.component.html',
styleUrls: ['./name-age.component.scss']
})

export class NameAgeComponent {
  @Input() profile: any;

  constructor (private discoverService: DiscoverService,
     private tapService: TapService, private router: Router,
    private profileViewerService: ProfileViewerService) { }

  onViewProfile(){
    this.tapService.setTapHidingStatus('hide');
    //this.discoverService.setDisplayedProfile(this.profile);
    this.profileViewerService.setProfileToDisplay(this.profile);
    //this.router.navigate(['./tabs/view-profile']);
    this.profileViewerService.openProfileViewerModal();
 }
}
