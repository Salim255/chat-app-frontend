import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Account } from 'src/app/features/account/models/account.model';
import { AccountHttpService, FetchAccountDto } from './account-http.service';
import { AuthService } from '../../auth/services/auth.service';
import { Coordinates } from 'src/app/core/services/geolocation/geolocation.service';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private account = new BehaviorSubject<Account | null>(null);
  private account$ = this.account.asObservable();
  constructor(
    private authService: AuthService,
    private accountHttpService: AccountHttpService) {}

  fetchAccount(): Observable<FetchAccountDto> {
    return this. accountHttpService.getAccount().pipe(tap((response) => {
      if(!response.data.profile) {
        this.authService.logout();
        return;
      };
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
      map((account) => account?.photos[0] ?? null)
    );
  }
  get getHostCoordinates():Coordinates| null {
    if (!this.account.value?.latitude) return null
    return {latitude: this.account.value?.latitude, longitude:  this.account.value?.longitude}
  }

  get getAccountId(): number| null {
      if (!this.account.value?.id) return null;
      return this.account.value?.id;
  }

  setAccountWithUpdate(profile: Account): void{
    this.account.next(profile);
  }
  calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  }
}
