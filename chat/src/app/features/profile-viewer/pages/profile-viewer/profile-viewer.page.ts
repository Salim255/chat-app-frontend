import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { InteractionButtonsService } from 'src/app/core/services/interaction-buttons/interaction-buttons.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss'],
  standalone: false,
})
export class ProfileViewerPage implements OnInit, OnDestroy {
  profileToDisplay: any;
  private profileToDisplaySubscription!: Subscription;
  private interactionButtonsSubscription!: Subscription;
  constructor(
    private profileViewerService: ProfileViewerService,
    private discoverService: DiscoverService,
    private interactionButtonsService: InteractionButtonsService
  ) {}

  ngOnInit() {
    this.profileToDisplaySubscription = this.profileViewerService.getProfileToDisplay.subscribe(
      (profile) => {
        this.profileToDisplay = profile;
      }
    );

    this.interactionButtonsSubscription =
      this.interactionButtonsService.getInteractionBtnsStatus.subscribe((status) => {
        // this.hidingTapStatus = status;
      });
  }

  ngOnDestroy() {
    this.interactionButtonsSubscription?.unsubscribe();
    this.profileToDisplaySubscription?.unsubscribe();
  }
}
