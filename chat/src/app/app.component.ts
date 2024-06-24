import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SocketIoService } from './services/socket.io/socket.io.service';
import { Platform } from '@ionic/angular';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub!: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private socketIoService: SocketIoService
  ) {

  }

  ngOnInit () {
    // Set the keyboard resize mode to 'none'
    //this.setKeyboardResizeMode( KeyboardResize.Body);
   // Keyboard.setResizeMode({ mode: KeyboardResize.Body });

    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.previousAuthState != isAuth) {
        this.router.navigateByUrl("/auth")
      }
      this.previousAuthState = isAuth
    })

  }

  async setKeyboardResizeMode(mode: KeyboardResize) {
    console.log('====================================');
    console.log("Hello mode", mode);
    console.log('====================================');
    if (this.isWebPlatform()) {
      console.warn('Keyboard API is not fully implemented on web.');
    } else {
      await Keyboard.setResizeMode({ mode });
      // Handle fallback behavior or alternative solutions
    }
  }

  isWebPlatform(): boolean {
    return !!(window as any).cordova; // Check if running in Capacitor (not in a browser)
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe()
    }
  }
}
