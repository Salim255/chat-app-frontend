import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appTap]',
  standalone: false,
})
export class TapDirective implements OnInit {
  @Output() tap = new EventEmitter();
  @Output() doubleTap = new EventEmitter();
  @Output() tapSide = new EventEmitter<string>();

  lastTap = 0;
  tapCount = 0;
  tapTimeOut: any = null;

  tapGesture = {
    name: 'tap',
    enabled: false,
    interval: 250,
  };

  doubleTapGesture = {
    name: 'doubleTap',
    enabled: false,
    interval: 300,
  };

  constructor() {}

  ngOnInit(): void {
    this.tapGesture.enabled = true;
    this.doubleTapGesture.enabled = true;
  }

  @HostListener('click', ['$event'])
  handelTaps(e: any) {
    if (e?.view?.innerWidth && e?.clientX) {
      this.getClientTapSide(e.view.innerWidth, e.clientX);
    }

    const tapTimeStamp = Math.floor(e.timeStamp);
    const isDoubleTap = this.lastTap + this.tapGesture.interval > tapTimeStamp;

    if (!this.tapGesture.enabled && !this.doubleTapGesture.enabled) {
      return this.resetTaps();
    }

    this.tapCount++;

    if (isDoubleTap && this.doubleTapGesture.enabled) {
      this.emitTaps();
    } else if (!isDoubleTap) {
      this.tapTimeOut = setTimeout(() => this.emitTaps(), this.tapGesture.interval);
    }

    this.lastTap = tapTimeStamp;
  }

  private emitTaps() {
    if (this.tapCount === 1 && this.tapGesture.enabled) {
      this.tap.emit();
    } else if (this.tapCount === 2 && this.doubleTapGesture.enabled) {
      this.doubleTap.emit();
    }
    this.resetTaps();
  }

  private resetTaps() {
    clearTimeout(this.tapTimeOut);
    this.tapCount = 0;
    this.tapTimeOut = null;
    this.lastTap = 0;
  }

  getClientTapSide(screenWidth: number, clickPosition: number) {
    if (screenWidth / 2 <= clickPosition) {
      this.tapSide.emit('right');
    } else {
      this.tapSide.emit('left');
    }
  }
}
