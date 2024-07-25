import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { TapService } from '../services/tap/tap.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy  {
  selectedTab: any;
  showActionBtn = false;
  hidingTapStatus: boolean = false
  @ViewChild("tabs") tabs!: IonTabs;

  private tapHidingStatusSource!: Subscription;

  constructor(private tapService: TapService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.tapHidingStatusSource = this.tapService.getHidingTapStatus.subscribe(status => {
      console.log(status);
      this.hidingTapStatus = status
    })
  }
  setCurrentTab(event: any) {
    this.selectedTab = this.tabs.getSelected();
    if (this.selectedTab === 'community') this.showActionBtn =true
    else this.showActionBtn = false;
  }

  ngOnDestroy(): void {
    if (this.tapHidingStatusSource) {
      this.tapHidingStatusSource.unsubscribe();
    }
  }

}
