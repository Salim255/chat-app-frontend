import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
     {
      path: 'home',
      loadChildren: () =>  import('../pages/home/home.module').then((m) => m.HomePageModule)
     },
     {
      path: 'account',
      loadChildren: () => import('../pages/account/account.module').then((m) => m.AccountPageModule)
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
