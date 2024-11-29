import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';
import { UserInformationComponent } from 'src/app/components/card-user/user-information/user-information.component';
import { DiscoverPage } from './discover.page';
import { CardUserComponent } from 'src/app/components/card-user/card-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameAgeComponent } from 'src/app/components/card-user/user-information/name-age/name-age.component';
import { DistanceComponent } from 'src/app/components/card-user/user-information/distance/distance.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DiscoverPlaceHolderComponent } from 'src/app/components/discover/place-holder/place-holder.component';
import { WaveComponent } from 'src/app/components/discover/wave/wave.component';
import { AboutMeComponent } from 'src/app/components/profile/about-me/about-me.component';
import { LookingForComponent } from 'src/app/components/profile/looking-for/looking-for.component';
import { EssentialsComponent } from 'src/app/components/profile/essentials/essentials.component';
import { blockComponent } from 'src/app/components/profile/security/block-profile/block.component';
import { ReportComponent } from 'src/app/components/profile/security/report-profile/report.component';
import { ProfileComponent } from 'src/app/components/profile/proifle.component';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule,
    SharedModule,
    DirectivesModule
  ],
  declarations: [DiscoverPage,CardUserComponent, UserInformationComponent, NameAgeComponent, DistanceComponent, DiscoverPlaceHolderComponent, WaveComponent, AboutMeComponent, ProfileComponent, LookingForComponent, EssentialsComponent, blockComponent, ReportComponent ]
})
export class DiscoverPageModule {}
