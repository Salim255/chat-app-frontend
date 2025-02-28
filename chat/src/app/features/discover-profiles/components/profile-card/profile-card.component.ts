import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';

import { TapService } from 'src/app/tabs/services/tap/tap.service';


export type displayTap =  'show' | 'hide';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
    standalone: false
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  @Input() foreigner!: any;
  @Input() lastProfileIndex: any;
  @Input() profileIndex: any;
  @Input()   profileImages: any;
  @Input() hidingTapStatus: any;




  private animationEventSource!: Subscription;
  private tapHidingStatusSourceSubscription!: Subscription;

  animationType: any = null;

  constructor (
    private tapService : TapService ) { }

    ngOnInit(): void {
      if (this.profileImages) {
        this.foreigner.images = this.profileImages
      }
      this.tapHidingStatusSourceSubscription = this.tapService.getHidingTapStatus.pipe(take(1)).subscribe( status => {
        this.hidingTapStatus = status;
    });


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
