import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './active-conversation-messages-routing.module';

import { ActiveConversationMessagesPage } from './active-conversation-messages.page';

import { MessagesComponent } from 'src/app/features/active-conversation/components/messages/messages.component';
import { TypingComponent } from 'src/app/features/active-conversation/components/typing/typing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
  ],
  declarations: [ActiveConversationMessagesPage, MessagesComponent, TypingComponent]
})
export class MessagesPageModule {}
