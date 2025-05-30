import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
  standalone: false,
})
export class LoginSignupComponent {
  constructor(private location: Location) {}
  customBack(): void  {
    this.location.back();
  }
}
