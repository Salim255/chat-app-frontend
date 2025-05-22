import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IonicModule } from '@ionic/angular';
import { ConversationsPageRoutingModule } from './conversations-routing.module';
import { ConversationsPage } from './conversations.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationItemComponent } from './components/conversation-item/conversation-item.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsPageRoutingModule,
    SharedModule,
    DragDropModule,
  ],
  declarations: [ConversationsPage, ConversationItemComponent],
})
export class ConversationsPageModule {}
