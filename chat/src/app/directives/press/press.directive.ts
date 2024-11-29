import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appPress]'
})
export class PressDirective implements OnInit {
  @Output() press = new EventEmitter();

  pressGesture = {
    name: 'press',
    enable:  false,
    interval: 251,
  };

  pressTimeOut:any = null;
  isPressing: boolean = false;
  lastTap = 0;
  tapCount = 0;
  tapTimeOut: any = null;

  constructor() { }

  ngOnInit(): void {
    this.pressGesture.enable = true
    console.log("Hello Joko");
  }

  @HostListener('touchstart', ['$event'] )
  @HostListener('touchend', ['$event'] )
  onPress (e: any) {
      if (!this.pressGesture.enable) {
          return
      } // Press is not enabled don't do anything
      this.handlePressing(e.type)
  }

  private handlePressing(type:any) { // touched or touchstart

    if (type === 'touchstart') {
      this.pressTimeOut = setTimeout(() => {
        this.isPressing = true;
        this.press.emit('start');
      })
    } else if (type === 'touchend') {
      clearTimeout(this.pressTimeOut);

      if (this.isPressing) {
        this.press.emit('end');
        this.resetTaps();
      }

      setTimeout(() => this.isPressing = false, 50);
    }
  }

  private resetTaps() {
    clearTimeout(this.tapTimeOut);
    this.tapCount = 0;
    this.tapTimeOut = null;
    this.lastTap = 0
  }
}
