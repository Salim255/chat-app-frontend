import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DisableProfileSwipe,
  DiscoverService,
  InteractionType,
} from 'src/app/features/discover/services/discover.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { TabsService } from 'src/app/tabs/services/tabs/tabs.service';
import { IonContent } from '@ionic/angular';
import { Profile } from './model/profile.model';
import { InteractionBtnService } from './services/interaction-btn.service';

export enum SwipeDirection {
  SwipeLeft = 'swipe-left',
  SwipeRight = 'swipe-right',
  SwipeUp = 'swipe-up',
  SwipeDown = 'swipe-down',
}

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false,
})
export class DiscoverPage implements OnInit, OnDestroy {
  @ViewChild('footer', { static: false, read: ElementRef }) footer!: ElementRef;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;

  isConnected = signal<boolean>(false);
  discoverToggleStatus = signal<boolean | null>(null);
  animationClass = signal<string>('');
  isAnimating = signal<boolean>(false);
  animationType: SwipeDirection | null = null;

  potentialMatches = signal<Profile[]>([]);
  profileToView = signal<DisableProfileSwipe | null>(null);

  hostAvatar!: string;

  private hostProfileSubscription!: Subscription;
  private potentialMatchesSource!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;
  private discoverProfileToggleSubscription!: Subscription;
  private listenToProfileInteractionSource!: Subscription;
  private btnInteractionSubscription!: Subscription;

  constructor(
    private discoverService: DiscoverService,
    private networkService: NetworkService,
    private accountService: AccountService,
    private tabsService: TabsService,
    private interactionBtnService: InteractionBtnService,
  ) {
    this.networkService.getNetworkStatus();
  }

  ngOnInit(): void {
    this.subscribeNetwork();
    this.subscribeProfileToRemove();
    this.subscribeToInteractionBtn();
    this.subscribeToPotentialMatches();
  }

  ionViewWillEnter(): void {
    console.log("Hello from disocverts")
    this.discoverService.fetchPotentialMatches().subscribe();
    this.subscribeToInteraction();
    this.subscribeToDiscoverProfileToggle();
    this.subscribeToInteractionBtn();
    this.subscribeToHostProfile();
  }

  private subscribeToInteractionBtn() {
    this.btnInteractionSubscription = this.interactionBtnService.getActionDirection
    .subscribe((action) => {
      this.animationType = action ;
    });
  }
  get topProfile(): Profile | null {
    return this.potentialMatches().length ? this.potentialMatches()[0] : null;
  }

  trackById(i: number, item: Profile): number {
    return item.user_id;
  }

  selectTab(): void {
    this.tabsService.selectedTab('account');
  }

  private subscribeToHostProfile(){
    this.hostProfileSubscription = this.accountService.getHostUserPhoto.subscribe(avatar => {
      if (!avatar) return;
        this.hostAvatar = avatar;
    })
  }

  private subscribeToInteraction(): void {
    this.listenToProfileInteractionSource =
      this.discoverService.getProfileInteractionType.subscribe((interActionType) => {
        if (interActionType) {
          this.handleProfileInteraction(interActionType);
        }
      });
  }

  private handleProfileInteraction(actionType: InteractionType): void {
    if (actionType === InteractionType.DISLIKE) this.handleDislikeProfile();
    if (actionType === InteractionType.LIKE) this.handleLikeProfile();
    this.discoverService.setProfileInteractionType(null);
  }

  handleDislikeProfile(): void {
    if (this.isAnimating()) return;
    this.setSwipeAnimationStyle(SwipeDirection.SwipeLeft);
    this.isAnimating.set(true);
    setTimeout(() => {
      this.removeTopProfile();
      this.animationClass.set(''); // Reset the animation class
      this.isAnimating.set(false);
    }, 500);
  }

  private setSwipeAnimationStyle(swipeDirection: SwipeDirection): void {
    this.animationClass.set(swipeDirection);
  }

  handleLikeProfile(): void {
    if (this.isAnimating()) return;
    // To avoid many
    this.isAnimating.set(true);
    // For interaction animation
    this.setSwipeAnimationStyle(SwipeDirection.SwipeRight);
    const profile = this.topProfile ?? null;
    if (!profile) return;
    if (profile) {
      if(!profile.match_status) this.discoverService.initiateMatchRequest(profile).subscribe();
      if(profile.match_status === 1) this.discoverService.acceptMatchRequest(profile).subscribe();
    }
    setTimeout(() => {
      this.removeTopProfile();
      this.animationClass.set(''); // Reset the animation class
      this.isAnimating.set(false); //
    }, 500);
  }

  private removeTopProfile(): void {
    if (this.potentialMatches().length ) {
      this.potentialMatches.update((potentialMatches) => {
        if (potentialMatches.length) {
          potentialMatches.shift();
        }
        return potentialMatches;
      });
    }
    if (this.potentialMatches().length === 0) {
      this.discoverService.fetchPotentialMatches().subscribe();
    }
  }

  private subscribeToDiscoverProfileToggle(): void {
    this.discoverProfileToggleSubscription =
      this.discoverService
      .getDiscoverProfileToggleStatus
      .subscribe((data) => {
        this.discoverToggleStatus.set(data?.disableSwipe || null);
        this.profileToView.set(data);

        if (!this.discoverToggleStatus() && this.content) {
          this.content.scrollToTop(500); // Scrolls back to the top in 500ms
        }
      });
  }

  private subscribeProfileToRemove(): void {
    this.profileToRemoveSubscription =
      this.discoverService.getProfileToRemoveId
      .subscribe(() => this.removeTopProfile());
  }

  private subscribeNetwork(): void {
    this.netWorkSubscription =
      this.networkService.getNetworkStatus()
      .subscribe((isConnected) => {
        this.isConnected.set(isConnected);
    });
  }

  private subscribeToPotentialMatches(): void {
    this.potentialMatchesSource =
      this.discoverService.getPotentialMatchesArray
      .subscribe((profiles) => {
        this.potentialMatches.set([...profiles]);
      });
  }

  ionViewWillLeave(): void {
    this.netWorkSubscription?.unsubscribe();
    this.potentialMatchesSource?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
    this.discoverProfileToggleSubscription?.unsubscribe();
    this.listenToProfileInteractionSource?.unsubscribe();
    this.hostProfileSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.netWorkSubscription?.unsubscribe();
    this.potentialMatchesSource?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
    this.discoverProfileToggleSubscription?.unsubscribe();
    this.listenToProfileInteractionSource?.unsubscribe();
    this.btnInteractionSubscription?.unsubscribe();
  }
}
