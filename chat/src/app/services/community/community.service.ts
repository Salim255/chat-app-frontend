import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences";
import { Foreigner } from "src/app/models/foreigner.model";

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private ENV = environment;
  noConnectedFriendsArray = new BehaviorSubject< Array < Foreigner > > ([]);
  private  displayedProfileSource = new BehaviorSubject <Foreigner | null>(null) ;

  private likeProfileSource = new BehaviorSubject < string | null> (null)

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

  addFriend (friendId: number) {
    return from(Preferences.get({key: "authData"})).pipe(
      map( (storedData) => {
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

  setDisplayedProfile (data: Foreigner) {
     this.displayedProfileSource.next(data);
  }

  triggerLikeProfile(state: string) {
    this.likeProfileSource.next(state)
  }

  get getLikeProfileState() {
    return this.likeProfileSource.asObservable()
  }

  triggerDislikeProfile(state: string) {
    this.likeProfileSource.next(state)
  }

  get getDisLikeProfileState() {
    return this.likeProfileSource.asObservable()
  }

  get getDisplayedProfile() {
      return this.displayedProfileSource.asObservable();
  }

  get getNoConnectedFriendsArray () {
      return this.noConnectedFriendsArray.asObservable()
  }
}
