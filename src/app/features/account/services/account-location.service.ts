import { Injectable } from "@angular/core";
import { EMPTY, from, map, Observable, switchMap } from "rxjs";
import { GeolocationService } from "src/app/core/services/geolocation/geolocation.service";
import { AccountHttpService, FetchAccountDto, UpdateCoordinatesPayload, UpdateCoordinatesResponse } from "./account-http.service";

@Injectable({providedIn: 'root'})

export class AccountLocationService {
  constructor(
    private accountHttpService: AccountHttpService,
    private geolocationService: GeolocationService,
  ){}

  updateAccountCoordinates(profileId: number): Observable<FetchAccountDto> {
    // Convert the Promise from geolocation into an Observable
    return from(this.geolocationService.getCurrentCoordinates()).pipe(
      switchMap((coordinates) => {
        if(!coordinates) return EMPTY;
        console.log(coordinates);
        // Otherwise, send coordinates to the backend
        const payload :  UpdateCoordinatesPayload = {profileId, ...coordinates}
        return this.accountHttpService.updateAccountCoordinates(payload).pipe(
          map(response => {
            return response;
          })
        );
      })
    )
  }
}
