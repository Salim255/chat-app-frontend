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
      path: 'conversations',
      loadChildren: () => import('../pages/conversations/conversations.module').then((m) => m.ConversationsPageModule)
     },
     {
      path: 'community',
      loadChildren: () => import('../pages/community/community.module').then((m)  => m.CommunityPageModule)
     },
     {
      path: 'friends',
      loadChildren: () => import('../pages/friends/friends.module').then((m) => m.FriendsPageModule)
     },
     {
      path: 'account',
      loadChildren: () => import('../pages/account/account.module').then( (m) => m.AccountPageModule)
     }
    ]
  },
  {
    path: 'active-conversation',
    loadChildren: () => import('../pages/active-conversation/active-conversation.module').then( (m) => m.ActiveConversationPageModule)
  },
  {
    path: 'active-chat',
    loadChildren: () => import('../pages/active-chat/active-chat.Module').then( (m) => m.ActiveChatPageModule)
  }
  ,
  {
    path: 'edit-profile',
    loadChildren: () => import('../pages/edit-profile/edit-profile.module').then( (m) => m.EditProfilePageModule )
  },
  {
    path: 'profile',
    loadChildren: () => import('../pages/profile/profile.module').then( (m) => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../pages/settings/settings.module').then( (m) => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
