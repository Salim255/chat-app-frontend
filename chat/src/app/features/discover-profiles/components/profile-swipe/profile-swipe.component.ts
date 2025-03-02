import { Component, ElementRef, Input, ViewChild, AfterViewInit, SimpleChanges, OnChanges, OnInit } from "@angular/core";
import { DiscoverService } from "../../services/discover.service";
import { IonicSlides } from "@ionic/angular";
import { Swiper } from "swiper/types";
import { ItsMatchModalService } from "src/app/features/matches/services/its-match-modal.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { ProfileUtils } from "src/app/shared/utils/profiles-utils";
import { Member } from "src/app/shared/interfaces/member.interface";

@Component({
selector: "app-profile-swipe",
templateUrl: "./profile-swipe.component.html",
styleUrls: ["./profile-swipe.component.scss"],
standalone: false
})

export class ProfileSwipeComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() profile!: Member;
    @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
    @ViewChild('swiperContainer', {static: false} ) swiperContainer!: ElementRef;


    swiperModules= [IonicSlides];

    swiperOptions = {
      pagination: { clickable: true },
      allowTouchMove: false,  // Disable Swiper's internal swipe handling
    };
    swiper!: Swiper; // Store Swiper instance


    swipeStartPosition: number = 0; // Keeps track of the starting position of the swipe;
    currentTransformX: number = 0; // Keeps track of the current of the card
    isSwiping: boolean = false;
    isAnimating: boolean = false ;
    resetProfileTimer: any;
    userImages: string [] = [];


    constructor(
       private discoverService: DiscoverService,
       private itsMatchModalService : ItsMatchModalService ) {}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      console.log(this.profile, "hello")
    }
    ngOnChanges(changes: SimpleChanges): void {

      this.setUserImages();
    }

    ngAfterViewInit(): void {
      this.swiper = this.swiperContainer.nativeElement.swiper;
    }

    onProfileClick(event: MouseEvent) {
      const clientX = event.clientX;
      const cardWidth = this.cardElement.nativeElement.offsetWidth;

      if (cardWidth === null || cardWidth === undefined) return;

      const cardCenter = cardWidth / 2;

     ( clientX < cardCenter) ? this.slideLeft(): this.slideRight() ;
    }

    private slideLeft() {
      if (this.swiper) this.swiper.slidePrev();
    }

    private slideRight() {
      if (this.swiper) this.swiper.slideNext()
    }

    onSwipeLeft(event: any) {
      this.animateSwipe('left');
      this.handleDislikeProfile();
    }

    onSwipeRight(event: any) {
      if (this.isAnimating) return;

      this.isAnimating = true;

      this.animateSwipe('right');
      this.handleLikeProfile(this.currentProfile.id);
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
    private handleLikeProfile(profileId: number) {
      this.discoverService.likeProfile(profileId)
      .subscribe({
        next:(response) => {
          this.discoverService.setProfileToRemove(this.currentProfile.id);

          if (response?.data && response.data.status === 2 ) {
            const matchedData: Partner = ProfileUtils.setProfileData(this.profile);
            this.itsMatchModalService.openItsMatchModal(matchedData);
          }
        }
        ,
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

     // Getter for the current profile
     get currentProfile() {
      return this.profile;
    }

    // Treat dislike profile
    private handleDislikeProfile() {
      this.resetProfilePosition();
    }
}
