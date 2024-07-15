import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Foreigner } from "src/app/models/foreigner.model";
import { CommunityService } from "src/app/services/community/community.service";

@Component({
  selector: "app-profile-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})

export class ActionComponent {
  @Input() profile!: Foreigner;


  constructor(private communityService: CommunityService) {

  }

  onSkip () {
     this.communityService.triggerDislikeProfile('skip')
  }

  onAddFriend () {
    this.communityService.triggerLikeProfile('like')
  }
}
