import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { LoadingSpinnerService } from './shared/components/app-loading-spinner/loading-spinner.service';
import { TranslateService } from '@ngx-translate/core';
//
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub!: Subscription;
  private spinnerLoaderSubscription!: Subscription;
  private previousAuthState = false;
  isVisibleSpinner = signal<boolean>(false);

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private loadingSpinnerService: LoadingSpinnerService,
  ) {
    this.translate.addLangs(['en', 'fr', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.setDefaultLang('eng');
  }

  ngOnInit(): void {
    // Overlay the web view on the status bar
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setStyle({ style: StatusBarStyle.Light });
    this.subscribeToAuth();
    this.subscribeToSpinner();
  }

  private subscribeToAuth() {
    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.previousAuthState != isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  private subscribeToSpinner() {
    this.spinnerLoaderSubscription = this.loadingSpinnerService.getSpinnerStatus.subscribe(
      (status) => {
        this.isVisibleSpinner.set(status);
      }
    );
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.spinnerLoaderSubscription?.unsubscribe();
  }
}
