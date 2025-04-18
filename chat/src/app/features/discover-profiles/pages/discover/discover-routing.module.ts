import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverPage } from './discover.page';
import { DiscoverProfilesFeatureModule } from 'src/app/features/discover-profiles/discover-profiles-feature.module';
const routes: Routes = [
  {
    path: '',
    component: DiscoverPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), DiscoverProfilesFeatureModule],
  exports: [RouterModule],
})
export class DiscoverPageRoutingModule {}
