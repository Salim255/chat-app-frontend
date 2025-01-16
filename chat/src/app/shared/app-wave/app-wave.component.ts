import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AccountService } from "src/app/features/account/services/account.service";

@Component({
  selector: 'app-wave',
  templateUrl: './app-wave.component.html',
  styleUrls: ['./app-wave.component.scss']
})
export class AppWaveComponent implements OnInit, OnDestroy {
  accountAvatar: string  = 'assets/images/default-profile.jpg';
  private accountAvatarSubscription!: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   this.accountAvatarSubscription = this.accountService.getAccount.subscribe((account) => {
    if (account?.avatar) {
      if (account.avatar.length > 0) {
        const result = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${account?.avatar}`;
        this.accountAvatar = result
      }
    }
   })
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.accountAvatarSubscription) {
      this.accountAvatarSubscription.unsubscribe()
    }
  }
}
