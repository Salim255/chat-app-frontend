import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { Foreigner } from '../../models/foreigner.model';

import { NetworkService } from 'src/app/core/services/network/network.service';
import { TapService } from 'src/app/services/tap/tap.service';
import { AccountService } from 'src/app/features/account/services/account.service';

type DisplayTap =  'show' | 'hide';

type SwipeStatus = 'pending' | 'confirmed' | 'rejected';

interface SwipeState {
    left: SwipeStatus,
    right: SwipeStatus
}

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
    standalone: false
})

export class DiscoverPage implements OnInit, OnDestroy {
  isConnected: boolean= true;

  foreignersList: Foreigner [] = [];
  viewedProfile: Foreigner | null = null;
  transform: string | null = null;
  currentIndex: number = 0;

  counterX: number = -50;
  counterY: number = -50;
  rotateCounterY: number = 0;
  rotateCounterX: number = 0;

  profilesImages: string [] = [];
  foreignersListStatus: boolean = false;
  swipeState: SwipeState = {
    left: 'confirmed',
    right: 'confirmed',
  };
  hidingTapStatus: DisplayTap = 'show' ;

  private profiles = [
    { id: 1, name: 'Sophia', image: 'assets/images/default-profile.jpg'},
    { id: 2, name: 'Liam', image: 'assets/images/default-profile.jpg' },
    { id: 3, name: 'Emma', image: 'assets/images/default-profile.jpg' },
    { id: 4, name: 'Noah', image: 'assets/images/default-profile.jpg' }
  ];

  profilesToShare: any;

  private foreignersSource!: Subscription;
  private viewedProfileSubscription!: Subscription;
  private likeActionSourceSubscription!: Subscription;
  private disLikeActionSourceSubscription!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;

  constructor (
     private discoverService: DiscoverService,
     private networkService:  NetworkService,
     private tapService: TapService, private accountService: AccountService
    ) {}

  ngOnInit () {
    this. profilesToShare = this.profiles;
    this.subscribeNetwork();
    this.subscribeProfileToRemove()
  }

  ionViewWillEnter () {
    this.discoverService.fetchUsers().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  private subscribeProfileToRemove() {
    if (this.profileToRemoveSubscription  && !this.profileToRemoveSubscription.closed)  {
       this.profileToRemoveSubscription.unsubscribe();
    }
    this.profileToRemoveSubscription = this.discoverService.getProfileToRemoveId.subscribe(profileId => {
      if (profileId !== null && profileId !== undefined) this.removeProfileFromList(profileId)
    })
  }
  private subscribeNetwork() {
    this.netWorkSubscription = this.networkService.getNetworkStatus().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (isConnected) {
          this.handleLikeDislikeSubscription();
          this.loadForeignersList();
          this.trackViewedProfile();
      }
    })
  }

  private trackViewedProfile(){
    this.viewedProfileSubscription = this.discoverService.getDisplayedProfile.subscribe(profile => {
      this.viewedProfile = profile
     })
  }

  private loadForeignersList(){
    this.foreignersSource = this.discoverService.getNoConnectedFriendsArray.subscribe( (data )=> {
      this.foreignersList = data;
      if (data) {
        this.setCurrentProfile();
        this.setForeignersListStatus();
      }
    });
  }
  private handleLikeDislikeSubscription() {
    this.likeActionSourceSubscription = this.discoverService.getLikeProfileState.subscribe(state => {
      if (state ===  'skip') {
        this.skipFriend();
      } else if (state ===  'like') {
        this.addFriend();
        this.likeActionSourceSubscription.unsubscribe();
      }
     });
  }

  addFriend(){
    const foreigner =  this.getCurrentProfile();

    if (foreigner?.id) {
      this.discoverService.addFriend(foreigner.id)
      .subscribe({
        error: () => {
          console.log("error");

        },
        next: () => {
          this.dropProfileFromForeignersList();
          this.setCurrentProfile();
          this.likeActionSourceSubscription.unsubscribe();
        }
     })
    }
  }

  setCurrentProfile () {
    if (this.foreignersList?.length > 0 ) {
         const currentProfile = this.getCurrentProfile();
         if (currentProfile) {
           this.discoverService.setDisplayedProfile(currentProfile)
         }
    }
  }

  getProfilesListLength() {
    return this.foreignersList?.length;
  }

  getCurrentProfile() {
    const profileListLength = this.getProfilesListLength()
    return this.foreignersList[ profileListLength - 1 ];
  }


  skipFriend () {
     this.dropProfileFromForeignersList();
     this.setCurrentProfile();
     this.likeActionSourceSubscription.unsubscribe();
  }


  onSwipe(event: any, index: number) {

    this.currentIndex = index;

    if (!this.hidingTapStatus) return

    const isHorizontal = event.dirX === 'left' || event.dirX === 'right' ;
    const isVertical = event.dirY === 'up' || event.dirY === 'down';

    if (isHorizontal) {
       this.counterX += event.dirX === 'right' ? 1 : -1 ;

       if (this.rotateCounterX < 7) this.rotateCounterX += 0.3;
    }

    if (isVertical) {
      this.counterY += event.dirY === 'up' ? -1 : 1;
    }

    if (this.swipeState.left !== "pending" && this.swipeState.right !== "pending") {
      this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(-${this.rotateCounterX}deg)`;
    }

    if (event.swipeType === 'moveEnd') {
      this.resetSwipeState();
      this.likeWithHorizontalSwipe(event)
    }
  }

  private resetSwipeState() {
    this.transform = null;
    this.counterX = -50;
    this.counterY = -50;
    this.rotateCounterY = 0;
    this.rotateCounterX = 0;
  }

  dropProfileFromForeignersList() {
    if (this.foreignersList.length > 0) {
      this.foreignersList.pop();
      this.setForeignersListStatus();
    }
  }

  setForeignersListStatus() {
    if (this.foreignersList.length > 0) {
      this.foreignersListStatus = true
     // this.communityService.setForeignersListStatus('empty');
    } else {
      //this.communityService.setForeignersListStatus('full');
      this.foreignersListStatus = false;
    }
  }

  likeWithHorizontalSwipe(event: any){
    const clientCurrent = event.currentX;
    const clientStart = event.startX;
    const screenWidth = window.innerWidth;
    const quarterScreen = screenWidth / 4;

    const swipeDistance = clientCurrent - clientStart ;

    if (swipeDistance > quarterScreen) {
      this.addFriend();
    } else if (swipeDistance < -quarterScreen) {
      this.skipFriend();
    }
  }




  // Getter for the current profile
  removeProfileFromList(profileId: number): void {

    this.profilesToShare = this.profilesToShare.filter((profile:  { id: number, name: string, image: string }) => profile.id !== profileId);

   // Update currentIndex properly
   if (this.profiles.length === 0) {
    this.currentIndex = -1; // No profiles left
  } else {
    this.currentIndex = Math.min(this.currentIndex, this.profiles.length - 1);
  }

  console.log("Updated profiles:", this.profiles);
  console.log("New currentIndex:", this.currentIndex);
  }

  ngOnDestroy () {
    this.netWorkSubscription?.unsubscribe();
    this.foreignersSource?.unsubscribe();
    this.likeActionSourceSubscription?.unsubscribe();
    this.disLikeActionSourceSubscription?.unsubscribe();
    this.viewedProfileSubscription?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
  }
}
