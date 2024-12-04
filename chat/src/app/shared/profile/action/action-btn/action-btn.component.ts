import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";

@Component({
  selector: 'app-action-btn',
  templateUrl: './action-btn.component.html',
  styleUrls: ['./action-btn.component.scss']
})

export class ActionBtnComponent implements OnInit, OnDestroy {
  @Input() btnType!: string;
  animationType: any;
  private foreignersListStatusSource!: Subscription;
  foreignersListStatus: any ;
  private animationEventSource!: Subscription;
  constructor( private discoverService: DiscoverService) {

   }

   ngOnInit() {
     this.foreignersListStatusSource = this.discoverService.getForeignersListStatus.subscribe(status => {
      this.foreignersListStatus = status;
   });

   }


   btnTypeClass(btnType: string, animationType: string) {
      if (animationType === 'like' && btnType === 'like') {
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

     if (this.foreignersListStatusSource) {
      this.foreignersListStatusSource.unsubscribe()
    }
   }
}
