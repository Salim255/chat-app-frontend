import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthMode } from '../../services/auth/auth.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './app-landing.page.html',
  styleUrls: ['./app-landing.page.scss'],
  standalone: false,
})
export class AppLandingPage {
  constructor(
    private authService: AuthService,
    private router: Router,
    private socketIoService: SocketIoService
  ) {
    this.socketIoService.initializeSocket(1);
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
