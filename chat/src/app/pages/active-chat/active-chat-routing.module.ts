import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActiveChatPage } from "./active-chat.page";

const routes: Routes = [
  {
    path: '',
    component: ActiveChatPage,
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

export class ActiveChatPageRoutingModule {

}
