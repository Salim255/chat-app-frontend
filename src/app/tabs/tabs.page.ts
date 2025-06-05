import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SocketPresenceService } from '../core/services/socket-io/socket-presence.service';
import { SocketCoreService } from '../core/services/socket-io/socket-core.service';
import { AuthService } from '../features/auth/services/auth.service';
import { SocketRoomService } from '../core/services/socket-io/socket-room.service';
import { SocketMessageService } from '../core/services/socket-io/socket-message.service';
import { InteractionBtnService } from '../features/discover/services/interaction-btn.service';
import { SocketTypingService } from '../core/services/socket-io/socket-typing.service';

export type displayTap = 'show' | 'hide';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, OnDestroy {
  @ViewChild('tabs') tabs!: IonTabs;
  @ViewChild('tabsElement') tabsElement!: ElementRef;
  selectedTab: any;
  isSwipeActive = signal(false);
  hidingTapStatus: displayTap = 'hide';
  private userId: number | null = null;
  private userIdSubscription!: Subscription;
  private swipeEventSubscription!: Subscription;
  isDiscoverActive = true;

  constructor(
    private interactionBtnService:InteractionBtnService,
    private socketCoreService: SocketCoreService,
    private authService: AuthService,
    private socketPresenceService: SocketPresenceService,
    private socketRoomService: SocketRoomService,
    private socketMessageService: SocketMessageService,
    private socketTypingService: SocketTypingService
  ) {

  }

  ngOnInit(): void {
    this.subscribeToUserId();
    this.subscribeToSwipeEvent();
  }

  setCurrentTab(event: any):void {
    this.selectedTab = this.tabs.getSelected();
    this.isDiscoverActive = this.selectedTab === 'discover';
  }

  private subscribeToSwipeEvent(){
    this.swipeEventSubscription = this.interactionBtnService.getActionDirection.subscribe(event => {
      this.isSwipeActive.set(!!event);
    })
  }

  private subscribeToUserId() {
    this.userIdSubscription = this.authService.userId.subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.socketCoreService.initialize(this.userId);
        this.socketPresenceService.initializePresenceListener();
        this.socketRoomService.initializeRoomListeners();
        this.socketMessageService.initializeMessageListener();
        this.socketTypingService.initializeTypingListener();
      }
    });
  }

  ngOnDestroy(): void {
    this.userIdSubscription?.unsubscribe();
    this.swipeEventSubscription?.unsubscribe();
  }
}
