import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DiscoverService } from 'src/app/features/discover/services/discover.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { SwipeDirection } from '../../pages/discover/discover.page';
import { InteractionType } from 'src/app/features/discover/services/discover.service';

type PageName = 'discover' | 'viewer';

type ButtonConfig =   {
  name: string;
  icon: string;
  animationType: SwipeDirection;
  isActiveIcon: string;
  pageName: PageName;
  onClick: () => void,
}

@Component({
  selector: 'app-interaction-btns',
  templateUrl: './interaction-btns.component.html',
  styleUrls: ['./interaction-btns.component.scss'],
  standalone: false,
})
export class InteractionBtnsComponent implements OnInit {
  @Input() pageName!: PageName ;
  @Input() profile!: Partner;
  @Input() animationType: SwipeDirection | null = null;
  path = '/assets/icon/';
  buttons: ButtonConfig[] = [];


  constructor(private discoverService: DiscoverService) {}

  ngOnInit(): void {
    this.buttons = this.initializeButtons();
  }

  isActiveIcon(buttonName: SwipeDirection): boolean {
    // Check if the button is active (highlighted)
    return this.animationType === buttonName;
  }

  isHidden(buttonName: SwipeDirection): string {
    if (!this.animationType) {
      return 'visible'; // Default: all buttons visible
    }
    return this.animationType === buttonName ? 'visible highlight' : 'hidden';
  }

  onSkip(): void {
    this.discoverService.setProfileInteractionType(InteractionType.DISLIKE);
  }

  onAddFriend(): void {
    this.discoverService.setProfileInteractionType(InteractionType.LIKE);
  }

  private initializeButtons(): ButtonConfig[] {
    return [
      {
        name: 'undo',
        pageName: this.pageName,
        icon: `${this.path}undo.svg`,
        animationType: SwipeDirection.SwipeUp,
        isActiveIcon: '',
        onClick: () => {},
      },
      {
        name: 'dislike',
        pageName: this.pageName,
        icon: `${this.path}close.svg`,
        isActiveIcon: `${this.path}clear-close.svg`,
        animationType: SwipeDirection.SwipeLeft,
        onClick: () => this.onSkip(),
      },
      {
        name: 'stars',
        pageName: this.pageName,
        icon: `${this.path}star.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: SwipeDirection.SwipeDown,
        onClick: () => {},
      },
      {
        name: 'like',
        pageName: this.pageName,
        icon: `${this.path}heart.svg`,
        isActiveIcon: `${this.path}clear-heart.svg`,
        animationType: SwipeDirection.SwipeRight,
        onClick: () => this.onAddFriend(),
      },
      {
        name: 'boost',
        pageName: this.pageName,
        icon: `${this.path}flash.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: SwipeDirection.SwipeDown,
        onClick: () => {},
      },
    ];
  }

  btnByPageName(btn: ButtonConfig, index: number): boolean {
    if (!btn?.pageName || !btn?.name) return false;

    if (btn.pageName === 'viewer') {
      console.log('btn', btn);
      console.log('btn.name', btn.pageName);
      return true;
    }

    if (btn.pageName === 'discover') {
      return true;
    }
    return true;
  }
}
