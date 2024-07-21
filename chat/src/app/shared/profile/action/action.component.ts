import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { Foreigner } from "src/app/models/foreigner.model";
import { CommunityService } from "src/app/services/community/community.service";

@Component({
  selector: "app-profile-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})

export class ActionComponent implements OnInit, OnDestroy {
  @Input() profile!: Foreigner;
  foreignersListStatus: any ;

  private foreignersListStatusSource!: Subscription;

  constructor(private communityService: CommunityService) {

  }

  ngOnInit(): void {
     this.foreignersListStatusSource = this.communityService.getForeignersListStatus.subscribe(status => {
        this.foreignersListStatus = status
     })

  }
  onSkip () {
     this.communityService.triggerDislikeProfile('skip')
  }

  onAddFriend () {
    this.communityService.triggerLikeProfile('like')
  }

  ngOnDestroy(): void {
    if (this.foreignersListStatusSource) {
      this.foreignersListStatusSource.unsubscribe()
    }
  }
}
