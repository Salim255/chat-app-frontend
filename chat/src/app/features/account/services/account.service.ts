import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Account } from 'src/app/features/account/models/account.model';
import { AccountHttpService, FetchAccountDto } from './account-http.service';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private account = new BehaviorSubject<Account | null>(null);
  constructor(private accountHttpService: AccountHttpService) {}

  fetchAccount(): Observable<FetchAccountDto> {
    return this. accountHttpService.getAccount().pipe(tap((response) => {
        this.setAccountInfo(response.data.profile);
      })
    );
  }

  private setAccountInfo(user: Account): void{
    this.account.next(user);
  }

  get getAccount(): Observable<Account | null> {
    return this.account.asObservable();
  }

  get getHostUserPhoto():Observable<string | null> {
    return this.account.asObservable().pipe(
      map((account) => account?.avatar ?? null)
    );
  }

  calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  }
}
