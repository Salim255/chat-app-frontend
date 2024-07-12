import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {
  selectedTab: any;
  showActionBtn = false;
  @ViewChild("tabs") tabs!: IonTabs;
  constructor() { }

  setCurrentTab(event: any) {
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
    if (this.selectedTab === 'community') this.showActionBtn =true
    else this.showActionBtn = false;
  }

}
