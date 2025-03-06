import { NgModule } from "@angular/core";
import { ActiveConversationPageRoutingModule } from "./active-conversation-routing.module";
import { IonicModule } from "@ionic/angular";
import { ActiveConversationPage } from "./active-conversation.page";
import { ActiveConversationFeatureModule } from "src/app/features/active-conversation/active-conversation-feature.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MessagesComponent } from "../../components/messages/messages.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TypingComponent } from "../../components/typing/typing.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveConversationPageRoutingModule,
    ActiveConversationFeatureModule,
    SharedModule],
  declarations: [ActiveConversationPage, MessagesComponent, TypingComponent ]
})
export class ActiveConversationPageModule {

}
