import { NgModule } from "@angular/core";
import { ConversationItemComponent } from "./components/conversation-item/conversation-item.component";
import { IonicModule } from "@ionic/angular";
@NgModule({
  imports: [IonicModule],
  declarations: [ConversationItemComponent],
  exports: [ConversationItemComponent]
})

export class ConversationFeatureModule {

}
