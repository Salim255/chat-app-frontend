import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DatingProfileComponent } from "../components/dating-profile/dating-profile.component";
import { EditProfileFormComponent } from "../components/dating-profile/edit-profile/edit-profile-form/edit-profile-form.component";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { FetchAccountDto, UpdateBioPayLoad, UpdateGenderPayLoad, UpdateHomePayLoad } from "./account-http.service";
import { AccountService } from "./account.service";
import { AccountHttpService } from "./account-http.service";
import { Gender } from "../../auth/components/create-profile/create-profile.component";
import { SexOrientation } from "../components/dating-profile/edit-profile/edit-children/edit-children.component";

export enum FieldName {
  City ='city',
  Country = 'country',
  Gender = 'gender',
  Bio = 'bio',
  Children = 'children'
}

@Injectable({providedIn: 'root'})
export class EditingProfileService {
  constructor(
    private accountHttpService : AccountHttpService,
    private accountService: AccountService,
    private modalController: ModalController) {}

  async onPresentModal( ): Promise<void> {
    const modal = await this.modalController.create({
      component: DatingProfileComponent, }) ;
      await modal.present();
  }

  async onDismissModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  async onEditFormModal(fieldName: FieldName, value: string | boolean | SexOrientation | null): Promise<void> {
    const modal = await this.modalController.create({
      component: EditProfileFormComponent,componentProps: {
        fieldName: fieldName,
        fieldValue: value,
      },
    });
    await modal.present();
  }
  async onDismissEditFormModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  updateBio(bio: string): Observable<FetchAccountDto | null>{
    const profileId = this.accountService.getAccountId;
    if (!profileId || !bio?.trim() ) return EMPTY;

    const payLoad: UpdateBioPayLoad = {bio, profileId}
    return this.accountHttpService.updateBio(payLoad).pipe(
      tap((result) => {
        if(!result.data.profile) return;
        this.accountService.setAccountWithUpdate(result.data.profile);
      }),
      catchError(error => {
      return EMPTY;
      })
    )
  }

  updateGender(gender: Gender): Observable<FetchAccountDto | null>{
    const profileId = this.accountService.getAccountId;
    if (!profileId) return EMPTY;

    const payLoad: UpdateGenderPayLoad = { gender, profileId};
    return this.accountHttpService.updateGender(payLoad).pipe(
      tap((result) => {
        console.log(result);
        if(!result.data.profile) return;
        this.accountService.setAccountWithUpdate(result.data.profile);
      }),
      catchError(error => {
      return EMPTY;
  })
    )
  }

  updateHome( home: { country: string; city: string }):Observable<FetchAccountDto | null>{
    const profileId = this.accountService.getAccountId;
    if (!profileId) return EMPTY;

    const payLoad: UpdateHomePayLoad = { ...home, profileId};
    return this.accountHttpService.updateHome(payLoad).pipe(
      tap((result) => {
        if(!result.data.profile) return;
        this.accountService.setAccountWithUpdate(result.data.profile);
      }),
      catchError(error => {
      return EMPTY;
  })
    )
  }
}
