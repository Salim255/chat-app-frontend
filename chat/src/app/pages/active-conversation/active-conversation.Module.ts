import { NgModule } from "@angular/core";
import { ActiveConversationPageRoutingModule } from "./active-conversation-routing.module";
import { IonicModule } from "@ionic/angular";
import { ActiveConversationPage } from "./active-conversation.page";
import { ActiveConversationFeatureModule } from "src/app/features/active-conversation/active-conversation-feature.module";


@NgModule({
  imports: [IonicModule, ActiveConversationPageRoutingModule, ActiveConversationFeatureModule ],
  declarations: [ActiveConversationPage ]
})
export class ActiveConversationPageModule {

}
