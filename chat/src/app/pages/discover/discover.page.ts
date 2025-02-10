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
  currentIndex: number | null = null;
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

  private foreignersSource!: Subscription;
  private viewedProfileSubscription!: Subscription;
  private likeActionSourceSubscription!: Subscription;
  private disLikeActionSourceSubscription!: Subscription;
  private tapHidingStatusSourceSubscription!: Subscription;
  private netWorkSubscription!: Subscription;

  constructor (
     private discoverService: DiscoverService,
     private networkService:  NetworkService,
     private tapService: TapService, private accountService: AccountService
    ) {}

  ngOnInit () {
    this.subscribeNetwork();
  }

  ionViewWillEnter () {
    this.discoverService.fetchUsers().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  private subscribeNetwork() {
    this.netWorkSubscription = this.networkService.getNetworkStatus().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (isConnected) {
          this.handleLikeDislikeSubscription();
          this.loadForeignersList();
          this.trackViewedProfile();
          this.subscribeHideTaps();
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

  private subscribeHideTaps() {
    this.tapHidingStatusSourceSubscription = this.tapService?.getHidingTapStatus?.subscribe(status => {
      this.hidingTapStatus = status;
    })
  }


  addFriend(){
    const foreigner =  this.getCurrentProfile();
    this.updateSwipeStatus('right', 'pending' );
    if (foreigner?.id) {
      let addFriendObs: Observable<any>
      addFriendObs = this.discoverService.addFriend(foreigner.id);

      addFriendObs.subscribe({
        error: () => {
          console.log("error");
          this.updateSwipeStatus('right', 'rejected' );
        },
        next: () => {
          this.dropProfileFromForeignersList();
          this.setCurrentProfile();
          this.likeActionSourceSubscription.unsubscribe();
          this.updateSwipeStatus('right', 'confirmed' );
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

  trackById(index: number, item: Foreigner): number {
    return item.id;
  }


  skipFriend () {
     this.dropProfileFromForeignersList();
     this.setCurrentProfile();
     this.likeActionSourceSubscription.unsubscribe();
  }



  onTap(event: any){
        console.log('tap: ', event);
  }

  onDoubleTap(event: any) {
    console.log('double Tap: ', event);
  }

  onPress(event: any) {
    console.log('====================================');
    console.log('pressed', event);
    console.log('====================================');
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

  updateSwipeStatus(direction: 'left' | 'right' , status: SwipeStatus) {
    this.swipeState[direction] =  status;
    console.log('====================================');
    console.log(this.swipeState);
    console.log('====================================');
    return;
  }

  ngOnDestroy () {
    this.netWorkSubscription?.unsubscribe();
    this.foreignersSource?.unsubscribe();
    this.likeActionSourceSubscription?.unsubscribe();
    this.disLikeActionSourceSubscription?.unsubscribe();
    this.tapHidingStatusSourceSubscription?.unsubscribe();
    this.viewedProfileSubscription?.unsubscribe();
  }
}
