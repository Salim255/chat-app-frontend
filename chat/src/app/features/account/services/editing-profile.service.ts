import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DatingProfileComponent } from "../components/dating-profile/dating-profile.component";
import { EditProfileFormComponent } from "../components/dating-profile/edit-profile/edit-profile-form/edit-profile-form.component";
import { catchError, EMPTY, Observable, of, tap } from "rxjs";
import { FetchAccountDto, UpdateBioPayLoad } from "./account-http.service";
import { AccountService } from "./account.service";
import { AccountHttpService } from "./account-http.service";

export enum FieldName {
  City ='city',
  Country = 'country',
  Gender = 'gender',
  Bio = 'bio',
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

  async onEditFormModal(fieldName: FieldName, value: string): Promise<void> {
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
}
