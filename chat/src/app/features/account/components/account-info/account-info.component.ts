import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Account } from "src/app/features/account/models/account.model";
import { AccountService } from "src/app/features/account/services/account.service";
import { GeolocationService } from "src/app/core/services/geolocation/geolocation.service";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})

export class AccountInfoComponent implements OnInit, OnDestroy {
  private accountInfoSource!: Subscription;
  private userLocationSource!: Subscription;
  accountData!: Account;
  userLocation: string = "";
  constructor (private router: Router, private accountService: AccountService,
    private geolocationService: GeolocationService
   ) {}

  ngOnInit() {

    this.accountInfoSource = this.accountService.getAccount.subscribe(data => {
      if (data) this.accountData = data;
     })
     this.userLocationSource =  this.geolocationService.getLocation.subscribe(userLocation => {
        this.userLocation = userLocation
     })
  }

  onEditProfile(){
      this.router.navigate(['/tabs/edit-profile'])
  }

  ngOnDestroy() {
    if (this.accountInfoSource) {
      this.accountInfoSource.unsubscribe()
    }

    if (this.userLocationSource) {
      this.userLocationSource.unsubscribe()
    }
  }
}
