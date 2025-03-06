import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { GestureConfig, GestureController } from '@ionic/angular';

@Directive({
    selector: '[appSwipe]',
    standalone: false
})
export class SwipeDirective implements OnInit  {
  @Output() swipe = new EventEmitter<any>();

  swipeGesture = {
    name: 'swipe',
    enable:  true,
    interval: 250,
    threshold: 15,
    reportInterval: 'live',
    direction: ['left', 'right', 'up', 'down']
  };

  GESTURE_CREATED = false;
  moveTimeOut:any = null;
  isMoving: boolean = false;
  lastSwipingReport = null;

  constructor(private gestureCtrl: GestureController, private el: ElementRef) {

  }

  ngOnInit(): void {
    this.createGesture();
  }

  private createGesture() {
    if (this.GESTURE_CREATED) {
      return ;
    }
    const gestureY = this.gestureCtrl.create({
      gestureName: 'swipe-y',
      el: this.el.nativeElement,
      direction: 'y',
      threshold: this.swipeGesture.threshold,
      onStart: (event) => this.onStart(event),
      onMove: (event) => this.onMove(event),
      onEnd: (event) => this.onEnd(event)
    }, true);

    const gestureX = this.gestureCtrl.create({
      gestureName: 'swipe-x',
      el: this.el.nativeElement,
      direction: 'x',
      threshold: this.swipeGesture.threshold,
      onStart: (event) => this.onStart(event),
      onMove: (event) => this.onMove(event),
      onEnd: (event) => this.onEnd(event)
    }, true);


    gestureX.enable();
    gestureY.enable();


    this.GESTURE_CREATED = true;
  }

  private onStart(event: any) {

    this.isMoving = true;
    this.moveTimeOut = setInterval(() => {
        this.isMoving = false
    }, 249)

  }

  private onMove(event: any) {






    if (this.swipeGesture.enable) {
      this.handleMoving('moving', event)
    }
  }

  private onEnd(event: any) {

    if (this.swipeGesture.enable) {
      this.handleMoving('moveEnd', event)
    }
  }

  private handleMoving(moveType:string, event: any) {
    if (this.moveTimeOut !== null) {
      clearTimeout(this.moveTimeOut);
      this.moveTimeOut = null;
    }

    const deltaX = event.deltaX;
    const deltaY = event.deltaY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const threshold = this.swipeGesture.threshold;

    if ( absDeltaX < threshold && absDeltaY < threshold) {
        return
    }

    const shouldReport = this.isMoving && (
      (this.swipeGesture.reportInterval === 'start' && this.lastSwipingReport === null)||
      this.swipeGesture.reportInterval === 'live' ||
      (this.swipeGesture.reportInterval === 'end' && moveType === 'moveEnd')

    );


    this.lastSwipingReport = event.timeStamp;
    if (shouldReport) {
      let emitObj = {
        dirX: undefined,
        dirY: undefined,
        swipeType: moveType,
        ...event
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
          emitObj.dirY = 'down'
        } else if (deltaY < 0) {
          emitObj.dirY = 'up'
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
