import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { SharedModule } from '../../shared/shared.module';
import { AuthFormComponent } from './components/auth-form/form.component';
import { AuthEntryComponent } from './components/auth-entry/auth-entry.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    AuthPage, AuthFormComponent,
    AuthEntryComponent, CreateProfileComponent,
    LoginSignupComponent,
  ],
})
export class AuthPageModule {}
