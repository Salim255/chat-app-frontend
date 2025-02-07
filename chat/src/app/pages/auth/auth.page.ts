import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: false
})

export class AuthPage implements OnInit, OnDestroy {
 autMode: boolean =  true;
  private authModeSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  switchAuth(event: any){
    this.autMode =  !this.autMode
  }

  ngOnInit(): void {
    this.authModeSubscription = this.authService.getAuthMode.subscribe(mode => {

    });
  }

  ionWillEnter() {
    this.authModeSubscription = this.authService.getAuthMode.subscribe(mode => {
      console.log(mode)
    });
  }
  ngOnDestroy(): void {
    if (this.authModeSubscription) this.authModeSubscription.unsubscribe
  }
}
