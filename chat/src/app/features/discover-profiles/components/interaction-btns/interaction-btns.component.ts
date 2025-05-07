import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { SwipeDirection } from '../../pages/discover/discover.page';
import { InteractionType } from 'src/app/features/discover-profiles/services/discover.service';

type ButtonConfig =   {
  name: string;
  icon: string;
  animationType: SwipeDirection;
  isActiveIcon: string;
  onClick: () => void,
}

@Component({
  selector: 'app-interaction-btns',
  templateUrl: './interaction-btns.component.html',
  styleUrls: ['./interaction-btns.component.scss'],
  standalone: false,
})
export class InteractionBtnsComponent implements OnInit {
  @Input() profile!: Member;
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
        icon: `${this.path}undo.svg`,
        animationType: SwipeDirection.SwipeUp,
        isActiveIcon: '',
        onClick: () => {},
      },
      {
        name: 'dislike',
        icon: `${this.path}close.svg`,
        isActiveIcon: `${this.path}clear-close.svg`,
        animationType: SwipeDirection.SwipeLeft,
        onClick: () => this.onSkip(),
      },
      {
        name: 'stars',
        icon: `${this.path}star.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: SwipeDirection.SwipeDown,
        onClick: () => {},
      },
      {
        name: 'like',
        icon: `${this.path}heart.svg`,
        isActiveIcon: `${this.path}clear-heart.svg`,
        animationType: SwipeDirection.SwipeRight,
        onClick: () => this.onAddFriend(),
      },
      {
        name: 'boost',
        icon: `${this.path}flash.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: SwipeDirection.SwipeDown,
        onClick: () => {},
      },
    ];
  }
}
