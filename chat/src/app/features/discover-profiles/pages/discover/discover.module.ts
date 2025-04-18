import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';

import { SharedModule } from 'src/app/shared/shared.module';

import { DirectivesModule } from 'src/app/shared/directives/directives.module';

import { DiscoverProfilesFeatureModule } from 'src/app/features/discover-profiles/discover-profiles-feature.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
    DiscoverPageRoutingModule,
    SharedModule,
    DirectivesModule,
    DiscoverProfilesFeatureModule,
  ],
  declarations: [DiscoverPage],
})
export class DiscoverPageModule {}
