import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewerPage } from './profile-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewerPage,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileViewerPageRoutingModule {

}
