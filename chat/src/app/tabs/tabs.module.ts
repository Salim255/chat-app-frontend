import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SharedModule } from '../shared/shared.module';
import { DiscoverPageModule } from '../features/discover/discover.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule, TabsPageRoutingModule, SharedModule, DiscoverPageModule ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
