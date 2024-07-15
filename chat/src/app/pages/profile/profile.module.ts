import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { SharedModule } from 'src/app/shared/shared.module';
import { EssentialsComponent } from 'src/app/components/profile/essentials/essentials.component';
import { LifestyleComponent } from 'src/app/components/profile/lifestyle/lifestyle.component';
import { LookingForComponent } from 'src/app/components/profile/looking-for/looking-for.component';
import { blockComponent } from 'src/app/components/profile/security/block-profile/block.component';
import { ReportComponent } from 'src/app/components/profile/security/report-profile/report.component';
import { AboutMeComponent } from 'src/app/components/profile/about-me/about-me.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [ProfilePage, EssentialsComponent, LifestyleComponent, LookingForComponent, blockComponent, ReportComponent, AboutMeComponent]
})
export class ProfilePageModule {}
