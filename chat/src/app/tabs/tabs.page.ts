import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {
  selectedTab: any;
  @ViewChild("tabs") tabs!: IonTabs;
  constructor() { }

  setCurrentTab(event: any) {
    this.selectedTab = this.tabs.getSelected();
  }

}
