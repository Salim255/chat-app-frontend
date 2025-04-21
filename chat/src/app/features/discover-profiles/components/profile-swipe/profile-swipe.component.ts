import { Component, Input, signal } from '@angular/core';
import {
  DisableProfileSwipe,
  DiscoverService,
  InteractionType,
} from '../../services/discover.service';
import { Discover } from '../../model/discover.model';


@Component({
  selector: 'app-profile-swipe',
  templateUrl: './profile-swipe.component.html',
  styleUrls: ['./profile-swipe.component.scss'],
  standalone: false,
})
export class ProfileSwipeComponent {
  @Input() profile!: Discover;
  @Input() profileToView: DisableProfileSwipe | null = null;

  currentTransformX: number = 0; // Keeps track of the current of the card
  isAnimating = signal<boolean>(false);
  resetProfileTimer: any;

  constructor(private discoverService: DiscoverService) {}

  onSwipeLeft(event: any): void {
    this.discoverService.setProfileInteractionType(InteractionType.DISLIKE);
  }

  onSwipeRight(event: any) {
    this.discoverService.setProfileInteractionType(InteractionType.LIKE);
  }

  disableHammerSwiper(profileToView: DisableProfileSwipe | null): string {
    if (!profileToView || this.profile?.id !== profileToView.profile.id) {
      return 'hammer-swiper-container '; // Return the default class if the condition doesn't match
    }
    if (profileToView.disableSwipe) {
      return 'hammer-swiper-container  hammer-swiper-container__disable-hammer-swipe';
    } else {
      return 'hammer-swiper-container ';
    }
  }
}
