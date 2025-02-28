import { Component, Input} from "@angular/core";
import { TapService } from "src/app/services/tap/tap.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
@Component({
    selector: 'app-name-age',
    templateUrl: './name-age.component.html',
    styleUrls: ['./name-age.component.scss'],
    standalone: false
})

export class NameAgeComponent {
  @Input() profile: any;

  constructor (
    private tapService: TapService,
    private profileViewerService: ProfileViewerService) { }

  onViewProfile(){
    console.log('====================================');
    console.log("We are on view profile");
    console.log('====================================');
    this.tapService.setTapHidingStatus('hide');
    this.profileViewerService.setProfileToDisplay(this.profile);
    this.profileViewerService.openProfileViewerModal();
 }
}
