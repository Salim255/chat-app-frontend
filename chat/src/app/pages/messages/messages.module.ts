import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import { MessagesComponent } from 'src/app/features/active-conversation/components/messages/messages.component';
import { TypingComponent } from 'src/app/features/active-conversation/components/typing/typing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
  ],
  declarations: [MessagesPage,MessagesComponent, TypingComponent]
})
export class MessagesPageModule {}
