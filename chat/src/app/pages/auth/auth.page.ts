import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: false
})

export class AuthPage {
  constructor( private location: Location) {}
  customBack(){
    this.location.back();
  }

}
