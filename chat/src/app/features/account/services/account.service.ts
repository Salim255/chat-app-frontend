import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/features/account/models/account.model';

type AccountDto =  {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
 };

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private ENV = environment;
  private account = new BehaviorSubject<Account | null>(null);

  constructor(private http: HttpClient) {}

  fetchAccount(): Observable<{ status: string; data: { user: AccountDto }}> {
    return this.http.get<{status: string, data: { user: AccountDto } }>(`${this.ENV.apiUrl}/users/`).pipe(
      tap((response) => {
        console.log(response.data.user, 'Hello from here')
        const user = this.mapUserToAccount(response.data.user);
        this.setAccountInfo(user);
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

  private mapUserToAccount(userDto: AccountDto): Account {
    return new Account(
      userDto.id,
      userDto.first_name,
      userDto.last_name,
      userDto.avatar
    );
  };
}
