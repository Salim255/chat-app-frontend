import { Component, Input, OnInit, signal } from '@angular/core';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { SwipeDirection } from '../../pages/discover/discover.page';
import { take } from 'rxjs';
import { InteractionBtnService } from '../../services/interaction-btn.service';
import { InteractionType } from 'src/app/features/discover-profiles/services/discover.service';

interface ButtonContent {
  name: string;
  icon: string;
  animationType: SwipeDirection | null;
  isActiveIcon: string;
  onClick: () => void;
}

@Component({
  selector: 'app-interaction-btns',
  templateUrl: './interaction-btns.component.html',
  styleUrls: ['./interaction-btns.component.scss'],
  standalone: false,
})
export class InteractionBtnsComponent implements OnInit {
  @Input() profile!: Member;
  path = '/assets/icon/';
  buttons: ButtonContent[] = [];
  animationType = signal<SwipeDirection | null>(null);

  constructor(
    private discoverService: DiscoverService,
    private interactionBtnService: InteractionBtnService
  ) {}

  ngOnInit(): void {
    this.subscribeToInteractionBtn();
    this.buttons = [
      {
        name: 'undo',
        icon: `${this.path}undo.svg`,
        animationType: null,
        isActiveIcon: '',
        onClick: () => {},
      },
      {
        name: 'dislike',
        icon: `${this.path}close.svg`,
        isActiveIcon: `${this.path}clear-close.svg`,
        animationType: SwipeDirection.SwipeLeft,
        onClick: () => {
          this.onSkip();
        },
      },
      {
        name: 'stars',
        icon: `${this.path}star.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: null,
        onClick: () => {},
      },
      {
        name: 'like',
        icon: `${this.path}heart.svg`,
        isActiveIcon: `${this.path}clear-heart.svg`,
        animationType: SwipeDirection.SwipeRight,
        onClick: () => {
          this.onAddFriend();
        },
      },
      {
        name: 'boost',
        icon: `${this.path}flash.svg`,
        isActiveIcon: `${this.path}close.svg`,
        animationType: null,
        onClick: () => {},
      },
    ];
  }

  isActiveIcon(buttonName: SwipeDirection | null): boolean {
    // Check if the button is active (highlighted)
    return this.animationType() === buttonName;
  }

  isHidden(buttonName: SwipeDirection | null): string {
    if (!this.animationType()) {
      return 'visible'; // Default: all buttons visible
    }
    return this.animationType() === buttonName ? 'visible highlight' : 'hidden';
  }

  onSkip(): void {
    this.discoverService.setProfileInteractionType(InteractionType.DISLIKE);
  }

  onAddFriend(): void {
    this.discoverService.setProfileInteractionType(InteractionType.LIKE);
  }

  private subscribeToInteractionBtn() {
    this.interactionBtnService.getActionDirection.pipe(take(1))
    .subscribe((action) => this.animationType.set(action) );
  }
}
