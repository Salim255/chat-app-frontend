import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ItsMatchModalService } from '../../matches/services/its-match-modal.service';
import { Discover } from '../model/discover.model';
import { Match } from '../../matches/models/match.model';
import { ProfileUtils } from 'src/app/shared/utils/profiles-utils';

export type DisableProfileSwipe = {
  disableSwipe: boolean;
  profile: Discover;
};

export enum InteractionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  UNDO = 'undo',
  SuperLike = 'super-like',
  MESSAGE = 'message',
}

export type InitiatedMatchDto =  {
  id: number;
  to_user_id: number;
  from_user_id: number;
  status: 1;
}


@Injectable({
  providedIn: 'root',
})
export class DiscoverService {
  private ENV = environment;
  private potentialMatches = new BehaviorSubject<Discover[]>([]);
  private displayedProfileSource = new BehaviorSubject<Discover | null>(null);
  private profileToRemoveSource = new BehaviorSubject<number | null>(null);

  private likeProfileSource = new BehaviorSubject<InteractionType | null>(null);
  private discoverProfileToggleSource = new BehaviorSubject<DisableProfileSwipe | null>(null);

  private profileInteractionTypeSource = new BehaviorSubject<InteractionType | null>(null);

  constructor(
    private http: HttpClient,
    private itsMatchModalService: ItsMatchModalService
  ) {}

  fetchPotentialMatches():Observable<{ status: string, data: { users: Discover[] }}> {
    return this.http.get<{ status: string, data: { users: Discover[] }}>(`${this.ENV.apiUrl}/users/discover`).pipe(
      tap((response) => {
        this.potentialMatches.next(response.data.users);
      })
    );
  }

  acceptMatchRequest(likedProfile: Discover): Observable<{ status: string, data: { match: Match } }>{
    return this.http
    .patch<{ status: string, data: { match: Match } }>(
      `${this.ENV.apiUrl}/matches/${likedProfile.match_id}/accept`, {}
    ).pipe(
      tap((response) => {
        console.log(response.data, "hello")
        this.profileToRemoveSource.next(likedProfile.id);
      if (response?.data) {
          //const matchedData: Match = ProfileUtils.setProfileData(likedProfile);
         // this.itsMatchModalService.openItsMatchModal(matchedData);
        }
      })
  );
  }

  initiateMatchRequest(
    likedProfile: Discover,
  ): Observable<{ status: string; data: { match: InitiatedMatchDto } }>
  {
    return this.http
      .post<{ status: string; data: { match: InitiatedMatchDto } }>(`${this.ENV.apiUrl}/matches/initiate-match`, {  to_user_id: likedProfile.id })
      .pipe(
        tap((response) => {
          console.log(response)
          this.profileToRemoveSource.next(likedProfile.id);
       /*    if (response?.data && response.data.status === 2) {
            const matchedData: Partner = ProfileUtils.setProfileData(likedProfile);
            this.itsMatchModalService.openItsMatchModal(matchedData);
          } */
        })
    );
  }

  onDiscoverProfileToggle(actionType: DisableProfileSwipe) {
    this.discoverProfileToggleSource.next(actionType);
  }

  get getDiscoverProfileToggleStatus() {
    return this.discoverProfileToggleSource.asObservable();
  }

  get getProfileInteractionType() {
    return this.profileInteractionTypeSource.asObservable();
  }

  setProfileInteractionType(interActionType: InteractionType | null) {
    this.profileInteractionTypeSource.next(interActionType);
  }

  setDisplayedProfile(data: Discover) {
    this.displayedProfileSource.next(data);
  }

  fireLikeDislikeProfile(action: InteractionType | null) {
    this.likeProfileSource.next(action);
  }

  get getLikeProfileState() {
    return this.likeProfileSource.asObservable();
  }


  // We get the Id of the current profile
  get getProfileToRemoveId(): Observable<number | null> {
    return this.profileToRemoveSource.asObservable();
  }

  get getDisLikeProfileState() {
    return this.likeProfileSource.asObservable();
  }

  get getDisplayedProfile() {
    return this.displayedProfileSource.asObservable();
  }

  get getPotentialMatchesArray() {
    return this.potentialMatches.asObservable();
  }
}
