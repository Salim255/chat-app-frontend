import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [

     {
      path: 'conversations',
      loadChildren: () => import('../pages/conversations/conversations.module').then((m) => m.ConversationsPageModule)
     },
     {
      path: 'community',
      loadChildren: () => import('../pages/discover/discover.module').then((m)  => m.DiscoverPageModule)
     },
     {
      path: 'matches',
      loadChildren: () => import('../pages/matches/matches.module').then((m) => m.MatchesPageModule)
     },
     {
      path: 'account',
      loadChildren: () => import('../pages/account/account.module').then( (m) => m.AccountPageModule)
     }
    ]
  },
  {
    path: 'active-conversation/:userId',
    loadChildren: () => import('../pages/active-conversation/active-conversation.module').then( (m) => m.ActiveConversationPageModule)
  }
  ,
  {
    path: 'edit-profile',
    loadChildren: () => import('../pages/account/edit-profile/edit-profile.module').then( (m) => m.EditProfilePageModule )
  },
  {
    path: 'settings',
    loadChildren: () => import('../pages/account/settings/settings.module').then((m) => m.SettingsPageModule)
  },
  {
    path: 'view-profile',
    loadChildren: () => import('../pages/profile-viewer/profile-viewer.module').then((m) => m.ProfileViewerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
