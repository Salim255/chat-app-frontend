import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverPage } from './discover.page';
import { ProfileViewerFeatureModule } from '../profile-viewer/profile-viewer-feature.module';

const routes: Routes = [
  {
    path: '',
    component: DiscoverPage,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes), ProfileViewerFeatureModule ],
  exports: [RouterModule],
})
export class DiscoverPageRoutingModule {}
