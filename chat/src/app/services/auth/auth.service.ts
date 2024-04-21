import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';
import { AuthPost, AuthResponse } from '../../interfaces/auth.interface';
import { User } from 'src/app/models/user.model';
import { BehaviorSubject, from, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  private ENV = environment;
  private user = new BehaviorSubject <User | null> (null);
  activeLogoutTimer: any;

  constructor(private http: HttpClient) { }

  authenticate(mode: string, userInput: AuthPost){
      return this.http
      .post<any>(`${this.ENV.apiUrl}/users/${mode}`, userInput)
      .pipe(tap(response => {
        this.setAuthData(response.data)
      }))
  }

  private setAuthData(authData: AuthResponse){
      const expirationTime = new Date(new Date().getTime() + +authData.expireIn);
      let userId = authData.id;
      const buildUser = new User(userId, authData.token, expirationTime);
      this.user.next(buildUser);
      this.storeAuthData(buildUser);
  }

  private storeAuthData = async (dataToStore: User) => {
    const data = JSON.stringify(dataToStore);
    await  Preferences.set({
      key: 'authData',
      value: data
    });
  };

  private removeStoredData = async () => {
    await Preferences.remove({ key: "authData" })
  }
  private autoLogout (duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.logout()
    }, duration);
  }

  private logout () {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.user.next(null);
    this.removeStoredData();
  }

  autoLogin () {
    return from(Preferences.get({key: 'authData'})).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parseData  = JSON.parse(storedData.value) as {
          id: number;
          _token: string;
          tokenExpirationDate: string;
        };

        const expirationTime = new Date(parseData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
            return null;
        }

        const userToReturn = new User(
          parseData.id,
          parseData._token,
          expirationTime
        );

        return userToReturn
      }),
      tap((userToReturn) =>  {
        if (userToReturn) {
          this.user.next(userToReturn);
          this.autoLogout(userToReturn.tokenDuration);
        }
      }),
      map((userToReturn) => {
        return !!userToReturn
      })
    )
  }

  ngOnDestroy(): void {
   if (this.activeLogoutTimer) {
    clearTimeout(this.activeLogoutTimer)
   }

  }
}
