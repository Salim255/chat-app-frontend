import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Profile } from "../models/profile.model";
import { ProfilePayload } from "../components/create-profile/create-profile.component";

export enum RequestStatus {
  Success = 'success',
  Error = 'fail',
}

export type PostResponse = {
  status: RequestStatus;
  data: {
    profile: Profile
  }
}
@Injectable({providedIn: 'root'})
export class CompleteProfileHttpService {
  private ENV = environment;
  constructor(private http: HttpClient){}

  postProfile(profile: ProfilePayload): Observable<PostResponse>{
    console.log(profile);
    return this.http.post<PostResponse>(`${this.ENV.apiUrl}/profiles`, profile);
  }
}
