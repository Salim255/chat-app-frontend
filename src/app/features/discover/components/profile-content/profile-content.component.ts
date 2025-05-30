import { Component, Input } from '@angular/core';
import { DisableProfileSwipe } from '../../services/discover.service';
import { Profile } from '../../model/profile.model';
import { ViewProfileData } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PageName } from 'src/app/shared/components/profile/slider/slider.component';

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
  standalone: false,
})
export class ProfileContentComponent {
  @Input() profile!: Profile;
  @Input() profileToView: DisableProfileSwipe | null = null;
  pageName: PageName = PageName.Discover;

  constructor() {}

  onCollapseProfileDetails(profileToView: DisableProfileSwipe | null): string {
    if (this.profile.user_id === profileToView?.profile?.user_id && profileToView.disableSwipe) {
      return 'profile-details profile-details__expand';
    }
    return 'profile-details profile-details__collapse';
  }

}
