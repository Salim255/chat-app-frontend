import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { BlockComponent } from './components/security/block-profile/block.component';
import { ReportComponent } from './components/security/report-profile/report.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
  declarations: [
    BlockComponent,
    ReportComponent,
  ],
  exports: [
    BlockComponent,
    ReportComponent,
  ],
})
export class ProfileViewerFeatureModule {}
