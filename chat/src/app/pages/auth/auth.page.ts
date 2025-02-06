import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthPost } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/core/services/auth/auth.service';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: false
})
export class AuthPage {
 autMode: boolean =  true;
  constructor(private authService: AuthService, private router: Router) {

   }

  switchAuth(event: any){
    this.autMode =  !this.autMode
  }


}
