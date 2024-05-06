import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'active-conversation',
    loadChildren: () => import('./pages/active-conversation/active-conversation.module').then( m => m.ActiveConversationPageModule)
  },
  {
    path: 'conversations',
    loadChildren: () => import('./pages/conversations/conversations.module').then( m => m.ConversationsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
