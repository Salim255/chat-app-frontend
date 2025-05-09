import { Component, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { formatDate } from "@angular/common";
import { CompleteProfileService } from "../../services/complete-profile.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PhotoService } from "src/app/core/services/media/photo.service";

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
    private router: Router,
    private photoService: PhotoService
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
      interestedIn: [null, Validators.required],
      photos: this.fb.array([
        this.fb.control<string|null>(null),
        this.fb.control<string|null>(null),
        this.fb.control<string|null>(null),
        this.fb.control<string|null>(null),
      ], Validators.maxLength(3)),
    });
  }

  // in your component class
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackByIndex(index: number): number {
    return index;
  }

  onClose(): void{
    this.location.back();
  }

  onDateSelected(event: CustomEvent): void {
    const rawDate = event.detail.value;
    this.profileForm.patchValue({ birthDate: rawDate });
  }


  async onTakePhoto(slotIndex: number): Promise<void>{
    if (this.photos.at(slotIndex).value) {
      this.removePhoto(slotIndex);
      return
    }

    const base64String = await this.photoService.takePicture();
    if (!base64String) return;
  
    // Handle photo upload logic
    // This Ensure the base64String is in the correct format for displaying in an image tag
    const dataUri = `data:image/jpeg;base64,${base64String}`;
    // Push it into the FormArray
    //this.photos.push(this.fb.control(dataUri));
    this.photos.at(slotIndex).setValue(dataUri);
  }


  removePhoto(slotIndex: number): void {
    this.photos.at(slotIndex).reset();
  }

  get photos(): FormArray {
    return this.profileForm.get('photos') as FormArray;
  }
  
  formatDate(rawDate: Date): string {
    const formatted = formatDate(rawDate, 'dd/mm/y', 'en-US');
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
      next:() => {
        this.router.navigateByUrl('/tabs/discover');
      },
      error: (err) => {
        console.log(err);
      }
    })
    console.log(profile);
  }
}
