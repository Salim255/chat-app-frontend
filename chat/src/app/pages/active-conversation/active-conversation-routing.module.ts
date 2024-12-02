import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActiveConversationPage } from "./active-conversation.page";

const routes: Routes = [
  {
    path: '',
    component: ActiveConversationPage,
    children:
    [
      {
       path: 'messages',
       loadChildren: () => import('../messages/messages-routing.module').then((m) => m.MessagesPageRoutingModule)
      },
      {
        path: '',
        redirectTo: 'messages',
        pathMatch: 'full'
      }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ActiveConversationPageRoutingModule {

}
