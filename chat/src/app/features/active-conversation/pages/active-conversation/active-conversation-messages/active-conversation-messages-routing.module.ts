import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveConversationMessagesPage } from './active-conversation-messages.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveConversationMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesPageRoutingModule {}
