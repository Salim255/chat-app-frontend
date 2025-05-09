import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { formatDate } from "@angular/common";
import { CompleteProfileService } from "src/app/features/complete-profile/services/complete-profile.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

export enum InterestedIn {
  Men = 'men',
  Women = 'women',
  Both = 'both'
}

export enum Gender {
  Man = 'man',
  Woman = 'woman',
  Other = 'other',
}
export  type ProfilePayload = {
  name: string;
  birthDate: Date;
  gender:  Gender;
  country: string;
  city: string;
  interestedIn: InterestedIn
}

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  standalone: false,
})

export class CreateProfileComponent {
  @ViewChild('birthDatePicker', { static: false }) birthDatePicker!: IonDatetime;
  profileForm!: FormGroup;

  maxDate: string = new Date().toISOString(); // prevent future date
  InterestedIn = InterestedIn;

  constructor(
    private fb: FormBuilder,
    private completeProfileService: CompleteProfileService,
    private location: Location,
    private router:  Router,
  ){
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0]; // format: YYYY-MM-DD
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: [null, Validators.required],
      gender: [null, Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      interestedIn: [null, Validators.required]
    });
  }

  onClose(): void{
    this.location.back();
  }

  onDateSelected(event: CustomEvent): void {
    const rawDate = event.detail.value;
    this.profileForm.patchValue({ birthDate: rawDate });
  }

  formatDate(rawDate: Date): string {
    const formatted = formatDate(rawDate, 'dd/MM/y', 'en-US');
    return formatted;
  }
  onSubmit(): void{
    if(this.profileForm.invalid) return;

    const profile: ProfilePayload =
      {
        birthDate: this.profileForm.value.birthDate,
        gender: this.profileForm.value.gender,
        country: this.profileForm.value.country,
        city: this.profileForm.value.city,
        interestedIn: this.profileForm.value.interestedIn,
        name: this.profileForm.value.name,
      }
    this.completeProfileService.createProfile(profile).subscribe({
      next:(res) => {
        console.log(res, 'hello from creae profile');
        this.router.navigateByUrl('/tabs/discover');
      },
      error: (err) => {
        console.log(err);
      }
    })
    console.log(profile);
  }
}
