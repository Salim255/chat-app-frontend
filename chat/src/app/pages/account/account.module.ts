import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

import { AccountInfoComponent } from 'src/app/features/account/components/account-info/account-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingCardsComponent } from 'src/app/features/account/components/shopping-cards/shopping-cards.component';
import { CardComponent } from 'src/app/features/account/components/shopping-cards/card/card.component';
import { FeaturesComponent } from 'src/app/features/account/components/features/features.component';
import { FeatureCardComponent } from 'src/app/features/account/components/features/card/feature-card.component';
import { FeatureCardHeaderComponent } from 'src/app/features/account/components/features/card/feature-card-header/feature-cared-header.component';
import { DetailsComponent } from 'src/app/features/account/components/features/card/details/details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



@NgModule({
 schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    SharedModule
  ],
  declarations: [AccountPage, AccountInfoComponent, ShoppingCardsComponent,CardComponent, FeaturesComponent, FeatureCardComponent, FeatureCardHeaderComponent, DetailsComponent]
})
export class AccountPageModule {}
