import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, tap } from "rxjs";
import { Member } from "src/app/shared/interfaces/member.interface";
import { ProfileUtils } from "src/app/shared/utils/profiles-utils";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { ItsMatchModalService } from "../../matches/services/its-match-modal.service";

export type DisableProfileSwipe ={
  disableSwipe: boolean;
  profile: Member;
}

export type  InteractionType =  'like' | 'dislike' | 'undo' | 'super-like' | 'message';

@Injectable({
  providedIn: 'root'
})

export class DiscoverService {
  private ENV = environment;
  private noConnectedFriendsArray = new BehaviorSubject<  Member [] > ([]);
  private  displayedProfileSource = new BehaviorSubject < Member | null>(null) ;
  private profileToRemoveSource = new BehaviorSubject <number | null> (null);
  private foreignersListStatusSource = new BehaviorSubject < string | null > (null);
  private likeProfileSource = new BehaviorSubject < string > ('empty');
  private discoverProfileToggleSource = new BehaviorSubject < DisableProfileSwipe | null > (null)

  private profileInteractionTypeSource = new  BehaviorSubject <InteractionType | null > (null);

  constructor (private http: HttpClient, private itsMatchModalService: ItsMatchModalService) { }

  fetchUsers(){
    return this.http.get<any>(`${this.ENV.apiUrl}/friends/get-non-friends`)
    .pipe(
      tap((response) => {
        console.log(response.data, "hello from service")
        this.noConnectedFriendsArray.next(response.data)
      })
    )
  }

  onDiscoverProfileToggle(actionType: DisableProfileSwipe) {
    console.log(actionType, "Hello")
    this.discoverProfileToggleSource.next(actionType)
  }

  get getDiscoverProfileToggleStatus() {
    return this.discoverProfileToggleSource.asObservable();
  }

  likeProfile (likedProfile: Member) {
    console.log(likedProfile, "Hello from service")
    return this.http.post<any>(`${this.ENV.apiUrl}/friends`,
    { friend_id: likedProfile.user_id }).pipe(tap(response => {
      this.setProfileToRemove(likedProfile.user_id);
        if (response?.data && response.data.status === 2 ) {
          const matchedData: Partner = ProfileUtils.setProfileData(likedProfile);
          console.log( matchedData, "Hello from discver service 😍😍😍")
          this.itsMatchModalService.openItsMatchModal(matchedData);
        }
    }))
  }

  get getProfileInteractionType() {
    return this.profileInteractionTypeSource.asObservable()
  }
  setProfileInteractionType(interActionType: InteractionType) {
    console.log("hello proifk", interActionType)
    this.profileInteractionTypeSource.next(interActionType)
  }


  disLikeProfile() {

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
