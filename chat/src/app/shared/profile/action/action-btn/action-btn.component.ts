import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AnimationService } from "src/app/services/animation/animation.service";

@Component({
  selector: 'app-action-btn',
  templateUrl: './action-btn.component.html',
  styleUrls: ['./action-btn.component.scss']
})

export class ActionBtnComponent implements OnInit, OnDestroy {
  @Input() btnType!: string;
  animationType: any;

  private animationEventSource!: Subscription;
  constructor(private animationService: AnimationService) {

   }

   ngOnInit() {
    this.animationEventSource = this.animationService.getAnimation.subscribe(event => {
      if (event) {
        this.animationType =  event
      }
     })
   }


   btnTypeClass(btnType: string, animationType: string) {
      if (animationType === 'like' && btnType === 'like') {
        console.log(animationType);
        return `btn btn__${btnType} btn__${btnType}--animation`
      } else if (animationType === 'dislike' && btnType === 'dislike') {
        return `btn btn__${btnType} btn__${btnType}--animation`
      }
      return `btn btn__${btnType}`
   }

   getIconName(iconName: string, animationType: string) {
    let path = '../../../../../assets/icon/'
    switch(iconName) {
      case 'undo':
        return `${path}undo.svg`;
      case 'dislike':
        if (animationType === 'dislike') {
          return `${path}clear-close.svg`
        }
        return  `${path}close.svg`;
      case 'stars':
        return `${path}star.svg`;
      case 'like':
        if (animationType === 'like') {
          return `${path}clear-heart.svg`
        }
        return `${path}heart.svg`;
      case 'boost':
        return  `${path}flash.svg`;
      default:
        return;
    }
   }


   ngOnDestroy(): void {
     if (this.animationEventSource) {
      this.animationEventSource.unsubscribe()
     }
   }
}
