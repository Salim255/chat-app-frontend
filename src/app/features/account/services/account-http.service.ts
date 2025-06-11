import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Account } from "../models/account.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Coordinates } from "src/app/core/services/geolocation/geolocation.service";
import { Gender, InterestedIn } from "../../auth/components/create-profile/create-profile.component";
import { SexOrientation } from "../components/dating-profile/edit-profile/edit-sex-orientation/edit-sex.component";

export type FetchAccountDto = {
  status: string,
  data: { profile: Account  }
}

export type UpdateCoordinatesResponse = {
  status: string,
  data: { coordinates: Coordinates }
}

export type UpdateBioPayLoad = {
  bio: string;
  profileId: number;
}

export type UpdateGenderPayLoad = {
  gender: Gender;
  profileId: number;
}

export type UpdateHomePayLoad = {
  city: string;
  country: string;
  profileId: number;
}

export type UpdateCoordinatesPayload = {
  profileId: number,
  longitude: number,
  latitude: number,
}

export type AgeRange = {
  profileId: number;
  minAge: number ;
  maxAge: number;
}

export type InterestedInPayload = {
  profileId: number;
  interestedIn: InterestedIn;
}
export type LookingForOptions = 'chat' | 'friendship'| 'casual'| 'long_term';

export type LookingForPayload = {
  profileId: number;
  lookingFor: LookingForOptions[];
}

export type DistanceRange = {
  profileId: number;
  distanceRange: number;
}

export type SexOrientationPayload = {
  profileId: number;
  sexOrientation: SexOrientation;
}

export type ChildrenStatusPayload = {
  profileId: number;
  status: boolean;
}

export type UpdateEducationPayload = {
  profileId: number;
  education: string;
}

export type UpdateHeightPayload = {
  profileId: number;
  height: number;
}


@Injectable({providedIn: 'root'})

export class AccountHttpService {
  private ENV = environment;
  baseUrl = `${this.ENV.apiUrl}/profiles`;

  constructor(private http:  HttpClient){}

  getAccount(): Observable<FetchAccountDto>{
    return this.http.get<FetchAccountDto>(`${this.baseUrl}`)
  }

  updateAccountCoordinates(updatePayload: UpdateCoordinatesPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-location`, updatePayload)
  }

  updateBio(updatePayload: UpdateBioPayLoad): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-bio`, updatePayload)
  }

  updateGender(updatePayload: UpdateGenderPayLoad): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-gender`, updatePayload)
  }

  updateHome(updatePayload: UpdateHomePayLoad): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-home`, updatePayload)
  }

  updateAgePreference(agePayload: AgeRange):Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-age-range`, agePayload)
  }

  updateDistancePreference(distanceRange: DistanceRange):Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-distance-range`, distanceRange)
  }

  updateLookingForOption( options: LookingForPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-looking-for`, options)
  }

  updateInterestedInOption( payload: InterestedInPayload ): Observable<FetchAccountDto>{
    console.log(payload, "Hello from HTTP");
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-interests`, payload)
  }
  updateSexOrientation( payload: SexOrientationPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-sex-orientation`, payload)
  }

  updateChildrenStatus( payload: ChildrenStatusPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-children`, payload)
  }

  updateEducation( payload: UpdateEducationPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-education`, payload)
  }

   updateHeight( payload: UpdateHeightPayload ): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-height`, payload)
  }
}
