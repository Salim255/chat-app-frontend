import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Member } from "src/app/shared/interfaces/member.interface";
import { DisableProfileSwipe } from "../../services/discover.service";

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
  standalone: false
})

export class ProfileContentComponent implements OnChanges{
  @Input() profile!: Member;
  @Input() profileToView: DisableProfileSwipe | null = null;
  constructor () {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log()
  }
  testconst() {
    console.log("Hello coentner")
  }

  onCollapseProfileDetails(profileToView: DisableProfileSwipe | null) {
    if ( (this.profile.user_id === profileToView?.profile?.user_id ) &&  profileToView.disableSwipe) {
      return 'profile-details profile-details__expand';
    }
    return 'profile-details profile-details__collapse';
  }
}
