import { Component, Input, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { Foreigner } from "../../../models/foreigner.model";
import { DiscoverService } from "src/app/services/discover/discover.service";
import { TapService } from "src/app/services/tap/tap.service";

@Component({
  selector: "app-profile-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})

export class ActionComponent implements OnInit, OnDestroy {
  @Input() profile!: Foreigner;
  foreignersListStatus: any ;
  hidingTapStatus:any;
  private tapStatusSourceSubscription!: Subscription;
  private foreignersListStatusSource!: Subscription;

  constructor(private discoverService: DiscoverService, private tapService: TapService) {

  }

  ngOnInit(): void {
     this.foreignersListStatusSource = this.discoverService.getForeignersListStatus.subscribe(status => {
        this.foreignersListStatus = status
     });

     this.tapStatusSourceSubscription = this.tapService.getHidingTapStatus.subscribe(status => {
      console.log(status);
      this.hidingTapStatus = status

     })
  }

  ionViewWillEnter () {

 }

  onSkip () {
     this.discoverService.triggerDislikeProfile('skip');
     this.setTapHidingStatus();

  }

  onAddFriend () {
    this.discoverService.triggerLikeProfile('like');
    this.setTapHidingStatus()
  }

  setTapHidingStatus() {
    this.tapService.setTapHidingStatus('show')
  }

  ngOnDestroy(): void {
    if (this.foreignersListStatusSource) {
      this.foreignersListStatusSource.unsubscribe()
    }

    if (this.tapStatusSourceSubscription) {
      this.tapStatusSourceSubscription.unsubscribe();
    }
  }
}
