import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  standalone: false,
})
export class AuthPage {
  constructor(private location: Location) {}
  customBack(): void  {
    this.location.back();
  }
}
