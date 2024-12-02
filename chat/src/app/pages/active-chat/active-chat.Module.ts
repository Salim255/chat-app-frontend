import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ActiveChatPageRoutingModule } from "./active-chat-routing.module";
import { IonicModule } from "@ionic/angular";
import { ActiveChatPage } from "./active-chat.page";
import { headerComponent } from "src/app/features/active-conversation/components/header/header.component";
import { FormInputComponent } from "src/app/features/active-conversation/components/form-input/form-input.component";
import { FormsModule } from "@angular/forms";



@NgModule({
  imports: [CommonModule, ActiveChatPageRoutingModule, IonicModule, FormsModule],
  declarations: [ActiveChatPage, headerComponent, FormInputComponent ]
})
export class ActiveChatPageModule {

}
