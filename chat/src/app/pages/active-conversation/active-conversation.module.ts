import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveConversationPageRoutingModule } from './active-conversation-routing.module';

import { ActiveConversationPage } from './active-conversation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveConversationPageRoutingModule
  ],
  declarations: [ActiveConversationPage]
})
export class ActiveConversationPageModule {}
