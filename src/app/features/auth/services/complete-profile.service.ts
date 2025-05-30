import { Injectable } from "@angular/core";
import { CompleteProfileHttpService, PostResponse } from "./complete-profile-http.service";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class CompleteProfileService {
  constructor(private completeProfileHttpService: CompleteProfileHttpService){}

  createProfile(profile: FormData): Observable<PostResponse>{
    return this.completeProfileHttpService.postProfile(profile);
  }
}
