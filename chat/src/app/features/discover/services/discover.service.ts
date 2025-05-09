import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ItsMatchModalService } from '../../matches/services/its-match-modal.service';
import { Profile } from '../model/profile.model';
import {
  AcceptedMatchResponse,
  DiscoverHttpService,
  InitiateMatchResponse,
  PotentialMatchesResponse,
} from './discover-http.service';
import { Match } from '../../matches/models/match.model';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';

export type DisableProfileSwipe = {
  disableSwipe: boolean;
  profile: Profile;
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
  private potentialMatches = new BehaviorSubject<Profile[]>([]);
  private displayedProfileSource = new BehaviorSubject<Profile | null>(null);
  private profileToRemoveSource = new BehaviorSubject<number | null>(null);
  private discoverProfileToggleSource = new BehaviorSubject<DisableProfileSwipe | null>(null);
  private profileInteractionTypeSource = new BehaviorSubject<InteractionType | null>(null);

  constructor(
    private itsMatchModalService: ItsMatchModalService,
    private  discoverHttpService:  DiscoverHttpService,
  ) {}

  initiateMatchRequest(likedProfile: Profile): Observable<InitiateMatchResponse>{
    return this.discoverHttpService.postMatch( likedProfile.user_id)
     .pipe(tap(() => this.profileToRemoveSource.next(likedProfile.user_id)));
  }

  fetchPotentialMatches(): Observable<PotentialMatchesResponse> {
    return this.discoverHttpService.getPotentialMatches().pipe(
      tap((response) => {
        this.potentialMatches.next(response.data.profiles);
      })
    );
  }

  acceptMatchRequest(likedProfile: Profile): Observable<AcceptedMatchResponse>{
    return this.discoverHttpService.patchMatch(likedProfile.match_id).pipe(
      tap((response) => {
        this.profileToRemoveSource.next(likedProfile.user_id);
        if (response?.data.match) {
            this.itsMatchModalService.openItsMatchModal(response?.data.match);
        }
      })
  );
  }

  private buildPartner(match: Match): Partner {
      const builtPartner: Partner  =
      {
        partner_id: match.partner_id,
        created_at: match.match_created_at,
        updated_at: match.match_updated_at,
        name: match.name,
        avatar: match.avatar ?? StringUtils.getAvatarUrl(match.avatar),
        connection_status: match.connection_status,
        public_key: match.public_key,
        images: []
      }
      return builtPartner;
  }

  onDiscoverProfileToggle(actionPayload: DisableProfileSwipe): void {
    this.discoverProfileToggleSource.next(actionPayload);
  }

  get getDiscoverProfileToggleStatus(): Observable<DisableProfileSwipe | null>  {
    return this.discoverProfileToggleSource.asObservable();
  }

  get getProfileInteractionType(): Observable<InteractionType | null> {
    return this.profileInteractionTypeSource.asObservable();
  }

  setProfileInteractionType(interActionType: InteractionType | null): void {
    this.profileInteractionTypeSource.next(interActionType);
  }

  setDisplayedProfile(data: Profile): void {
    this.displayedProfileSource.next(data);
  }

  // We get the Id of the current profile
  get getProfileToRemoveId(): Observable<number | null> {
    return this.profileToRemoveSource.asObservable();
  }

  get getDisplayedProfile(): Observable<Profile | null> {
    return this.displayedProfileSource.asObservable();
  }

  get getPotentialMatchesArray(): Observable<Profile[]> {
    return this.potentialMatches.asObservable();
  }
}
