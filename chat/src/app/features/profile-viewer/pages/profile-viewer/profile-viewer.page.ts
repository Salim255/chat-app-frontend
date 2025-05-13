import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss'],
  standalone: false,
})
export class ProfileViewerPage implements OnInit, OnDestroy {
  profileToDisplay: any;
  private profileToDisplaySubscription!: Subscription;
  constructor(private profileViewerService: ProfileViewerService) {}

  ngOnInit(): void {
    this.profileToDisplaySubscription = this.profileViewerService.getProfileToDisplay.subscribe(
      (profile) => {
        this.profileToDisplay = profile;
      }
    );
  }

  ngOnDestroy(): void {
    this.profileToDisplaySubscription?.unsubscribe();
  }
}
