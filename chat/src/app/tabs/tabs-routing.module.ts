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
        loadChildren: () =>
          import('../features/conversations/conversations.module').then(
            (m) => m.ConversationsPageModule
          ),
      },
      {
        path: 'discover',
        loadChildren: () =>
          import('../features/discover/discover.module').then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: 'matches',
        loadChildren: () =>
          import('../features/matches/matches.module').then(
            (m) => m.MatchesPageModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../features/account/account.module').then(
            (m) => m.AccountPageModule
          ),
      },
    ],
  },
  {
    path: 'active-conversation/:userId',
    loadChildren: () =>
      import(
        '../features/active-conversation/pages/active-conversation/active-conversation.module'
      ).then((m) => m.ActiveConversationPageModule),
    runGuardsAndResolvers: 'always', // Forces full navigation
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../features/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'view-profile',
    loadChildren: () =>
      import('../features/profile-viewer/profile-viewer.module').then(
        (m) => m.ProfileViewerPageModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
