import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountFeatureModule } from 'src/app/features/account/account-feature.module';


@NgModule({
  imports: [
    IonicModule,
    AccountPageRoutingModule,
    SharedModule,
    AccountFeatureModule
  ],
  declarations: [ AccountPage ]
})
export class AccountPageModule {}
