import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";

// Allows to inject the class inside angular app dependencies
@Injectable()

export class CustomHammerConfig extends HammerGestureConfig {

  // Override allows to replace the default configuration
  // with our parameters
  override overrides = {
    swipe: { direction: 31 }, // Enable all directions
    pan: { threshold: 10, velocity: 0.2}
  };
}
