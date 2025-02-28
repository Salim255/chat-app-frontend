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
     return this.http.get<any>(`${this.ENV.apiUrl}/users/`).pipe( tap((response) => {
        this.setAccountInfo(response.data)
    }))
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

  get getHostUserPhoto() {
    return this.account.asObservable().pipe(
      map(account =>
        {
          if (account?.avatar) {
            return account.avatar
          } else {
            return null
          }
        })
    )
  }
}
