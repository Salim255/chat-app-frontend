import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesPageRoutingModule } from './matches-routing.module';

import { MatchesPage } from './matches.page';

import { MatchItemComponent } from 'src/app/components/matches/match-item/match-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatchPlaceHolderComponent } from 'src/app/components/matches/place-holder/match-place-holder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchesPage, MatchItemComponent,  MatchPlaceHolderComponent]
})
export class MatchesPageModule {}
