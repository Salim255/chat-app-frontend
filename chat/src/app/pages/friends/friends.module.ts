import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';

import { CardFriendComponent } from 'src/app/components/card-friend/card-friend.component';
import { ConversationComponent } from 'src/app/components/conversation/conversation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule
  ],
  declarations: [FriendsPage, CardFriendComponent, ConversationComponent]
})
export class FriendsPageModule {}
