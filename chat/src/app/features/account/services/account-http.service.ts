import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Account } from "../models/account.model";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Coordinates } from "src/app/core/services/geolocation/geolocation.service";
import { Gender } from "../../auth/components/create-profile/create-profile.component";

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

export type UpdateCoordinatesPayload = {
  profileId: number,
  longitude: number,
  latitude: number,
}

@Injectable({providedIn: 'root'})

export class AccountHttpService {
  private ENV = environment;
  baseUrl = `${this.ENV.apiUrl}/profiles`;

  constructor(private http:  HttpClient){}
  getAccount(): Observable<FetchAccountDto>{
    return this.http.get<FetchAccountDto>(`${this.baseUrl}`)
  }

  patchAccountCoordinates(updatePayload: UpdateCoordinatesPayload ): Observable<UpdateCoordinatesResponse>{
    return this.http.patch<UpdateCoordinatesResponse>(`${this.baseUrl}/update-location`, updatePayload)
  }

  updateBio(updatePayload: UpdateBioPayLoad): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-bio`, updatePayload)
  }

  updateGender(updatePayload: UpdateGenderPayLoad): Observable<FetchAccountDto>{
    return this.http.patch<FetchAccountDto>(`${this.baseUrl}/update-gender`, updatePayload)
  }
}
