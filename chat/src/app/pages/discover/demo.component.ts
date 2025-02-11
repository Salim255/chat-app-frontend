import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"],
  standalone: false
})

export class DemoComponent {
  @Input() profile!: { id: number; name: string; image: string };
  swipeStartPosition: number = 0; // Keeps track of the starting position of the swipe;
  currentTransformX: number = 0; // Keeps track of the current of the card
  isSwiping: boolean = false;
  isAnimating: boolean = false ;

  constructor(private discoverService: DiscoverService) {}

  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef; // 👈 This now references the correct card


  // Getter for the current profile
  get currentProfile() {
    return this.profile;
  }

  onSwipeLeft(event: any) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    console.log(`${this.currentProfile} rejected ❌`, event);
    this.animateSwipe('left');
  }

  onSwipeRight(event: any) {
    console.log(event)
    if (this.isAnimating) return;
    this.isAnimating = true;
    console.log(`${this.currentProfile.id} liked ❤️`);
    this.animateSwipe('right');
  }

  private animateSwipe(direction: 'left' | 'right') {
    if (! this.cardElement) return;

    const element = this.cardElement.nativeElement as HTMLElement;
    if (!element) return;

    // Apply swipe animation
    element.style.transition = 'transform 0.5s ease-ut';
    const translateX = direction === "left" ? "-150vw" : "150vw";

    element.style.transform = `translateX(${translateX}) rotate(${direction === "left" ? "-5deg" : "5deg"})` ;
  }

  onPan(event: any) {
      if (! this.cardElement) return;

      const element = this.cardElement.nativeElement as HTMLElement;

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
      const element =  this.cardElement.nativeElement as HTMLElement;

       if (element) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'translateX(0) rotate(0)';
      }
    }
    // Remove profile
    this.discoverService.setProfileToRemove(this.currentProfile.id);
  }
}
