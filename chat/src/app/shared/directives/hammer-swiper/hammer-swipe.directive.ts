import { Directive, ElementRef, HostListener, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as Hammer from 'hammerjs';
@Directive({
  selector: '[appHammerSwipe]',
  standalone: false
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
  private isAnimating: boolean = false;
  private resetProfileTimer: any;
  private hammerInstance: HammerManager | null = null;
  constructor(private el: ElementRef) {
    // Initialize Hammer instance
   this.hammerInstance =  new Hammer(this.el.nativeElement);
  }


  @HostListener('panstart', ['$event'])
  onPanStart(event: any): void {
    console.log(event, "Hello start")
    //this.isSwiping = true;
    this.swipeStartPosition = this.currentTransformX;

    // Determine if it's more horizontal or vertical movement
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      this.isHorizontalSwipe = true;
      this.isSwiping = true;  // Start swipe
      //console.log("Swiping")
    } else {

      this.isHorizontalSwipe = false;
      this.isScrolling = true;  // Enable vertical scrolling
     // console.log("Scolling")
    }
  }

  @HostListener('pan', ['$event'])
  onPan(event: any): void {
    console.log("Panning")
    const element = this.el.nativeElement;
    if (!element) return;
   /*  if (this.isSwiping) {
      this.currentTransformX = this.swipeStartPosition + event.deltaX;
      element.style.transform = `translateX(${this.currentTransformX}px) rotate(${this.currentTransformX / 30}deg)`;
    } */

    if (this.isSwiping) {
      this.currentTransformX = this.swipeStartPosition + event.deltaX;
      element.style.transform = `translateX(${this.currentTransformX}px) rotate(${this.currentTransformX / 30}deg)`;
    } else if (this.isScrolling) {
      // Allow vertical scrolling
      element.style.transform = `translateY(${event.deltaY}px)`;
    }
  }

  @HostListener('panmove', ['$event'])
  OnPanMove(event: any): void {
    console.log(event)
  }

  @HostListener('panend', ['$event'])
  onPanEnd(event: any): void {
    console.log(event, 'enendndndnd')
    this.isSwiping = false;

    const threshold = window.innerWidth / 4;
    if (this.currentTransformX > threshold) {
      this.swipeRight.emit();
    } else if (this.currentTransformX < -threshold) {
      //console.log("pans end  left called😍😍")
      this.swipeLeft.emit();
    } else {
      this.resetProfilePosition();
    }

    if (this.isHorizontalSwipe) {
      // For horizontal swipes (left or right)
      if (this.currentTransformX > threshold) {
        this.swipeRight.emit();
      } else if (this.currentTransformX < -threshold) {
        this.swipeLeft.emit();
      } else {
        this.resetProfilePosition();
      }
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
  }

  @HostListener('click', ['$event'])
  onClickProfile(event: MouseEvent): void {

    const clickedElement = event.target as HTMLElement;
    const swiperContainer = clickedElement?.querySelector('swiper-container');

    if ( !swiperContainer)  return;

    const cardWidth = swiperContainer?.clientWidth;
    const cardHeight = swiperContainer?.clientHeight;
    const clientY = event.clientY;

    if (!cardWidth  || !cardHeight) return;

    const lastQuarterY = cardHeight * 0.75; // last quarter (3/4 of the height)

    // Check if click is in the last quarter of the card
    if (clientY > lastQuarterY) {
      console.log("Hello2")
        this.profilePreview.emit(); // Trigger profile preview
        return; // Exit to avoid sliding action
    }
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
    }, 500);
  }
}
