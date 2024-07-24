import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { AuthService } from 'src/app/services/auth/auth.service';

register();

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {

  constructor(
     private accountService: AccountService,
     private router: Router ) { }

  ionViewWillEnter () {
    this.accountService.fetchAccount().subscribe();
  }

  onSettings() {
    this.router.navigate(["./tabs/settings"])
  }

}
