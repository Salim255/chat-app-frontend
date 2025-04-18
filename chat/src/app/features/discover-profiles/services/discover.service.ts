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

export enum  InteractionType  {
  LIKE = 'like',
  DISLIKE = 'dislike',
  UNDO = 'undo',
  SuperLike = 'super-like',
  MESSAGE =  'message'
}

@Injectable({
  providedIn: 'root'
})

export class DiscoverService {
  private ENV = environment;
  private noConnectedFriendsArray = new BehaviorSubject<  Member [] > ([]);
  private displayedProfileSource = new BehaviorSubject < Member | null>(null) ;
  private profileToRemoveSource = new BehaviorSubject <number | null> (null);

  private likeProfileSource = new BehaviorSubject < InteractionType | null > (null);
  private discoverProfileToggleSource = new BehaviorSubject < DisableProfileSwipe | null > (null)

  private profileInteractionTypeSource = new  BehaviorSubject <InteractionType | null > (null);

  constructor(
    private http: HttpClient,
    private itsMatchModalService: ItsMatchModalService) { }

  fetchUsers(){
    return this.http.get<any>(`${this.ENV.apiUrl}/friends/non-friends`)
    .pipe(
      tap((response) => {
        this.noConnectedFriendsArray.next(response.data)
      })
    )
  }

  likeProfile (likedProfile: Member) {

    return this.http.post<any>(`${this.ENV.apiUrl}/friends`,
      { friend_id: likedProfile.user_id })
      .pipe(tap(response => {
        this.setProfileToRemove(likedProfile.user_id);
          if (response?.data && response.data.status === 2 ) {
            const matchedData: Partner = ProfileUtils.setProfileData(likedProfile);
            this.itsMatchModalService.openItsMatchModal(matchedData);
          }
      }))
  }

  onDiscoverProfileToggle(actionType: DisableProfileSwipe) {
    this.discoverProfileToggleSource.next(actionType)
  }

  get getDiscoverProfileToggleStatus() {
    return this.discoverProfileToggleSource.asObservable();
  }

  get getProfileInteractionType() {
    return this.profileInteractionTypeSource.asObservable()
  }

  setProfileInteractionType(interActionType: InteractionType | null) {
    this.profileInteractionTypeSource.next(interActionType)
  }

  setDisplayedProfile (data: Member) {
    this.displayedProfileSource.next(data);
  }

  fireLikeDislikeProfile(action: InteractionType | null) {
    this.likeProfileSource.next(action)
  }

  get getLikeProfileState() {
    return this.likeProfileSource.asObservable()
  }

  // We set the profile id of the current profile
  setProfileToRemove(profileId: number){
    this.profileToRemoveSource.next(profileId);
  }
  // We get the Id of the current profile
  get getProfileToRemoveId(){
     return this.profileToRemoveSource.asObservable();
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
