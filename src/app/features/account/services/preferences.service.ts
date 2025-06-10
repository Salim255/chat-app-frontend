import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { PreferencesComponent } from "../components/preferences/preferences.component";
import { PrefFormComponent } from "../components/preferences/pref-form/pref-form.component";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { AgeRange, DistanceRange, FetchAccountDto, InterestedInPayload, LookingForOptions, LookingForPayload } from "./account-http.service";
import { AccountHttpService } from "./account-http.service";
import { AccountService } from "./account.service";
import { MatchesService } from "../../matches/services/matches.service";
import { InterestedIn } from "../../auth/components/create-profile/create-profile.component";

export enum PrefFieldName {
  Age ='age',
  Distance = 'distance',
  LookingFor = 'looking-for',
  InterestedIn = 'interested-in'
}

@Injectable({providedIn: 'root'})

export class PreferencesService {
  constructor(
    private matchesService: MatchesService,
    private accountService:AccountService ,
    private accountHttpService: AccountHttpService,
    private modalController: ModalController){}

  updateAgeRage(ageRange: { minAge: number, maxAge: number } ): Observable <FetchAccountDto | null>{
     const profileId = this.accountService.getAccountId;
    if (!profileId ) return EMPTY;
    const ageRangPayload: AgeRange = {...ageRange, profileId}
    return this.accountHttpService.updateAgePreference(ageRangPayload)
    .pipe(
      tap((response) => {
         if(!response.data.profile) return;
        this.accountService.setAccountWithUpdate(response.data.profile);
        this.matchesService.fetchMatches();
      }),
      catchError(() => {
        return EMPTY;
      })
    )
  }

   updateDistanceRage(distanceRange: number ): Observable <FetchAccountDto | null>{
     const profileId = this.accountService.getAccountId;
    if (!profileId ) return EMPTY;
    const ageRangPayload: DistanceRange = { distanceRange, profileId}
    return this.accountHttpService.updateDistancePreference(ageRangPayload)
    .pipe(
      tap((response) => {
         if(!response.data.profile) return;
        this.accountService.setAccountWithUpdate(response.data.profile);
        this.matchesService.fetchMatches();
      }),
      catchError(() => {
        return EMPTY;
      })
    )
  }

  updateLookingForOptions(options: LookingForOptions[] ): Observable <FetchAccountDto | null>{
     const profileId = this.accountService.getAccountId;
    if (!profileId ) return EMPTY;
    const lookingForPayload: LookingForPayload = { lookingFor: options, profileId }
    return this.accountHttpService.updateLookingForOption(lookingForPayload)
    .pipe(
      tap((response) => {
         if(!response.data.profile) return;
        this.accountService.setAccountWithUpdate(response.data.profile);
        this.matchesService.fetchMatches();
      }),
      catchError(() => {
        return EMPTY;
      })
    )
  }

  updateInterestedInOption(option: InterestedIn ): Observable <FetchAccountDto | null>{

     const profileId = this.accountService.getAccountId;
    if (!profileId  || !option) return EMPTY;
    const lookingForPayload: InterestedInPayload  = { interestedIn: option, profileId }
    return this.accountHttpService.updateInterestedInOption(lookingForPayload)
    .pipe(
      tap((response) => {
         if(!response.data.profile) return;
        this.accountService.setAccountWithUpdate(response.data.profile);
        this.matchesService.fetchMatches();
      }),
      catchError(() => {
        return EMPTY;
      })
    )
  }

  async presentPreferences(): Promise<void>{
    const modal = await this.modalController.create({
      component: PreferencesComponent,
    });
    await modal.present();
  }

  async dismissPreferences(): Promise<void>{
    await this.modalController.dismiss();
  }

  async presentPrefForm(prefFieldName : PrefFieldName, value: any ): Promise<void>{
    const modal = await this.modalController.create({
      component: PrefFormComponent,
      componentProps:{
        fieldName:  prefFieldName,
        fieldValue: value
      },
    });

    await modal.present();
  }

  async dismissPrefForm(): Promise<void> {
    await  this.modalController.dismiss();
  }
}
