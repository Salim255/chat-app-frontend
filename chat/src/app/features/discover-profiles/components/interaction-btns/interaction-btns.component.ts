import { Component, Input, OnDestroy, OnInit, signal} from "@angular/core";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { Member } from "src/app/shared/interfaces/member.interface";
import { TabsService } from "src/app/tabs/services/tabs/tabs.service";
import { SwipeDirection } from "../../pages/discover/discover.page";
import { Subscription } from "rxjs";
import { InteractionBtnService } from "../../services/interaction-btn.service";

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
  path = '/assets/icon/';
  buttons: any[] = [];
  animationType = signal<SwipeDirection | null>(null);
  private interactiveBtnSource!: Subscription;

  constructor (
    private discoverService: DiscoverService,
    private tabsService: TabsService,
    private interactionBtnService: InteractionBtnService) {

  }

  ngOnInit(): void {
    this.subscribeToInteractionBtn();
    this.buttons = [
      { name: 'undo',
        icon: `${this.path}undo.svg`,
        animationType: '',
        background: '',
        onClick: () => {  }
      },
      { name: 'dislike',
        icon: `${this.path}close.svg`,
        isActiveIcon: `${this.path}clear-close.svg`,
        animationType: SwipeDirection.SwipeLeft,
        background: '',
        onClick: () => { this.onSkip() }
      },
      { name: 'stars',
        icon: `${this.path}star.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: '',
        background: '',
        onClick: () => {  }
      },
      { name: 'like',
        icon: `${this.path}heart.svg`,
        isActiveIcon: `${this.path}clear-heart.svg`,
        animationType: SwipeDirection.SwipeRight,
        background: '',
        onClick: () => { this.onAddFriend() }
      },
      { name: 'boost',
        icon: `${this.path}flash.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: '',
        background: '',
        onClick: () => {  }
      }
      ];
  }

  isActiveIcon(buttonName: SwipeDirection): boolean {
    // Check if the button is active (highlighted)
    return this.animationType() === buttonName;
  }

  isHidden(buttonName: SwipeDirection): string {
    if (!this.animationType()) {
      return 'visible'; // Default: all buttons visible
    }
    return this.animationType() === buttonName ? 'visible highlight' : 'hidden';
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
  private subscribeToInteractionBtn(){
    this.interactiveBtnSource = this.interactionBtnService.getActionDirection
    .subscribe(action => {
       this.animationType.set(action) ;
    })
   }
  ngOnDestroy(): void {
    console.log("he")
  }
}
