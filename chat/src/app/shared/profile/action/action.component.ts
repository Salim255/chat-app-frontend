import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { Foreigner } from "src/app/models/foreigner.model";
import { DiscoverService } from "src/app/services/discover/discover.service";

@Component({
  selector: "app-profile-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})

export class ActionComponent implements OnInit, OnDestroy {
  @Input() profile!: Foreigner;
  foreignersListStatus: any ;

  private foreignersListStatusSource!: Subscription;

  constructor(private discoverService: DiscoverService) {

  }

  ngOnInit(): void {
     this.foreignersListStatusSource = this.discoverService.getForeignersListStatus.subscribe(status => {
        this.foreignersListStatus = status
     })

  }
  onSkip () {
     this.discoverService.triggerDislikeProfile('skip')
  }

  onAddFriend () {
    this.discoverService.triggerLikeProfile('like')
  }

  ngOnDestroy(): void {
    if (this.foreignersListStatusSource) {
      this.foreignersListStatusSource.unsubscribe()
    }
  }
}
