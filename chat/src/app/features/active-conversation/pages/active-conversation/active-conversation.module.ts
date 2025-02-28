import { NgModule } from "@angular/core";
import { ActiveConversationPageRoutingModule } from "./active-conversation-routing.module";
import { IonicModule } from "@ionic/angular";
import { ActiveConversationPage } from "./active-conversation.page";
import { ActiveConversationFeatureModule } from "src/app/features/active-conversation/active-conversation-feature.module";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  imports: [IonicModule, ActiveConversationPageRoutingModule, ActiveConversationFeatureModule, SharedModule],
  declarations: [ActiveConversationPage ]
})
export class ActiveConversationPageModule {

}
