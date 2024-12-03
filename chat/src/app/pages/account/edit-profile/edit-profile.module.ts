import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';

import { AccountMediaComponent } from 'src/app/features/account/components/edit-account/media/media.component';
import { AboutMeComponent } from 'src/app/features/account/components/edit-account/about-me/about-me.component';
import { InterestsComponent } from 'src/app/features/account/components/edit-account/interests/interests.component';
import { RelationGoalsComponent } from 'src/app/features/account/components/edit-account/relation-goals/relation-goals.component';
import { RelationTypeComponent } from 'src/app/features/account/components/edit-account/relation-type/relation-type.component';
import { SchoolComponent } from 'src/app/features/account/components/edit-account/school/school.component';
import { LanguagesComponent } from 'src/app/features/account/components/edit-account/languages/languages.component';
import { LifeStyleComponent } from 'src/app/features/account/components/edit-account/lifestyle/lifestyle.component';
import { LivingComponent } from 'src/app/features/account/components/edit-account/living/living.component';
import { GenderComponent } from 'src/app/features/account/components/edit-account/gender/gender.component';
import { OrientationComponent } from 'src/app/features/account/components/edit-account/orientation/orientation.component';
import { ControlComponent } from 'src/app/features/account/components/edit-account/control/control.component';
import { CardMediaComponent } from 'src/app/features/account/components/edit-account/media/card-media/card.component';

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
