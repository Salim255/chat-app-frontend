import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';

// Allows to inject the class inside angular app dependencies
@Injectable()

export class CustomHammerConfig extends HammerGestureConfig {

  // Override allows to replace the default configuration
  // with our parameters
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL }, // Enable horizontal swipe
    pan: { direction: Hammer.DIRECTION_VERTICAL, threshold: 10, velocity: 0.2 }, // Enable vertical pan/scroll

  };
}
