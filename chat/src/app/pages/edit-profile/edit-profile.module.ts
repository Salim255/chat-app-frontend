import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';

import { AccountMediaComponent } from 'src/app/components/account/edit-account/media/media.component';
import { AboutMeComponent } from 'src/app/components/account/edit-account/about-me/about-me.component';
import { InterestsComponent } from 'src/app/components/account/edit-account/interests/interests.component';
import { RelationGoalsComponent } from 'src/app/components/account/edit-account/relation-goals/relation-goals.component';
import { RelationTypeComponent } from 'src/app/components/account/edit-account/relation-type/relation-type.component';
import { SchoolComponent } from 'src/app/components/account/edit-account/school/school.component';
import { LanguagesComponent } from 'src/app/components/account/edit-account/languages/languages.component';
import { LifeStyleComponent } from 'src/app/components/account/edit-account/lifestyle/lifestyle.component';
import { LivingComponent } from 'src/app/components/account/edit-account/living/living.component';
import { GenderComponent } from 'src/app/components/account/edit-account/gender/gender.component';
import { OrientationComponent } from 'src/app/components/account/edit-account/orientation/orientation.component';
import { ControlComponent } from 'src/app/components/account/edit-account/control/control.component';
import { CardMediaComponent } from 'src/app/components/account/edit-account/media/card-media/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule
  ],
  declarations: [EditProfilePage, AccountMediaComponent,AboutMeComponent, InterestsComponent, RelationGoalsComponent, SchoolComponent,RelationTypeComponent, LanguagesComponent, LifeStyleComponent, LivingComponent, GenderComponent, OrientationComponent, ControlComponent, CardMediaComponent ]
})
export class EditProfilePageModule {}
