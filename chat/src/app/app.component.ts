import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SocketIoService } from './services/socket.io/socket.io.service';


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


    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.previousAuthState != isAuth) {
        this.router.navigateByUrl("/auth")
      }
      this.previousAuthState = isAuth
    })

  }


  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe()
    }
  }
}
