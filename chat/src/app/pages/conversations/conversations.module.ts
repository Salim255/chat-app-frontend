import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationsPageRoutingModule } from './conversations-routing.module';

import { ConversationsPage } from './conversations.page';
import { ConversationComponent } from 'src/app/features/conversations/components/conversation-item/conversation-item.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsPageRoutingModule,
    SharedModule
  ],
  declarations: [ ConversationsPage, ConversationComponent ]
})
export class ConversationsPageModule {}
