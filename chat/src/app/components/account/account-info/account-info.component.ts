import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Account } from "src/app/models/account.model";
import { AccountService } from "src/app/services/account/account.service";
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})

export class AccountInfoComponent implements OnInit, OnDestroy {
  private accountInfoSource!: Subscription;
 accountData!: Account;
  constructor (private router: Router, private accountService: AccountService ) {}

  ngOnInit() {
    this.accountInfoSource = this.accountService.getAccount.subscribe(data => {
      if (data) this.accountData = data
        console.log(data, "Hello data");
     })
  }

  onEditProfile(){
      this.router.navigate(['/tabs/edit-profile'])
  }

  ngOnDestroy() {
    if (this.accountInfoSource) {
      this.accountInfoSource.unsubscribe()
    }
  }
}
