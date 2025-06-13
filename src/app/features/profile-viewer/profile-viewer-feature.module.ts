import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { blockComponent } from './components/security/block-profile/block.component';
import { ReportComponent } from './components/security/report-profile/report.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
  declarations: [
    blockComponent,
    ReportComponent,
  ],
  exports: [
    blockComponent,
    ReportComponent,
  ],
})
export class ProfileViewerFeatureModule {}
