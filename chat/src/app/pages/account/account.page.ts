import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private accountService: AccountService) { }

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

}
