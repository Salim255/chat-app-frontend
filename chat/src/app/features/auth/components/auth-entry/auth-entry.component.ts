import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMode, AuthService } from '../../services/auth.service';
import { AppTranslateService } from 'src/app/core/services/translate/translate.service';

@Component({
  selector: 'app-auth-entry',
  templateUrl: './auth-entry.component.html',
  styleUrls: ['./auth-entry.component.scss'],
  standalone: false,
})
export class AuthEntryComponent {
  constructor(
    private appTranslateService: AppTranslateService,
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

  navigateToAuthPage(): void {
    this.router.navigateByUrl('auth/authentication');
  }

  onLanguage(): void{

  }
}
