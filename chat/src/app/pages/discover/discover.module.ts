import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';

import { SharedModule } from 'src/app/shared/shared.module';

import { DirectivesModule } from 'src/app/directives/directives.module';

 import { DiscoverProfilesFeatureModule } from 'src/app/features/discover-profiles/discover-profiles-feature.module';

@NgModule({

  imports: [
    CommonModule,
    IonicModule,
    DiscoverPageRoutingModule,
    SharedModule,
    DirectivesModule,
    DiscoverProfilesFeatureModule

  ],
  declarations: [ DiscoverPage ]
})
export class DiscoverPageModule {}
