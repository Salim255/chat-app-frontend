import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { Friend } from 'src/app/models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private ENV = environment;
  private matchesArraySource = new BehaviorSubject <Array<Friend>> ([])
  constructor(private http: HttpClient) { }

  fetchFriends(){
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
      }),switchMap((token) => {
        return this.http.get<any>(`${this.ENV.apiUrl}/friends/get-friends`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }), tap( response => {
        this.matchesArraySource.next(response.data)
      })
    )
  }

  get getMatchesArray () {
    return this.matchesArraySource.asObservable()
  }
}
