import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject,from, map, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/features/account/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private ENV = environment ;
  private account = new BehaviorSubject <Account | null> (null);

  constructor(private http: HttpClient) {
   }

  fetchAccount(){
    return from(Preferences.get({key: 'authData'})).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null
        }

        const parseData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
        }

        let token = parseData._token;

        return token;
      }),
      switchMap((token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }),
      tap((response) => {
          this.setAccountInfo(response.data)
      })
    )
  }

  private setAccountInfo (data: any) {
      const buildAccount = new Account(data.id, data.first_name, data.last_name, data.email, data.avatar, data.is_staff, data.is_active , [])
      this.account.next(buildAccount)
  }

  get getAccount () {
    return this.account.asObservable().pipe(
      map(account => {
        if (account) {
          return account
        } else {
          return null
        }
      })
    )
  }

}
