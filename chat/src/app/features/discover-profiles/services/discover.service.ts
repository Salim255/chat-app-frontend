import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, tap } from "rxjs";
import { Member } from "src/app/shared/interfaces/member.interface";

@Injectable({
  providedIn: 'root'
})

export class DiscoverService {
  private ENV = environment;
  private noConnectedFriendsArray = new BehaviorSubject<  Member [] > ([]);
  private  displayedProfileSource = new BehaviorSubject < Member | null>(null) ;
  private profileToRemoveSource = new BehaviorSubject <number | null> (null);
  private foreignersListStatusSource = new BehaviorSubject < string | null > (null);
  private likeProfileSource = new BehaviorSubject < string > ('empty')

  constructor (private http: HttpClient) { }

  fetchUsers(){
    return this.http.get<any>(`${this.ENV.apiUrl}/friends/get-non-friends`)
    .pipe(
      tap((response) => {
        this.noConnectedFriendsArray.next(response.data)
      })
    )
  }

  likeProfile (friendId: number) {
    return this.http.post<any>(`${this.ENV.apiUrl}/friends`,
    { friend_id: friendId })
  }

  setDisplayedProfile (data: Member) {
     this.displayedProfileSource.next(data);
  }

  triggerLikeProfile() {
    console.log( "Hello");
    this.likeProfileSource.next('like')
  }

  get getLikeProfileState() {
    return this.likeProfileSource.asObservable()
  }

  triggerDislikeProfile(state: any) {
    console.log(state, "Hello");
    this.likeProfileSource.next('dislike')
  }

  setForeignersListStatus(status: string) {
    this.foreignersListStatusSource.next(status)
  }

  // We set the profile id of the current profile
  setProfileToRemove(profileId: number){
    this.profileToRemoveSource.next(profileId);
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
