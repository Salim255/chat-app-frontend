import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLandingPage } from './app-landing.page';

const routes: Routes = [
  {
    path: '',
    component: AppLandingPage,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppLandingPageRoutingModule {}
