import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from 'src/app/features/account/services/account.service';
import { register } from 'swiper/element/bundle';
import { Subscription } from 'rxjs';
import { Account } from './models/account.model';
import { AccountInfoData } from './components/account-info/account-info.component';
import { SettingService } from 'src/app/features/settings/services/setting.service';
import { AccountLocationService } from './services/account-location.service';

register();
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false,
})
export class AccountPage implements OnInit, OnDestroy {
  private account: Account | null = null
  accountSubscription!: Subscription;

  constructor(
    private accountService: AccountService,
    private settingService: SettingService,
    private accountLocationService: AccountLocationService,
  ) {}

  ngOnInit(): void {
    this.subscribeToAccount();
  }

  ionViewWillEnter(): void {
    this.accountService.fetchAccount().subscribe();
  }

  onSettings(): void {
    this.settingService.openSettings();
  }

  private subscribeToAccount(){
    this. accountSubscription = this.accountService.getAccount.subscribe(
      {
        next: (account) => {
          this.account = account;
          if (!account?.id) return
          this.accountLocationService.updateAccountCoordinates(account.id).subscribe();
         },
        error: (error) => {
          console.log(error)
        }

    })
  }

  accountInfo(): AccountInfoData| null{
    if(!this.account) return null;
    const data : AccountInfoData =
      {
        age: this.calculateAge(this.account.birth_date),
        photos: this.account.photos,
        city: this.account.city,
        name: this.account.name,
      }
    return data
  }

  calculateAge(birthDate: Date): number{
   return this.accountService.calculateAge(birthDate);
  }


  ngOnDestroy(): void {
   this.accountSubscription?.unsubscribe();
  }
}
