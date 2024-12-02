import { NgModule } from "@angular/core";
import { ActiveConversationPageRoutingModule } from "./active-conversation-routing.module";
import { IonicModule } from "@ionic/angular";
import { ActiveConversationPage } from "./active-conversation.page";
import { ActiveConversationModule } from "src/app/features/active-conversation/active-conversation.module";


@NgModule({
  imports: [IonicModule, ActiveConversationPageRoutingModule, ActiveConversationModule],
  declarations: [ActiveConversationPage ]
})
export class ActiveConversationPageModule {

}
