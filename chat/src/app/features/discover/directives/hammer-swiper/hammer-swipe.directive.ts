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
    //this.isSwiping = true;
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
    if (!element) return;

    if (this.isSwiping) {
      this.currentTransformX = this.swipeStartPosition + event.deltaX;
      if (event.deltaX !== 0) {
        if (event.deltaX > 0)
          this.interactionBtnService.setActionDirection(SwipeDirection.SwipeRight);
        else this.interactionBtnService.setActionDirection(SwipeDirection.SwipeLeft);
      }
      element.style.transform =
      `translateX(${this.currentTransformX}px) rotate(${this.currentTransformX / 30}deg)`;
    } else if (this.isScrolling) {
      // Allow vertical scrolling
      element.style.transform = `translateY(${event.deltaY}px)`;
       this.interactionBtnService.setActionDirection(SwipeDirection.SwipeUp);
    }
  }

  @HostListener('panend', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPanEnd(event: HammerInput): void {
    this.isSwiping = false;

    const threshold = window.innerWidth / 4;

    if (this.isHorizontalSwipe) {
      if (this.currentTransformX > threshold) {
        this.swipeRight.emit();
      } else if (this.currentTransformX < -threshold) {
        this.swipeLeft.emit();
      }
      this.resetProfilePosition();
    } else {
      // If it's vertical scroll, allow scrolling to happen naturally
      if (!this.isSwiping) {
        const element = this.el.nativeElement;
        element.style.transform = `translateY(0)`;
      }
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
    this.currentTransformX = 0;
    this.resetProfileTimer = setTimeout(() => {
      const element = this.el.nativeElement;
      if (element) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'translateX(0) rotate(0)';
      }
    }, 300);
  }
}
