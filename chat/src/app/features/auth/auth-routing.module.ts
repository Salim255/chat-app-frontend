import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthEntryComponent } from './components/auth-entry/auth-entry.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { AuthPage } from './auth.page';

const routes: Routes = [
{
  path: '',
  component: AuthPage,
  children: [
    { path: '', redirectTo: 'entry', pathMatch: 'full' },
    {
      path: 'entry',
      component: AuthEntryComponent,
    },
    {
      path: 'authentication',
      component: LoginSignupComponent,
    },
    {
      path: 'create-profile',
      component: CreateProfileComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
