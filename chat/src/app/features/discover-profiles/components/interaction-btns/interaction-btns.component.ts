import { Component, Input, OnDestroy, OnInit} from "@angular/core";


import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Member } from "src/app/shared/interfaces/member.interface";
import { TabsService } from "src/app/tabs/services/tabs/tabs.service";

@Component({
    selector: "app-interaction-btns",
    templateUrl: "./interaction-btns.component.html",
    styleUrls: ["./interaction-btns.component.scss"],
    standalone: false
})

export class InteractionBtnsComponent implements OnInit, OnDestroy {
  @Input() profile!: Member;

  foreignersListStatus: any ;
  hidingTapStatus:any = 'show';


  constructor(private discoverService: DiscoverService, private tabsService: TabsService) {

  }

  ngOnInit(): void {
    console.log("From")
  }

  onSkip () {
     this.discoverService.setProfileInteractionType('dislike')
  }

  onAddFriend () {
    this.discoverService.setProfileInteractionType('like')
  }

  setTapHidingStatus() {
    this.tabsService.setTapHidingStatus('show')
  }

  ngOnDestroy(): void {
    console.log("he")
  }
}
