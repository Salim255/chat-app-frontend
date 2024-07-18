import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimationService } from 'src/app/services/animation/animation.service';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent implements OnInit, OnDestroy {
  @Input() foreigner!: any;
  @Input() lastProfileIndex: any;
  @Input() profileIndex: any;
  @Input() profileImages: any;

  swipeDirection: any = null;

  private animationEventSource!: Subscription;
  animationType: any = null;
  constructor (private renderer: Renderer2, private animationService: AnimationService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
      if (this.profileImages) {
        this.foreigner.images = this.profileImages
      }
      this.animationEventSource = this.animationService.getAnimation.subscribe(event => {
        console.log(event);
        if (event) {
          this.animationType = event
        }

      })
  }


  getAnimationStyle(animationType: string) {
     if (animationType === 'like') return 'animation-section animation-section__like';
     else if (animationType === 'dislike') return 'animation-section animation-section__dislike';
     else return;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
     if (this.animationEventSource) {
      this.animationEventSource.unsubscribe()
     }
  }

  onTapSide(side: any) {
    console.log('Tabess 🍼🍼', side);
    this.swipeDirection = side
  }


}
