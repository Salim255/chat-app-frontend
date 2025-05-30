import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Profile } from "../model/profile.model";
import { Match } from "../../matches/models/match.model";

export enum RequestStatus {
  Success = 'success',
  Error = 'fail',
}

export type MatchResponse = {
  status: RequestStatus;
  data: { match: Match };
}

export type PotentialMatchesResponse = {
   status: RequestStatus;
   data: { profiles:  Profile[] };
}

@Injectable({providedIn: 'root'})
export class DiscoverHttpService {
  private ENV = environment;
  private basePath = `${this.ENV.apiUrl}/matches`;

  constructor(private http: HttpClient){}

  postMatch(likedUsedId: number): Observable<MatchResponse>{
    return this.http
      .post<MatchResponse>(`${this.basePath}/initiate-match`, {  to_user_id: likedUsedId })
  }

  getPotentialMatches(): Observable<PotentialMatchesResponse>{
    return this.http.get<PotentialMatchesResponse>(`${this.basePath}/discover`)
  }

  patchMatch(matchId: number): Observable<MatchResponse> {
   return this.http
    .patch<MatchResponse>(
      `${this.ENV.apiUrl}/matches/${matchId}/accept`, {}
    )
  }
}
