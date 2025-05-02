import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { TabsService } from './services/tabs/tabs.service';
import { Subscription } from 'rxjs';
import { SocketPresenceService } from '../core/services/socket-io/socket-presence.service';
import { SocketCoreService } from '../core/services/socket-io/socket-core.service';
import { AuthService } from '../core/services/auth/auth.service';
import { SocketRoomService } from '../core/services/socket-io/socket-room.service';
import { SocketMessageService } from '../core/services/socket-io/socket-message.service';

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
  showActionBtn = false;
  hidingTapStatus: displayTap = 'hide';
  private userId: number | null = null;

  private tapHidingStatusSource!: Subscription;
  private userIdSubscription!: Subscription;
  private tabChangeSubscription!: Subscription;
  isDiscoverActive = true;
  constructor(
    private tabsService: TabsService,
    private socketCoreService: SocketCoreService,
    private authService: AuthService,
    private socketPresenceService: SocketPresenceService,
    private socketRoomService: SocketRoomService,
    private socketMessageService: SocketMessageService
  ) {

  }

  ngOnInit(): void {
    // console.log('tabs, Hello tabs💥💥💥')
    this.tapHidingStatusSource = this.tabsService.getHidingTapStatus.subscribe((status) => {
      this.hidingTapStatus = status;
    });
    ////////
    this.subscribeToUserId();
    this.subscribeToTabChange();
  }

  private subscribeToTabChange() {
    this.tabChangeSubscription = this.tabsService.getNextPage.subscribe((selectedTab) => {
      console.log(selectedTab, 'hello');
      this.tabs?.select('account');
      this.isDiscoverActive = selectedTab === 'discover';
    });
  }

  setCurrentTab(event: any):void {
    this.selectedTab = this.tabs.getSelected();
    this.isDiscoverActive = this.selectedTab === 'discover';
  }

  private subscribeToUserId() {
    this.userIdSubscription = this.authService.userId.subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.socketCoreService.initialize(this.userId);
        this.socketPresenceService.initializePresenceListener();
        this.socketRoomService.initializeRoomListeners();
        this.socketMessageService.initializeMessageListener()
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tapHidingStatusSource) {
      this.tapHidingStatusSource.unsubscribe();
    }

    this.userIdSubscription?.unsubscribe();
    this.tabChangeSubscription?.unsubscribe();
  }
}
