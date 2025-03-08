import { Component, ElementRef, Input, ViewChild, SimpleChanges, OnChanges, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { DisableProfileSwipe, DiscoverService } from "../../services/discover.service";

import { Member } from "src/app/shared/interfaces/member.interface";
import { Subscription } from "rxjs";


@Component({
selector: "app-profile-swipe",
templateUrl: "./profile-swipe.component.html",
styleUrls: ["./profile-swipe.component.scss"],
standalone: false
})

export class ProfileSwipeComponent implements OnDestroy,AfterViewInit, OnChanges {
    @Input() profile!: Member;
    @Input() profileToView: DisableProfileSwipe | null = null;
    @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
    @ViewChild('ionListScroller', {static: false}) ionListScroller!: ElementRef;


    swipeStartPosition: number = 0; // Keeps track of the starting position of the swipe;
    currentTransformX: number = 0; // Keeps track of the current of the card
     isSwiping: boolean = false;
    isAnimating: boolean = false ;
    resetProfileTimer: any;
    //userImages: string [] = [];

    scrollPosition: number = 0;  // This will track the scroll position

    discoverProfileToggleSubscription!: Subscription;
    constructor(
      private discoverService: DiscoverService,
      ) {}

    ngOnChanges(changes: SimpleChanges): void {

      console.log(this.profile, "hello");
      this.profileToView
    }



    ngAfterViewInit() {
      // Ensure the list is accessed after view initialization
      if (this.ionListScroller) {
        // You can reset the scroll position when needed
        //this.resetScrollPosition();
      }

    }

    setProfileListStyle(isSwipeDisabled: DisableProfileSwipe | null): string {
      if (!isSwipeDisabled || this.profile?.user_id !== isSwipeDisabled.profile.user_id) {
        return 'profile-details-list';  // Return the default class if the condition doesn't match
      }
      console.log("hell ptof", isSwipeDisabled);
      if (isSwipeDisabled.disableSwipe) {
        return 'profile-details-list profile-details-list__enable-scroll';
      } else {

        return 'profile-details-list profile-details-list__disable-scroll ';
      }
    }

    // Method to handle scroll event
    onScroll(event: any): void {
      console.log(this.scrollPosition, "hello scoll postion")
      if (event.target.scrollTop !== 0) {
        //this.scrollPosition = event.target.scrollTop;  // Track scroll position when it's not at the top
      }
    }

    // Method to reset the scroll position when scrolling is enabled again
    resetScrollPosition(): void {
      this.scrollPosition = 0;
    }

    setProfileDetailsStyle(isSwipeDisabled: DisableProfileSwipe | null): string {
      if (this.profile?.user_id !== isSwipeDisabled?.profile.user_id)  return "details details__disable";
      if (!isSwipeDisabled.disableSwipe) {
          return  "details details__disable"
      }  else {
          return  "details details__enable"
      }

    }


    onSwipeLeft(event: any) {
     // if (this.isSwiping) return; // Prevent multiple swipes
      console.log("swipet left")
      this.animateSwipe('left');
      this.handleDislikeProfile();
    }

    onSwipeRight(event: any) {
      if (this.isAnimating || !this.profile) return;
      this.isAnimating = true;
      this.animateSwipe('right');
      this.handleLikeProfile(this.profile);
    }

    private animateSwipe(direction: 'left' | 'right') {

      if (! this.cardElement) return;
      const element = this.cardElement.nativeElement as HTMLElement | null;
      console.log(element, 'hello we dont find element')
      if (!element) return;
      // Apply swipe animation
      element.style.transition = 'transform 0.3s ease-out';
      const translateX = direction === "left" ? "-150vw" : "150vw";
      element.style.transform = `translateX(${translateX}) rotate(${direction === "left" ? "-5deg" : "5deg"})` ;
    }

   /*  onPan(event: any) {
      const element = this.cardElement.nativeElement as HTMLElement | null;
      if (!element) return;
      if (this.isSwiping) {
        this.currentTransformX = this.swipeStartPosition + event.deltaX;
        element.style.transform = `translateX(${this.currentTransformX}px) rotate(${this.currentTransformX / 30}deg)`;
      }
    } */

    // Start tracking the swipe position when pan starts
   /*  onPanStart (event: any) {
      this.isSwiping = true;
      this.swipeStartPosition = this.currentTransformX;
    }
 */
    // End the swipe pan is completed
    /* onPanEnd(event: any){
      this.isSwiping = false;
      // If the swipe is greater than 25% of the screen width, trigger the swipe actions
      const threshold = window.innerWidth / 4 ;
      if (this.currentTransformX > threshold) {
        this.onSwipeRight(event);
      }  else if (this.currentTransformX < -threshold) {
        this.onSwipeLeft(event);
      } else  {
        // Reset position if swipe was not significant enough
        this.resetProfilePosition()
      }
    } */

    // Treat like profile
    private handleLikeProfile(likedProfile: Member ) {
      console.log(likedProfile, "hello from herre")
      this.discoverService.likeProfile(likedProfile)
      .subscribe({
        error: () => this.resetProfilePosition()
      });
    }

    private resetProfilePosition() {
      if (this.resetProfileTimer) {
        clearTimeout(this.resetProfileTimer);
      }
      // Reset current transform
      this.currentTransformX = 0;
      this.resetProfileTimer = setTimeout(() => {
        const element =  this.cardElement.nativeElement as HTMLElement | null;
        if (element) {
         element.style.transition = 'transform 0.3s ease-out';
         element.style.transform = 'translateX(0) rotate(0)';
        }
      }, 100)
    }



    // Treat dislike profile
    private handleDislikeProfile() {
      this.resetProfilePosition();
    }


    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.discoverProfileToggleSubscription?.unsubscribe();
    }
}
