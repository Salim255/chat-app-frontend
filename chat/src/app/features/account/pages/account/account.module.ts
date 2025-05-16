import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountFeatureModule } from 'src/app/features/account/account-feature.module';
import { DatingProfileComponent } from '../../components/dating-profile/dating-profile.component';
import { AccountDashBoardComponent } from '../../components/dashboard/dashboard-component';
import { PreferencesComponent } from '../../components/preferences/preferences.component';

import { PreviewComponent } from '../../components/dating-profile/preview/preview.component';
import { EditProfileFormComponent } from '../../components/dating-profile/edit-profile/edit-profile-form/edit-profile-form.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProfileModule } from '../../components/dating-profile/edit-profile/edit-profile.module';


@NgModule({
  imports: [
    IonicModule,
    AccountPageRoutingModule,
    SharedModule,
    AccountFeatureModule,
    FormsModule,
    ReactiveFormsModule,
    EditProfileModule,
  ],
  declarations: [
    AccountPage, DatingProfileComponent,
    AccountDashBoardComponent, EditProfileFormComponent,
    PreferencesComponent
   ,PreviewComponent,
  ],
})
export class AccountPageModule {}
