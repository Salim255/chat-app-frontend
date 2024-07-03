import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

import { AccountInfoComponent } from 'src/app/components/account/account-info/account-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingCardsComponent } from 'src/app/components/account/shopping-cards/shopping-cards.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    SharedModule
  ],
  declarations: [AccountPage, AccountInfoComponent, ShoppingCardsComponent]
})
export class AccountPageModule {}
