import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type animationType = 'like' | 'dislike' | 'none';

@Injectable({
  providedIn: 'root'
})

export class AnimationService {
  private animationSource = new BehaviorSubject<any>(null);

  constructor() {}

 animationListener( animationType: animationType) {
    this.animationSource.next(animationType);
 }

 get getAnimation() {
  return  this.animationSource.asObservable()
 }
}
