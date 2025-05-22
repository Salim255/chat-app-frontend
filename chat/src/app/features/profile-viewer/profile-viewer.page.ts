import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/features/discover/model/profile.model';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PageName } from 'src/app/shared/components/profile/slider/slider.component';
import { DateUtils } from 'src/app/shared/utils/date-utils';

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
  ngOnInit(): void {
    console.log('ProfileViewerPage', this.profile);
  }
  onClose(): void{
    this.profileViewerService.closeModal();
  }

  profileAge(birthDate: Date | string): number {
    return DateUtils.calculateAge(birthDate);
  }
}
