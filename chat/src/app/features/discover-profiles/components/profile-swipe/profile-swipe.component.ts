import { Component, ElementRef, Input, ViewChild, SimpleChanges, OnChanges } from "@angular/core";
import { DiscoverService } from "../../services/discover.service";
import { ItsMatchModalService } from "src/app/features/matches/services/its-match-modal.service";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { Member } from "src/app/shared/interfaces/member.interface";

@Component({
selector: "app-profile-swipe",
templateUrl: "./profile-swipe.component.html",
styleUrls: ["./profile-swipe.component.scss"],
standalone: false
})

export class ProfileSwipeComponent implements OnChanges {
    @Input() profile!: Member;
    @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
    swipeStartPosition: number = 0; // Keeps track of the starting position of the swipe;
    currentTransformX: number = 0; // Keeps track of the current of the card
    isSwiping: boolean = false;
    isAnimating: boolean = false ;
    resetProfileTimer: any;
    userImages: string [] = [];

    constructor(
       private discoverService: DiscoverService,
       private itsMatchModalService : ItsMatchModalService ) {}

    ngOnChanges(changes: SimpleChanges): void {
      this.setUserImages();
    }

    onSwipeLeft(event: any) {
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
      if (!element) return;
      // Apply swipe animation
      element.style.transition = 'transform 0.5s ease-out';
      const translateX = direction === "left" ? "-150vw" : "150vw";
      element.style.transform = `translateX(${translateX}) rotate(${direction === "left" ? "-5deg" : "5deg"})` ;
    }

    onPan(event: any) {
      const element = this.cardElement.nativeElement as HTMLElement | null;
      if (!element) return;
      if (this.isSwiping) {
        this.currentTransformX = this.swipeStartPosition + event.deltaX;
        element.style.transform = `translateX(${this.currentTransformX}px) rotate(${this.currentTransformX / 30}deg)`;
      }
    }

    // Start tracking the swipe position when pan starts
    onPanStart (event: any) {
      this.isSwiping = true;
      this.swipeStartPosition = this.currentTransformX;
    }

    // End the swipe pan is completed
    onPanEnd(event: any){
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
      }, 500)
    }

    private setUserImages (): void {
      if (!this.profile) return;
      if (this.profile.images?.length > 0) {
        this.userImages =  [...this.profile.images];
      } else {
        this.profile.avatar =  StringUtils.getAvatarUrl(this.profile.avatar)
        this.userImages.push(this.profile.avatar );
        this.userImages.push(this.profile.avatar );
      }
    }

    // Treat dislike profile
    private handleDislikeProfile() {
      this.resetProfilePosition();
    }
}
