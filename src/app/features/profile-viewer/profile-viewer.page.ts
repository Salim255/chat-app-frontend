import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/features/discover/model/profile.model';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PageName } from 'src/app/shared/components/profile/slider/slider.component';
import { DateUtils } from 'src/app/shared/utils/date-utils';

type ProfileField = {
  title: string;
  value: string;
  iconName: string
}

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss'],
  standalone: false,
})
export class ProfileViewerPage implements OnInit {
  @Input() profile!: Profile;
  pageName: PageName = PageName.ProfileViewer;
  constructor(private profileViewerService: ProfileViewerService) {}

  profileContent: ProfileField [] = [];

  ngOnInit(): void {
    console.log('ProfileViewerPage', this.profile);
    this.buildProfileContent();
  }
  onClose(): void{
    this.profileViewerService.closeModal();
  }

  buildProfileContent(): void{
    if(this.profile.bio ){
      this.profileContent.push({
        title: 'bio',
        value: this.profile.bio,
        iconName: "person-outline"
       })
    }
    if(this.profile.city && this.profile.country ) {
      this.profileContent.push({
        title: 'home',
        value: `${this.profile.city}, ${this.profile.country}`,
        iconName: "home-outline"
      })
    }
    if(this.profile.looking_for) {
      this.profileContent.push({
        title: 'Looking for',
        value: `${this.profile.looking_for[0]}, ${this.profile.looking_for[1]}`,
        iconName: "footsteps-outline"
      })
    }
  }
  profileAge(birthDate: Date | string): number {
    return DateUtils.calculateAge(birthDate);
  }
}
