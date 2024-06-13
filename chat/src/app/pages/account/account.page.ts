import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    let accountOb: Observable<any> ;
     accountOb = this.accountService.fetchAccount();
     accountOb.subscribe({
      error: (err) => {
        console.log(err);

      },
      next: (res) => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
      }
     })
  }

  onSettings() {
    console.log('====================================');
    console.log("Hello Salim");
    console.log('====================================');
    this.router.navigate(["./tabs/settings"])
  }

}
