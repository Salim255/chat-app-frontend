import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type gestureName = 'tap' | 'doubleTap' | 'press' | 'swipe';
export type directionNames = 'up' | 'down' | 'left' | 'right' ;
export type reportInterval = 'start' | 'live' | 'end' ;

export interface Gesture {
  name: gestureName;
  interval?: number;
  enabled?: boolean;
  direction?: directionNames[];
  threshold?: number;
  reportInterval?: reportInterval;
}

@Directive({
  selector: '[appGesture]'
})
export class GestureDirective implements OnInit {
  @Input() gestureOpts!: Gesture[];

  // Event we can listen to

  @Output() tap = new EventEmitter();
  @Output() doubleTap = new EventEmitter();
  @Output() press = new EventEmitter();
  @Output() swipe = new EventEmitter();

  tapGesture: Gesture = {
    name: 'tap',
    enabled: false,
    interval: 250
  };

  doubleTapGesture: Gesture = {
    name: 'doubleTap',
    enabled: false,
    interval: 250
  };

  pressGesture: Gesture = {
    name: 'press',
    enabled: false,
    interval: 251,
  }

  swipeGesture: Gesture = {
    name: 'swipe',
    enabled: false,
    interval: 250,
    threshold: 15,
    reportInterval: undefined,
    direction: []
  }
  constructor() { }

  ngOnInit(): void {
      console.log("HELLO");
  }
}
