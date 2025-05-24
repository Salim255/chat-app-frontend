import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { formatDate } from "@angular/common";
import { CompleteProfileService } from "../../services/complete-profile.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PhotoCaptureResult, PhotoService } from "src/app/core/services/media/photo.service";


export enum InterestedIn {
  Men = 'men',
  Women = 'women',
  Both = 'both'
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
type photo = { photo: string }
export  type ProfilePayload = {
  name: string;
  birthDate: Date;
  gender:  Gender;
  country: string;
  city: string;
  interestedIn: InterestedIn;
  photos: photo []
}

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  standalone: false,
})

export class CreateProfileComponent {
    @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('birthDatePicker', { static: false }) birthDatePicker!: IonDatetime;
  profileForm!: FormGroup;
  maxDate: string = new Date().toISOString(); // prevent future date
  InterestedIn = InterestedIn;
  private clickedPhotoIndex: number | null = null;
  // Parallel array of FormData objects (or null) for submission
  private photoUploads: (FormData | null)[] = [null, null, null, null];

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

    this.profileForm = this.fb.group(
      {
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
        ], Validators.maxLength(4)),
      });
  }

  // in your component class
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackByIndex(index: number): number {
    return index;
  }


  onFileSelected(event: Event):void {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length || this.clickedPhotoIndex === null) return;

    const file = input.files[0];
    const result =  this.photoService.webPlatformFileUpload(file);
    if (result && result as PhotoCaptureResult) {
      this.photoUploads[this.clickedPhotoIndex] = result.formData;
        this.photos.at(this.clickedPhotoIndex).setValue(result.preview );
    }
  }

  onClose(): void{
    this.location.back();
  }

  onDateSelected(event: CustomEvent): void {
    const rawDate = event.detail.value;
    this.profileForm.patchValue({ birthDate: rawDate });
  }


  async onTakePhoto(slotIndex: number): Promise<void>{
   try {
      if (this.photos.at(slotIndex).value) {
        this.photos.at(slotIndex).reset();
        this.photoUploads[slotIndex] = null;
        return;
      }

      const { preview, formData }: PhotoCaptureResult = await this.photoService.takePicture( );
      if (!preview || !formData) return;

      // 1) Set preview for UI
      this.photos.at(slotIndex).setValue(preview);

      // 2) Store the FormData for submission later
      this.photoUploads[slotIndex] = formData;
   } catch (error) {
       if (error instanceof Error &&  error.message === 'web-platform') {
        this.onIconClick(slotIndex)
      }
   }
  }

  onIconClick(idx: number): void {
    // Store the index and trigger the global file input
    this.clickedPhotoIndex  = idx;
    const input = this.fileInputRef.nativeElement;
    input.value = ''; // reset input so it always triggers change
    input.click();
  }

  removePhoto(slotIndex: number): void {
    this.photos.at(slotIndex).reset();
  }

  get photos(): FormArray {
    return this.profileForm.get('photos') as FormArray;
  }

  formatDate(rawDate: Date): string {
    const formatted = formatDate(rawDate, 'dd/MM/y', 'en-US');
    return formatted;
  }

  onSubmit(): void{
    if(this.profileForm.invalid) return;

    // Copy each slot’s pre-built FormData into one payload:
    const multiPart = new FormData();
    for (let i = 0; i < this.photoUploads.length; i++) {
      const fd = this.photoUploads[i];
      if (fd) {
        Array.from((fd as FormData)
        .getAll('photo'))
        .forEach((file) => {
          multiPart.append('photos', file as File,  (file as File).name);
        });
      }
    }

    // Append other fields…
    Object.entries(this.profileForm.value)
    .filter(([k]) => k !== 'photos')
    .forEach(([key, val]) => multiPart.append(key, val as string));

    this.completeProfileService.createProfile(multiPart).subscribe({
      next:() => {
        this.router.navigateByUrl('/tabs/discover');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
