import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit  {
  @Output() swipe = new EventEmitter();

  swipeGesture = {
    name: 'swipe',
    enable:  false,
    interval: 250,
    threshold: 15,
    reportInterval: undefined,
    direction: ['', '']
  };

  GESTURE_CREATED = false;
  moveTimeOut:any = null;
  isMoving: boolean = false;
  lastSwipingReport = null;

  constructor(private gestureCtrl: GestureController, private el: ElementRef) {

  }

  ngOnInit(): void {
    this.swipeGesture.enable = true;
    this.swipeGesture.direction = ['left', 'right'];
    this.createGesture();
  }

  private createGesture() {
    if (this.GESTURE_CREATED) {
      return ;
    }

    const gesture = this.gestureCtrl.create({
      gestureName: 'swipe-gesture',
      el: this.el.nativeElement,
      onStart: () => {
        if (this.swipeGesture.enable) {
          this.isMoving = true;
          this.moveTimeOut = setInterval(() => {
            this.isMoving = false
          }, 249)
        }
      },

      onMove: ($event) => {
        if (this.swipeGesture.enable) {
          this.handleMoving('moving', $event)
        }
      },

      onEnd: ($event) => {
        if (this.swipeGesture.enable) {
          this.handleMoving('moveEnd', $event)
        }
      },
    }, true);

    gesture.enable();
    this.GESTURE_CREATED = true;
  }

  private handleMoving(moveType:string, $event: any) {
    if (this.moveTimeOut !== null) {
      clearTimeout(this.moveTimeOut);
      this.moveTimeOut = null;
    }

    const deltaX = $event.deltaX;
    const deltaY = $event.deltaY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const reportInterval = this.swipeGesture.reportInterval || 'live';
    const threshold = this.swipeGesture.threshold;

    if ( absDeltaX < threshold && absDeltaY < threshold) {
        return
    }

    const shouldReport = this.isMoving &&
    (
      (reportInterval === 'live') ||
      (reportInterval === 'end' && moveType === 'movedEnd')||
      (reportInterval === 'start' && this.lastSwipingReport === null)
    );

    this.lastSwipingReport = $event.timeStamp;
    if (shouldReport) {
      let emitObj = {
        dirX: undefined,
        dirY: undefined,
        swipeType: moveType,
        ...$event
      };

      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          emitObj.dirX = 'right';
        } else if (deltaX < 0) {
          emitObj.dirX = 'left';
        }
      }
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          emitObj.dirY = 'up'
        } else if (deltaY < 0) {
          emitObj.dirY = 'down'
        }
      }

      const  dirArray  = this.swipeGesture.direction;
      if (dirArray.includes(emitObj.dirX) || dirArray.includes(emitObj.dirY)){
          this.swipe.emit(emitObj);
      }
    }

    if (moveType === 'moveEnd' && this.lastSwipingReport !== null) {
      this.isMoving = false;
      this.lastSwipingReport = null;
    }
  }
}
