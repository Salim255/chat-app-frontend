import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { InteractionBtnService } from 'src/app/features/discover/services/interaction-btn.service';
import * as Hammer from 'hammerjs';
import { SwipeDirection } from '../../discover.page';

@Directive({
  selector: '[appHammerSwipe]',
  standalone: false,
})
export class HammerSwipeDirective {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();
  @Output() profilePreview = new EventEmitter<void>();
  @Output() slideLeft = new EventEmitter<void>(); // images slider
  @Output() slideRight = new EventEmitter<void>(); // ===========

  private swipeStartPosition: number = 0;
  private currentTransformX: number = 0;
  private isSwiping: boolean = false;
  private isScrolling: boolean = false;
  private isHorizontalSwipe: boolean = false;
  private resetProfileTimer: ReturnType<typeof setTimeout> | null = null;
  private hammerInstance: HammerManager | null = null;

  constructor(
    private el: ElementRef,
    private interactionBtnService: InteractionBtnService
  ) {
    // Initialize Hammer instance
    this.hammerInstance = new Hammer(this.el.nativeElement);
  }

  @HostListener('panstart', ['$event'])
  onPanStart(event: HammerInput): void {
    this.swipeStartPosition = this.currentTransformX;
    // Determine if it's more horizontal or vertical movement
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      this.isHorizontalSwipe = true;
      this.isSwiping = true; // Start swipe
      //console.log("Swiping")
    } else {
      this.isHorizontalSwipe = false;
      this.isScrolling = true; // Enable vertical scrolling
      // console.log("Scolling")
    }
  }

  @HostListener('pan', ['$event'])
  onPan(event: HammerInput): void {
    const element = this.el.nativeElement;
    console.log(event)
    element.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px)`;
    if (!element) return;

    if (this.isSwiping) {
      this.currentTransformX = this.swipeStartPosition + event.deltaX;
      if (event.deltaX !== 0) {
        if (event.deltaX > 0)
          this.interactionBtnService.setActionDirection(SwipeDirection.SwipeRight);
        else this.interactionBtnService.setActionDirection(SwipeDirection.SwipeLeft);
      }
    } else if (this.isScrolling) {
       this.interactionBtnService.setActionDirection(SwipeDirection.SwipeUp);
    }
  }

  @HostListener('panend', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPanEnd(event: HammerInput): void {
    this.isSwiping = false;
    const cardWidth = this.el.nativeElement.offsetWidth; // Get the actual width of the card
    const threshold = cardWidth / 2; // Set swipe threshold as half of card width


    if (this.isHorizontalSwipe) {
      if (this.currentTransformX > threshold) {
        this.swipeRight.emit();
      } else if (this.currentTransformX < -threshold) {
        this.swipeLeft.emit();
      }
      this.resetProfilePosition();
    } else {
        const verticalThreshold = this.el.nativeElement.offsetHeight / 3; // Define vertical threshold based on card height
        if (event.deltaY > verticalThreshold) {
          //this.swipeDown.emit();
        } else if (event.deltaY < -verticalThreshold) {
          //this.swipeUp.emit();
        }
        this.resetProfilePosition();
    }

    this.isSwiping = false;
    this.isScrolling = false;
    this.isHorizontalSwipe = false;
    this.interactionBtnService.setActionDirection(null);
  }

 private resetProfilePosition(): void {
  if (this.resetProfileTimer) {
    clearTimeout(this.resetProfileTimer);
  }

  const element = this.el.nativeElement;
  if (!element) return;

  this.currentTransformX = 0;

  // Apply smooth return to center
  element.style.transition = 'transform 0.3s ease-out';
  element.style.transform = 'translateX(0) rotate(0)';

  // Use requestAnimationFrame for a smooth shake effect after position reset
  requestAnimationFrame(() => {
    setTimeout(() => {
      element.classList.add('shake');

      setTimeout(() => {
        element.classList.remove('shake');
      }, 300); // Duration of shake effect

    }, 310); // Small delay after transition ends
  });
}

}
