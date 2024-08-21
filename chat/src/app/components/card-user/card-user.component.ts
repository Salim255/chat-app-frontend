import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AnimationService } from 'src/app/services/animation/animation.service';
import { TapService } from 'src/app/services/tap/tap.service';


export type displayTap =  'show' | 'hide';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent implements OnInit, OnDestroy {
  @Input() foreigner!: any;
  @Input() lastProfileIndex: any;
  @Input() profileIndex: any;
  @Input()   profileImages: any;
  @Input() hidingTapStatus: any;




  private animationEventSource!: Subscription;
  private tapHidingStatusSourceSubscription!: Subscription;

  animationType: any = null;

  constructor (

    private animationService: AnimationService,
    private tapService : TapService ) { }

    ngOnInit(): void {
      if (this.profileImages) {
        this.foreigner.images = this.profileImages
      }
      this.tapHidingStatusSourceSubscription = this.tapService.getHidingTapStatus.pipe(take(1)).subscribe( status => {
        this.hidingTapStatus = status;
    });

      this.animationEventSource = this.animationService.getAnimation.subscribe(event => {
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

  onTapSide(side: any) {
    if (side) {
      const data = {clientId: this.foreigner.id, tapSide: side }
      this.tapService.setTapEventSource(data)
    }
  }



  ngOnDestroy(): void {
    if (this.animationEventSource) {
     this.animationEventSource.unsubscribe()
    }
    if (this.tapHidingStatusSourceSubscription) {
      this.tapHidingStatusSourceSubscription.unsubscribe();
    }
 }
}
