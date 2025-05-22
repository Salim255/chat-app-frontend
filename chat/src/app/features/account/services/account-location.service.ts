import { Injectable } from "@angular/core";
import { EMPTY, from, map, Observable, switchMap } from "rxjs";
import { Coordinates, GeolocationService } from "src/app/core/services/geolocation/geolocation.service";
import { AccountHttpService, UpdateCoordinatesPayload, UpdateCoordinatesResponse } from "./account-http.service";

@Injectable({providedIn: 'root'})

export class AccountLocationService {
  constructor(
    private accountHttpService: AccountHttpService,
    private geolocationService: GeolocationService,
  ){}

  updateAccountCoordinates(profileId: number): Observable< UpdateCoordinatesResponse> {
    // Convert the Promise from geolocation into an Observable
    return from(this.geolocationService.getCurrentCoordinates()).pipe(
      switchMap((coordinates) => {
        if(!coordinates) return EMPTY;
        // Otherwise, send coordinates to the backend
        const payload :  UpdateCoordinatesPayload = {profileId, ...coordinates}
        return this.accountHttpService.patchAccountCoordinates(payload).pipe(
          map(response => {
            return response;
          })
        );
      })
    )
  }
}
