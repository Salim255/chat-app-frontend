import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProfileViewerService, ViewProfileData } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { PageName } from 'src/app/shared/components/profile/slider/slider.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss'],
  standalone: false,
})
export class ProfileViewerPage {
  @Input() profile!: ViewProfileData;
  pageName: PageName = PageName.ProfileViewer;
  constructor(private profileViewerService: ProfileViewerService) {}

  onClose(): void{
    this.profileViewerService.closeModal();
  }
}
