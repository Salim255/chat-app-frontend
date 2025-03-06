import { Component, Input, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";

import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Member } from "src/app/shared/interfaces/member.interface";
import { TabsService } from "src/app/tabs/services/tabs/tabs.service";

@Component({
    selector: "app-interaction-btns",
    templateUrl: "./action.component.html",
    styleUrls: ["./action.component.scss"],
    standalone: false
})

export class ActionComponent implements OnInit, OnDestroy {
  @Input() profile!: Member;

  foreignersListStatus: any ;
  hidingTapStatus:any = 'show';
  private tapStatusSourceSubscription!: Subscription;
  private foreignersListStatusSource!: Subscription;

  constructor(private discoverService: DiscoverService, private tabsService: TabsService) {

  }

  ngOnInit(): void {
    console.log("From")
     this.foreignersListStatusSource = this.discoverService.getForeignersListStatus.subscribe(status => {
        //this.foreignersListStatus = status;
     });

     this.tapStatusSourceSubscription = this.tabsService.getHidingTapStatus.subscribe(status => {
      //this.hidingTapStatus = status;

     })
  }

  onSkip () {
     this.discoverService.triggerDislikeProfile('skip');
     this.setTapHidingStatus();
  }

  onAddFriend () {
    this.discoverService.triggerLikeProfile();
    this.setTapHidingStatus()
  }

  setTapHidingStatus() {
    this.tabsService.setTapHidingStatus('show')
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
