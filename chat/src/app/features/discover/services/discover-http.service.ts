import { Injectable } from "@angular/core";
import { InitiatedMatchDto } from "./discover.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Profile } from "../model/profile.model";
import { Match } from "../../matches/models/match.model";

export enum RequestStatus {
  Success = 'success',
  Error = 'fail',
}

export type InitiateMatchResponse = {
  status: RequestStatus;
  data: { match: InitiatedMatchDto };
}

export type PotentialMatchesResponse = {
   status: RequestStatus;
   data: { profiles:  Profile[] };
}

export type AcceptedMatchResponse = {
  status: RequestStatus;
  data: { match: Match }
}

@Injectable({providedIn: 'root'})
export class DiscoverHttpService {
  private ENV = environment;
  private basePath = `${this.ENV.apiUrl}/matches`;

  constructor(private http: HttpClient){}

  postMatch(likedUsedId: number): Observable<InitiateMatchResponse>{
    return this.http
      .post<InitiateMatchResponse>(`${this.basePath}/initiate-match`, {  to_user_id: likedUsedId })
  }

  getPotentialMatches(): Observable<PotentialMatchesResponse>{
    return this.http.get<PotentialMatchesResponse>(`${this.basePath}/discover`)
  }

  patchMatch(matchId: number): Observable<AcceptedMatchResponse> {
   return this.http
    .patch<AcceptedMatchResponse>(
      `${this.ENV.apiUrl}/matches/${matchId}/accept`, {}
    )
  }
}
