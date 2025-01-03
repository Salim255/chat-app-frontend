import { Component, Input, OnInit} from "@angular/core";
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
export class headerComponent implements OnInit {
  @Input() partnerInfo: any;
  constructor(private router: Router, private discoverService: DiscoverService,
    private tapService: TapService, private profileViewerService: ProfileViewerService ) {}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('====================================');
    console.log(this.partnerInfo, "heyyy");
    console.log('====================================');
  }
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
