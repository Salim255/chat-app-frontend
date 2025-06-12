import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { InteractionBtnService } from '../services/interaction-btn.service';
import { SwipeDirection } from '../discover.page';


@Directive({
  selector: '[appSwipeGesture]',
  standalone: false
})
export class SwipeGestureDirective implements AfterViewInit {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();
  @Output() swipeUp = new EventEmitter<void>();
  @Output() swipeDown = new EventEmitter<void>();

  private currentTransformX = 0;
  private isSwiping = false;
  private isHorizontalSwipe = false;
  private resetProfileTimer: ReturnType<typeof setTimeout> | null = null;

   private currentDirection: SwipeDirection | null = null;
  constructor(
    private interactionBtnService: InteractionBtnService,
    private el: ElementRef,
    private gestureCtrl: GestureController) {}

  ngAfterViewInit(): void {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      gestureName: 'swipe',
      threshold: 0,
      onStart: (ev) => this.onSwipeStart(ev),
      onMove: (ev) => this.onSwipeMove(ev),
      onEnd: (ev) => this.onSwipeEnd(ev),
    });

    gesture.enable();
  }

  private onSwipeStart(event: any): void {
    this.isSwiping = true;
    this.currentTransformX = event.deltaX;
    this.isHorizontalSwipe = Math.abs(event.deltaX) > Math.abs(event.deltaY);
  }

private onSwipeMove(event: any): void {
  const element = this.el.nativeElement;
  const cardRect = element.getBoundingClientRect();
  const containerRect = element.parentElement.getBoundingClientRect();

  // Apply translation
  const deltaX = event.deltaX;
  const deltaY = event.deltaY;
  element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  let newDirection: SwipeDirection | null = null;

  // Check if card's bottom is above the middle of the container
  const containerMiddleY = containerRect.top + containerRect.height / 2;
  const cardBottom = cardRect.bottom;

  if (cardBottom <= containerMiddleY) {
    // newDirection = SwipeDirection.SwipeUp;
    newDirection = SwipeDirection.SwipeRight;
  } else {
    // Otherwise, decide based on movement delta
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      newDirection = deltaX > 0 ? SwipeDirection.SwipeRight : SwipeDirection.SwipeLeft;
    } else {
      //newDirection = deltaY > 0 ? SwipeDirection.SwipeDown : SwipeDirection.SwipeUp;
      newDirection = deltaY > 0 ? SwipeDirection.SwipeLeft : SwipeDirection.SwipeRight;
    }
  }

  // Set direction if changed
  if (this.currentDirection !== newDirection) {
    this.currentDirection = newDirection;
    this.interactionBtnService.setActionDirection(newDirection);
    console.log('Direction:', newDirection);
  }
}



  private onSwipeEnd(event: any): void {
    const element = this.el.nativeElement;
    const cardWidth = element.offsetWidth;
    const threshold = cardWidth / 2;
    const verticalThreshold = element.offsetHeight / 3;

    if (this.isHorizontalSwipe) {
      if (event.deltaX > threshold) this.swipeRight.emit();
      else if (event.deltaX < -threshold) this.swipeLeft.emit();
    } else {
      if (event.deltaY > verticalThreshold) this.swipeLeft.emit() /* this.swipeDown.emit() */;
      else if (event.deltaY < -verticalThreshold)  this.swipeRight.emit()/* this.swipeUp.emit() */;
    }

    this.currentDirection = null;
    this.resetProfilePosition();
  }

  private resetProfilePosition(): void {
  const element = this.el.nativeElement;

  // Reset position smoothly
  element.style.transition = 'transform 0.2s ease-out';
  element.style.transform = 'translateX(0) translateY(0) rotate(0)';

  // Wait for the transform to finish before shaking
  setTimeout(() => {
    element.classList.add('shake');
    this.interactionBtnService.setActionDirection(null);
    // Remove class after animation ends to allow re-adding it later
    setTimeout(() => {
      element.classList.remove('shake');
    }, 300); // match this with your animation duration
  }, 310); // wait a bit more than the transform duration
}
}
