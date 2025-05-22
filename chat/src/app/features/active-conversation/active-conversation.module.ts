import { NgModule } from '@angular/core';
import { ActiveConversationPageRoutingModule } from './active-conversation-routing.module';
import { IonicModule } from '@ionic/angular';
import { ActiveConversationPage } from './active-conversation.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessagesComponent } from './components/messages/messages.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypingComponent } from './components/typing/typing.component';
import { headerComponent } from './components/header/header.component';
import { FormInputComponent } from './components/form-input/form-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveConversationPageRoutingModule,
    SharedModule,
  ],
  declarations: [ActiveConversationPage, headerComponent, FormInputComponent, MessagesComponent, TypingComponent],
})
export class ActiveConversationPageModule {}
