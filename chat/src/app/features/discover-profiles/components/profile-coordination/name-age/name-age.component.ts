import { Component, Input} from "@angular/core";
import { TapService } from "src/app/services/tap/tap.service";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
@Component({
  selector: 'app-name-age',
  templateUrl: './name-age.component.html',
styleUrls: ['./name-age.component.scss']
})

export class NameAgeComponent {
  @Input() profile: any;

  constructor (private discoverService: DiscoverService, private tapService: TapService) { }

  onViewProfile(){
    this.tapService.setTapHidingStatus('hide');
    this.discoverService.setDisplayedProfile(this.profile)
 }
}
