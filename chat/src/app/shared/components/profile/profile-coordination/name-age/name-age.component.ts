import { Component, Input} from "@angular/core";
import { TabsService } from "src/app/tabs/services/tabs/tabs.service";
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
    private tabsService: TabsService,
    private profileViewerService: ProfileViewerService) { }

  onViewProfile(){
    console.log('====================================');
    console.log("We are on view profile");
    console.log('====================================');
    this.tabsService.setTapHidingStatus('hide');
    this.profileViewerService.setProfileToDisplay(this.profile);
    this.profileViewerService.openProfileViewerModal();
 }
}
