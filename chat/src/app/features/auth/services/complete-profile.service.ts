import { Injectable } from "@angular/core";
import { CompleteProfileHttpService, PostResponse } from "./complete-profile-http.service";
import { Observable } from "rxjs";
import { ProfilePayload } from "../components/create-profile/create-profile.component";


@Injectable({providedIn: 'root'})
export class CompleteProfileService {
  constructor(private completeProfileHttpService: CompleteProfileHttpService){}

  createProfile(profile: ProfilePayload): Observable<PostResponse>{
    return this.completeProfileHttpService.postProfile(profile);
  }
}
