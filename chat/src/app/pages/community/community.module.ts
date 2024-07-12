import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';
import { UserInformationComponent } from 'src/app/components/card-user/user-information/user-information.component';
import { CommunityPage } from './community.page';
import { CardUserComponent } from 'src/app/components/card-user/card-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameAgeComponent } from 'src/app/components/card-user/user-information/name-age/name-age.component';
import { DistanceComponent } from 'src/app/components/card-user/user-information/distance/distance.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    SharedModule
  ],
  declarations: [CommunityPage,CardUserComponent, UserInformationComponent, NameAgeComponent, DistanceComponent]
})
export class CommunityPageModule {}
