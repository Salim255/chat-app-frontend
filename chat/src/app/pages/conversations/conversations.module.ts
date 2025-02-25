import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { IonicModule } from '@ionic/angular';

import { ConversationsPageRoutingModule } from './conversations-routing.module';

import { ConversationsPage } from './conversations.page';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationFeatureModule } from 'src/app/features/conversations/conversations-feature.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsPageRoutingModule,
    SharedModule,
    DragDropModule,
    ConversationFeatureModule,

  ],
  declarations: [ ConversationsPage,]
})
export class ConversationsPageModule {}
