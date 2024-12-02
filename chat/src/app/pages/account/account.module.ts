import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountModule } from 'src/app/features/account/account.module';


@NgModule({
  imports: [
    IonicModule,
    AccountPageRoutingModule,
    SharedModule,
    AccountModule
  ],
  declarations: [ AccountPage ]
})
export class AccountPageModule {}
