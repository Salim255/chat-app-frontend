import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { Subscription } from 'rxjs';
import { Account } from '../../models/account.model';
import { AccountInfoData } from '../../components/account-info/account-info.component';
import { CompleteProfileService } from 'src/app/features/complete-profile/services/complete-profile.service';

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
    private completeProfileService: CompleteProfileService,
    private accountService: AccountService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscribeToAccount()
  }
  ionViewWillEnter(): void {
    this.accountService.fetchAccount().subscribe();
  }

  onSettings(): void {
    this.router.navigate(['./tabs/settings']);
  }

  private subscribeToAccount(){
    this. accountSubscription = this.accountService.getAccount.subscribe(
      {
        next: (account) => {
          this.account = account;
          if (account) {
            this.completeProfileService.openModal();
          }
         },
        error: (error) => {
          // TODO:
        }

    })
  }

  accountInfo(): AccountInfoData| null{
    if(!this.account) return null;
    const data : AccountInfoData =
      {
        age: this.calculateAge(this.account.birth_date),
        avatar: this.account.avatar,
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
