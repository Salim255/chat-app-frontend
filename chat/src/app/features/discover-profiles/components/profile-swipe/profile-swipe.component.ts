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


    isDisableHammerSwipe: boolean = true;
    constructor(
      private discoverService: DiscoverService,
      ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['profile']) {
          console.log(this.profile, "hello");
        }

      this.profileToView
    }

    setIsDisableHammerSwipe(profileToView:  DisableProfileSwipe| null ): boolean {
      if ( (this.profile.user_id === profileToView?.profile?.user_id ) &&  profileToView.disableSwipe) {
        return true;
      }
      return false
    }

    ngAfterViewInit() {
      // Ensure the list is accessed after view initialization
      if (this.ionListScroller) {
        // You can reset the scroll position when needed
        //this.resetScrollPosition();
      }

    }

    disableHammerSwiper(profileToView: DisableProfileSwipe | null): string {
      if (!profileToView || this.profile?.user_id !== profileToView.profile.user_id) {
        return 'hammer-swiper-container ';  // Return the default class if the condition doesn't match
      }
     // console.log("hell ptof", profileToView);
      if (profileToView.disableSwipe) {
        return 'hammer-swiper-container  hammer-swiper-container__disable-hammer-swipe';
      } else {

        return 'hammer-swiper-container ';
      }
    }

    // Method to handle scroll event
    onScroll(event: any): void {
     // console.log(this.scrollPosition, "hello scoll postion")
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
      this.discoverService.triggerDislikeProfile
      this.resetProfilePosition();
    }


    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.discoverProfileToggleSubscription?.unsubscribe();
    }
}
