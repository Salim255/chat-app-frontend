import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountFeatureModule } from 'src/app/features/account/account-feature.module';
import { DatingProfileComponent } from '../../components/dating-profile/dating-profile.component';
import { AccountDashBoardComponent } from '../../components/dashboard/dashboard-component';
import { PreferencesComponent } from '../../components/preferences/preferences.component';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { PreviewComponent } from '../../components/preview/preview.component';
import { EditProfileFormComponent } from '../../components/edit-profile-form/edit-profile-form.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule, AccountPageRoutingModule,
    SharedModule, AccountFeatureModule,
    FormsModule, ReactiveFormsModule,
  ],
  declarations: [
    AccountPage, DatingProfileComponent,
    AccountDashBoardComponent, EditProfileFormComponent,
    PreferencesComponent,
    EditProfileComponent, PreviewComponent,
  ],
})
export class AccountPageModule {}
