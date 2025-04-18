import { NgModule } from '@angular/core';
import { ConversationItemComponent } from './components/conversation-item/conversation-item.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [ConversationItemComponent],
  exports: [ConversationItemComponent],
})
export class ConversationFeatureModule {}
