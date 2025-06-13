import { Component, Input, OnInit } from '@angular/core';
import { getDistanceInKm } from 'src/app/core/services/geolocation/geo-utils';
import { Profile } from 'src/app/features/discover/model/profile.model';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PageName } from 'src/app/shared/components/profile/slider/slider.component';
import { DateUtils } from 'src/app/shared/utils/date-utils';
import { AccountService } from '../account/services/account.service';

type ProfileField = {
  title: string;
  value: string;
  iconName: string
}

export enum LookingFor {
  Chat = 'chat',
  Friendship = 'friendship',
  Casual = 'casual',
  LongTerm = 'long_term',
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
  constructor(
    private accountService: AccountService,
    private profileViewerService: ProfileViewerService,
  ) {}

  profileContent: ProfileField [] = [];

  ngOnInit(): void {
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
        title: 'Lives in',
        value: `${this.profile.city}, ${this.profile.country}`,
        iconName: "home-outline"
      })
    }

    if(this.profile?.looking_for?.length) {
     const lookingString: string = this.profile.looking_for
      .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join(', ');
      this.profileContent.push({
        title: 'Looking for',
        value: lookingString,
        iconName: "footsteps-outline"
      })
    }

    if (this.profile.height){
      this.profileContent.push({
        title: 'Height',
        value: `${this.profile.height} cm`,
        iconName: ""
      })
    }

    if (this.profile?.languages?.length){
      const languagesString: string = this.profile.languages
      .map(item => this.capitalizeText(item))
      .join(', ');

      this.profileContent.push({
        title: 'Languages',
        value: languagesString,
        iconName: "language-outline"
      })
    }

    if (this.profile.sexual_orientation){
      this.profileContent.push({
        title: 'Sexual Orientation',
        value: this.capitalizeText(this.profile.sexual_orientation),
        iconName: "heart-outline"
      })
    }

    if(this.profile.education){
      this.profileContent.push({
        title: 'School',
        value: this.capitalizeText(this.profile.education),
        iconName: "school-outline"
      })
    }
    if(this.profile.latitude && this.profile.longitude ) {
      const hostCoordinates = this.accountService.getHostCoordinates;
      if (hostCoordinates) {
          const locationInKm = getDistanceInKm(
        hostCoordinates,
        {
          latitude: this.profile.latitude,
          longitude: this.profile.longitude,
        });
      this.profileContent.push({
        title: 'Located in',
        value: `${this.formatDistance(locationInKm)}`,
        iconName: "location-outline"
      });
      }
    }
    const childrenText =
      this.profile.children === false
      ? `I don't have children`
      : this.profile.children
      ? 'I have children' : `-`;

    this.profileContent.push({
      title: 'Children',
      value:  childrenText ,
      iconName: "people-outline"
    });
  }

  capitalizeText(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }

  formatDistance(locationInKm: number): string {
    if (locationInKm < 1) {
      return 'Less than 1 km away';
    }
    return `${locationInKm} km away`;
  }
  profileAge(birthDate: Date | string): number {
    return DateUtils.calculateAge(birthDate);
  }
}
