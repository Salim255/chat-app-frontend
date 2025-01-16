import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { Foreigner } from '../../models/foreigner.model';

import { DataService } from 'src/app/services/data/data.service';
import { NetworkService } from 'src/app/services/network/network.service';
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
})

export class DiscoverPage implements OnInit, OnDestroy {
  isConnected: boolean= true;
  private foreignersSource!: Subscription;
  foreignersList: Array < Foreigner >

  viewedProfile : any;
  private viewedProfileSubscription!: Subscription;
  private likeActionSource!: Subscription;
  private disLikeActionSource!: Subscription;
  private tapHidingStatusSourceSubscription!: Subscription;

  hidingTapStatus: DisplayTap= 'show' ;

  transform: any = null;
  currentIndex:any= null;
  counterX:any = -50;
  counterY:any = -50;
  rotateCounterY= 0;
  rotateCounterX= 0;

  profilesImages: any;
  foreignersListStatus = false;
  swipeState: SwipeState = {
    left: 'confirmed',
    right: 'confirmed',
  };
  constructor (
     private discoverService: DiscoverService,
     private dataService: DataService,
     private networkService:  NetworkService,
     private tapService: TapService, private accountService: AccountService
    ) {
    this.foreignersList = []
  }

  ngOnInit () {

    this.networkService.getNetworkStatus().subscribe(isConnected => {
      this.isConnected = isConnected;

      if (isConnected) {
        this.profilesImages = this.dataService.getImages;

        this.likeActionSource = this.discoverService.getLikeProfileState.subscribe(state => {
          if (state ===  'skip') {
            this.skipFriend();
          } else if (state ===  'like') {
            this.addFriend();
            this.likeActionSource.unsubscribe();
          }
         });

         //
         this.foreignersSource = this.discoverService.getNoConnectedFriendsArray.subscribe( (data )=> {
          this.foreignersList = data;
          if (data) {
            this.setCurrentProfile();
            this.setForeignersListStatus();
          }
        });

        //
        this.viewedProfileSubscription = this.discoverService.getDisplayedProfile.subscribe(profile => {
          this.viewedProfile = profile
         })
      }
    })
  }

  ionViewWillEnter () {
     this.discoverService.fetchUsers().subscribe();
     this.tapHidingStatusSourceSubscription = this.tapService?.getHidingTapStatus?.subscribe(status => {
      this.hidingTapStatus = status;
    })

    this.accountService.fetchAccount().subscribe();
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
          this.likeActionSource.unsubscribe();
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



  skipFriend () {
     this.dropProfileFromForeignersList();
     this.setCurrentProfile();
     this.likeActionSource.unsubscribe();
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

    if (event.dirX === 'right') {

      this.counterX += 1;
      if (this.rotateCounterX< 7) {
        this.rotateCounterX += 0.3
      }

      if ( this.swipeState.left !== "pending" &&  this.swipeState.right !== "pending") {
        this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(-${this.rotateCounterX}deg)`;
      }


    } else if (event.dirX === 'left') {
      this.counterX -= 1;
      if (this.rotateCounterY < 7) {
        this.rotateCounterY += 0.3;
      }

       if ( this.swipeState.left !== "pending" &&  this.swipeState.right !== "pending") {
         this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(${this.rotateCounterY}deg)`;
       }
    } else if (event.dirY === 'up') {
      this.counterY--;
      this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(${this.rotateCounterY}deg)`
    } else if (event.dirY === 'down') {
      this.counterY++;
         this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(${this.rotateCounterY}deg)`
    }

    if (event.swipeType === 'moveEnd') {
      this.transform = null;
      this.counterX = -50;
      this.counterY = -50;
      this.rotateCounterY = 0;
      this.rotateCounterX = 0;
      this.likeWithHorizontalSwipe(event)
     }

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


    /* if ( clientCurrent  > (clientStart / 3) ) {
      console.log("Skip", clientCurrent , (clientStart / 4) );

      this.skipFriend();

    } else  if ( clientStart  < ( clientCurrent / 3)) {
        this.addFriend();
        console.log("add", clientCurrent , (clientStart / 4) );
    } */

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
    if (this.foreignersSource) {
      this.foreignersSource.unsubscribe()
    }
    if (this.likeActionSource) {
      this.likeActionSource.unsubscribe()
    }
    if (this.disLikeActionSource) {
      this.disLikeActionSource.unsubscribe()
    }
    if (this.tapHidingStatusSourceSubscription) {
      this.tapHidingStatusSourceSubscription.unsubscribe();
    }
    if (this.viewedProfileSubscription) {
      this.viewedProfileSubscription.unsubscribe()
    }
  }
}
