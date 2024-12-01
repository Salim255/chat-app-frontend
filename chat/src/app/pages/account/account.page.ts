import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';


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

  ngOnInit(): void {
    this.accountService.fetchAccount().subscribe();
  }

  onSettings() {
    this.router.navigate(["./tabs/settings"])
  }

}
