import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LookingForComponent } from './components/looking-for/looking-for.component';
import { EssentialsComponent } from './components/essentials/essentials.component';
import { blockComponent } from './components/security/block-profile/block.component';
import { ReportComponent } from './components/security/report-profile/report.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
  declarations: [
    AboutMeComponent,
    LookingForComponent,
    EssentialsComponent,
    blockComponent,
    ReportComponent,
  ],
  exports: [
    AboutMeComponent,
    LookingForComponent,
    EssentialsComponent,
    blockComponent,
    ReportComponent,
  ],
})
export class ProfileViewerFeatureModule {}
