import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesPageRoutingModule } from './matches-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatchesPage } from './matches.page';
import { ItsMatchModalComponent } from './modals/its-match-modal/its-match-modal.component';
import { PairedPhotosComponent } from './components/paired-photos/paired-photos.component';
import { MatchItemComponent } from './components/match-item/match-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MatchesPageRoutingModule, SharedModule],
  declarations: [MatchesPage, PairedPhotosComponent, MatchItemComponent, ItsMatchModalComponent],
})
export class MatchesPageModule {}
