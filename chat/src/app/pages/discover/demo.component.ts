import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Foreigner } from "src/app/models/foreigner.model";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"],
  standalone: false
})

export class DemoComponent implements OnInit {
  @Input() profile!: Foreigner;
  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;

  swipeStartPosition: number = 0; // Keeps track of the starting position of the swipe;
  currentTransformX: number = 0; // Keeps track of the current of the card
  isSwiping: boolean = false;
  isAnimating: boolean = false ;
  resetProfileTimer: any;
  constructor(private discoverService: DiscoverService) {}



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.profile, "Hello from demo")
  }


  onSwipeLeft(event: any) {
    console.log(`${this.currentProfile} rejected ❌`, event);
    this.animateSwipe('left');
    this.onDislikeProfile();
  }

  onSwipeRight(event: any) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    console.log(`${this.currentProfile.id} liked ❤️`);
    this.animateSwipe('right');
    this.handleLikeProfile(this.currentProfile.id);
  }

  private animateSwipe(direction: 'left' | 'right') {
    if (! this.cardElement) return;

    const element = this.cardElement.nativeElement as HTMLElement | null;
    if (!element) return;

    // Apply swipe animation
    element.style.transition = 'transform 0.5s ease-ut';
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
    console.log('Hello from ll 1💥💥', this.currentProfile)
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
      this. resetProfilePosition()
    }
  }

  // Treat like profile
  private handleLikeProfile(profileId: number) {
    this.discoverService.likeProfile(profileId)
    .subscribe({
      next:(response) => {
          this.discoverService.setProfileToRemove(this.currentProfile.id);
      },
      error: () => this.resetProfilePosition()
    });
  }

  private resetProfilePosition() {
    if (this.resetProfileTimer) {
      clearTimeout(this.resetProfileTimer);
    }

    // Rest current transform
    this.currentTransformX = 0;

    this.resetProfileTimer = setTimeout(() => {
      const element =  this.cardElement.nativeElement as HTMLElement | null;
      if (element) {
       element.style.transition = 'transform 0.3s ease-out';
       element.style.transform = 'translateX(0) rotate(0)';
      }
    }, 500)

  }

   // Getter for the current profile
   get currentProfile() {
    return this.profile;
  }

  // Treat dislike profile
  private onDislikeProfile() {
    // this.discoverService.setProfileToRemove(this.currentProfile.id);
     this.resetProfilePosition();
  }
}
