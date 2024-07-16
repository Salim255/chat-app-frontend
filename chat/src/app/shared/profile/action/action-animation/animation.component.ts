import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AnimationService } from "src/app/services/animation/animation.service";
@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements OnInit, OnDestroy {
  animationEventSource!: Subscription;
  animationType: any = null;
  constructor(private  animationService:  AnimationService){}

  ngOnInit(): void {
     this.animationEventSource = this.animationService.getAnimation.subscribe(event => {
      if (event) {
        this.animationType =  event
      }

     })

  }

  ngOnDestroy(): void {
    if (this.animationEventSource) {
      this.animationEventSource.unsubscribe()
    }
  }

  getContentText(animationType: string) {
     if (animationType) {
          return animationType === 'like' ? 'Like' : animationType === 'dislike' ? 'Sorry': '';
     }
     return
  }
}
