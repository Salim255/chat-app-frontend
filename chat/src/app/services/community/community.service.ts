import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

import { Account } from "src/app/models/account.model";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences";
import { Friend } from "src/app/models/friend.model";
@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  noConnectedFriendsArray = new BehaviorSubject<Array<Friend>> ([]);
  private ENV = environment
  constructor(private http: HttpClient){

  }

  fetchUsers(){
    return from(Preferences.get({key: 'authData'}))
    .pipe(
      map((storedData)=> {
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
      }),switchMap((token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/friends/get-non-friends`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }),
      tap((response) => {
        this.noConnectedFriendsArray.next(response.data)
      })
    )
  }

  addFriend(friendId: number) {
    return from(Preferences.get({key: "authData"})).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parseData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
        }

        let token = parseData._token;

        return token;
      }), switchMap((token) => {
        return this.http.post<any>(`${this.ENV.apiUrl}/friends`,
        { friend_id: friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      })
    )
  }
  get getNoConnectedFriendsArray () {
      return this.noConnectedFriendsArray.asObservable()
  }
}