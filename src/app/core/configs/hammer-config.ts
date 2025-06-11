import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

// Allows to inject the class inside angular app dependencies
@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  // Override allows to replace the default configuration
  // with our parameters
  override overrides = {
    /*     swipe: { direction: 31 }, // Enable horizontal swipe */
    pan: {
      direction: 31, // Enable horizontal + vertical pan
      threshold: 1, // Lower threshold for faster reaction
      velocity: 0.1, // Reduce required velocity to trigger
      enable: true, // Ensure gesture is enabled
    }, // Enable vertical pan/scroll
  };
}
