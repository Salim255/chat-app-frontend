import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CommunityService } from 'src/app/services/community/community.service';
import { Foreigner } from 'src/app/models/foreigner.model';
import { AnimationService } from 'src/app/services/animation/animation.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit, OnDestroy {

  private foreignersSource!: Subscription;
  foreignersList: Array < Foreigner >

  private likeActionSource!: Subscription;
  private disLikeActionSource!: Subscription;
  transform: any = null;
  currentIndex:any= null;
  counterX:any = -50;
  counterY:any = -50;
  rotateCounterY= 0;
  rotateCounterX= 0;

  profilesImages: any;

  constructor (
     private communityService: CommunityService,
     private animationService: AnimationService,
     private dataService: DataService
    ) {
    this.foreignersList = []
  }

  ngOnInit () {
    this.profilesImages = this.dataService.getImages;
    console.log(this.profilesImages);

    this.likeActionSource = this.communityService.getLikeProfileState.subscribe(state => {
      if (state ===  'skip') {
        this.skipFriend()
      } else if (state ===  'like') {
        this.addFriend();
      }
     });

    this.foreignersSource = this.communityService.      getNoConnectedFriendsArray.subscribe( (data )=> {
      this.foreignersList = data;
      if (data) {
        this.setCurrentProfile();
      }

    })
  }

  ionViewWillEnter () {


     this.communityService.fetchUsers().subscribe()
  }

  addFriend(){
    const foreigner =  this.getCurrentProfile();

    if (foreigner?.id) {
      let addFriendObs: Observable<any>
      addFriendObs = this.communityService.addFriend(foreigner.id);

      addFriendObs.subscribe({
        error: () => {
          console.log("error");
        },
        next: () => {
          this.foreignersList.pop();
          this.setCurrentProfile();
        }
     })
    }
  }

  setCurrentProfile () {
    if (this.foreignersList?.length > 0 ) {
         const currentProfile = this.getCurrentProfile();
         if (currentProfile) {
           this.communityService.setDisplayedProfile(currentProfile)
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
    this.foreignersList.pop();
    this.setCurrentProfile();
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

    if (event.dirX === 'right') {
      this.counterX += 1;
      if (this.rotateCounterX< 7) {
        this.rotateCounterX += 0.3
      }
      this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(-${this.rotateCounterX}deg)`;
      this.animationService.animationListener('like');

    } else if (event.dirX === 'left') {
      this.counterX -= 1;
      if (this.rotateCounterY < 7) {
        this.rotateCounterY += 0.3;
      }
       this.transform = `translateX(${this.counterX}%) translateY(${this.counterY}%) rotate(${this.rotateCounterY}deg)`;
       this.animationService.animationListener('dislike');
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
      this.animationService.animationListener('none');
     }

  }
}
