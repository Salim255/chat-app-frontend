import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from, map, switchMap, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences";
import { Foreigner } from "src/app/models/foreigner.model";


@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private ENV = environment;
  private noConnectedFriendsArray = new BehaviorSubject< Array < Foreigner > > ([]);
  private  displayedProfileSource = new BehaviorSubject <Foreigner | null>(null) ;
  private profileToRemoveSource = new BehaviorSubject <number | null> (null);
  private foreignersListStatusSource = new BehaviorSubject < string | null > (null);
  private likeProfileSource = new BehaviorSubject < string > ('empty')

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
      }),
      tap(res => {
        console.log(res);

      })
    )
  }

  setDisplayedProfile (data: Foreigner) {
     this.displayedProfileSource.next(data);
  }

  triggerLikeProfile(state: any) {
    console.log(state, "Hello");
    this.likeProfileSource.next(state)
  }

  get getLikeProfileState() {
    return this.likeProfileSource.asObservable()
  }

  triggerDislikeProfile(state: any) {
    console.log(state, "Hello");
    this.likeProfileSource.next(state)
  }

  setForeignersListStatus(status: string) {
      this.foreignersListStatusSource.next(status)
  }

  // We set the profile id of the current profile
  setProfileToRemove(profileId: number){
    console.log("🚀 Before emitting ID:", profileId);
    this.profileToRemoveSource.next(profileId);
    console.log("✅ After emitting ID:", profileId);
  }
  // We get the Id of the current profile
  get getProfileToRemoveId(){
     return this.profileToRemoveSource.asObservable();
  }

  get getForeignersListStatus () {
    return this.foreignersListStatusSource.asObservable();
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
