import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileViewerFeatureModule } from '../profile-viewer/profile-viewer-feature.module';
import { DiscoverContainerComponent } from './components/discover-cards/discover-container.component';
const routes: Routes = [
  {
    path: '',
    component: DiscoverContainerComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes), ProfileViewerFeatureModule ],
  exports: [RouterModule],
})
export class DiscoverPageRoutingModule {}
