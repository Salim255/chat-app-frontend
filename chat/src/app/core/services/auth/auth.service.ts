import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../../environments/environment';
import { AuthPost, AuthResponse } from '../../interfaces/auth.interface';
import { User } from 'src/app/core/models/user.model';
import { BehaviorSubject, firstValueFrom, from, map, switchMap, tap} from 'rxjs';
import { SocketIoService } from '../socket-io/socket-io.service';
import { KeyPairManager } from '../encryption/key-pair-manager';

export enum AuthMode {
  login = "login",
  signup = "signup"
}

export interface AuthPostWithKeys extends AuthPost {
  publicKey: string;
  privateKey: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  private ENV = environment;
  private user = new BehaviorSubject <User | null> (null);
  private authModeSource = new BehaviorSubject < AuthMode | null> (null);

  activeLogoutTimer: any;

  constructor (
    private http: HttpClient,
    private socketIoService: SocketIoService ) { }

    authenticate (mode: AuthMode,  userInput: AuthPost ) {
    if (mode === AuthMode.signup && userInput.email) {

      return from( KeyPairManager.getPrivatePublicKeys(userInput.email) ).pipe(
        switchMap(({ publicKey,  privateKey }) => {
          const userInputWithKeys: AuthPostWithKeys =
           { publicKey, privateKey, ...userInput };
           return this.authRequest(mode, userInputWithKeys);
        })
      )
    } else {
      return this.authRequest(mode, userInput)
    }
  }

  private  authRequest( mode: AuthMode, userInput: AuthPost | AuthPostWithKeys) {
    return this.http
      .post<any>(`${this.ENV.apiUrl}/users/${mode}`, userInput)
      .pipe(tap(response => {
        this.setAuthData(response.data)
      }))
  }

  private setAuthData (authData: AuthResponse) {
    const expirationTime = new Date(new Date().getTime() + +authData.expireIn);
    const userId = authData.id;
    const privateKey =  authData.privateKey;
    const publicKey = authData.publicKey;
    const email = authData.email;

    const buildUser = new User(
      userId,
      authData.token,
      expirationTime,
      privateKey,
      publicKey,
      email
      );
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

  get userIsAuthenticated () {
    return this.user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        }
        return false;
      })
    );
  }

  get userId () {
    return this.user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id
        }
        return null
      })
    )
  }

  private autoLogout (duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.logout()
    }, duration);
  }

  async logout () {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    // ===== To disconnect user from socket server ====
    const currentUserId = await firstValueFrom(this.userId);
    if(currentUserId) this.socketIoService.disconnectUser(currentUserId)

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
          _privateKey: string,
          _publicKey: string,
          _email: string
        };

        const expirationTime = new Date(parseData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
            return null;
        }

        const userToReturn = new User(
          parseData.id,
          parseData._token,
          expirationTime,
          parseData._privateKey,
          parseData._publicKey,
          parseData._email
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

  updateMe (userData: any) {
    return from(Preferences.get({key: 'authData'})).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null
        }

        const parseData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
          _privateKey: string;
          _publicKey: string;
          _email: string;
        }

        let token = parseData._token;

        return token;
      }),
      switchMap((token) => {
        return this.http.patch<any>(`${this.ENV.apiUrl}/users/updateMe`, userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }),
      tap((response) => {
          console.log('====================================');
          console.log('Response:', response);
          console.log('====================================');
      })
    )
    //return this.http.patch<any>(`${this.ENV.apiUrl}/users/updateMe`, userData)
  }

  setAuthMode(authMode: AuthMode ) {
    this.authModeSource.next(authMode);
  }

  get getAuthMode() {
    return this.authModeSource.asObservable();
  }

  ngOnDestroy () {
   if (this.activeLogoutTimer) {
    clearTimeout(this.activeLogoutTimer)
   }
  }
}
