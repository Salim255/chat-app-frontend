import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';
import { DatingProfileComponent } from './components/dating-profile/dating-profile.component';
import { AccountDashBoardComponent } from './components/dashboard/dashboard-component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { EditProfileComponent } from './components/dating-profile/edit-profile/edit-profile.component';
import { PreviewComponent } from './components/dating-profile/preview/preview.component';


const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    children:[
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        component: AccountDashBoardComponent
      },
      {
        path:'dating-profile',
        component: DatingProfileComponent,
        children: [
          { path: 'edit-profile',
            component: EditProfileComponent
          },
          {
            path: 'preview',
            component: PreviewComponent
          }
        ]
      },
      {
        path: 'preferences',
        component: PreferencesComponent
      }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
