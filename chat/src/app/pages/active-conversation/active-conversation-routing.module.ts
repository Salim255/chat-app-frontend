import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveConversationPage } from './active-conversation.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveConversationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveConversationPageRoutingModule {}
