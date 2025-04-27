import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthMode } from '../../services/auth/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './app-landing.page.html',
  styleUrls: ['./app-landing.page.scss'],
  standalone: false,
})
export class AppLandingPage {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  onCreate(): void {
    this.authService.setAuthMode(AuthMode.signup);
    this.navigateToAuthPage();
  }

  onSignIn(): void {
    this.authService.setAuthMode(AuthMode.login);
    this.navigateToAuthPage();
  }

  navigateToAuthPage() {
    this.router.navigate(['/auth']);
  }
}
