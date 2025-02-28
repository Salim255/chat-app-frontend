import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { TapService } from './services/tap/tap.service';
import { Subscription } from 'rxjs';
import { SocketIoService } from '../core/services/socket.io/socket.io.service';
import { AuthService } from '../core/services/auth/auth.service';

export type displayTap =  'show' | 'hide';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
    standalone: false
})
export class TabsPage implements OnInit, OnDestroy  {
  @ViewChild("tabs") tabs!: IonTabs;

  selectedTab: any;
  showActionBtn = false;
  hidingTapStatus: displayTap = 'hide';
  private userId: number | null = null;

  private tapHidingStatusSource!: Subscription;
  private userIdSubscription!: Subscription;

  constructor(
    private tapService: TapService,
    private socketIoService: SocketIoService,
    private  authService:  AuthService) { }

  ngOnInit(): void {
   // console.log('tabs, Hello tabs💥💥💥')
    this.tapHidingStatusSource = this.tapService.getHidingTapStatus.subscribe(status => {
      this.hidingTapStatus = status;
    });

    this.subscribeToUserId();
    //this.socketIoServic
  }

  ionViewWillEnter(){
   // console.log("Tap will enter 💥💥")
  }

  /* ionViewWillLeave(){
    console.log("Tap will leave 💥💥")
  } */
  setCurrentTab(event: any) {
    this.selectedTab = this.tabs.getSelected();
    if (this.selectedTab === 'community') this.showActionBtn =true
    else this.showActionBtn = false;
  }

  private subscribeToUserId() {
    this.userIdSubscription = this.authService.userId.subscribe(userId => {
      this.userId = userId;
      // console.log('Hello Tabs', userId)
      if (this.userId){
         this.socketIoService.initializeSocket(this.userId);
        //this.socketIoService.registerUser(this.userId);
        //console.log("Hello world 💥💥💥💥, from this.userID", userId)
      };

    })
  }

  ngOnDestroy(): void {
    if (this.tapHidingStatusSource) {
      this.tapHidingStatusSource.unsubscribe();
    }

    this.userIdSubscription?.unsubscribe();
  }

}
