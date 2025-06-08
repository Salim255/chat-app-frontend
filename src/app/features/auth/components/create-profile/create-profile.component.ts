import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { CompleteProfileService } from "../../services/complete-profile.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PhotoCaptureResult, PhotoService } from "src/app/core/services/media/photo.service";
import { Coordinates, GeolocationService } from "src/app/core/services/geolocation/geolocation.service";


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

export class CreateProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('birthDatePicker', { static: false }) birthDatePicker!: IonDatetime;

  profileForm!: FormGroup;
  InterestedIn = InterestedIn;
  private clickedPhotoIndex: number | null = null;
  // Parallel array of FormData objects (or null) for submission
  private photoUploads: (FormData | null)[] = [null, null, null, null];

  locationSuggestions: string[] = [];
  selectedLocation: string = '';

  constructor(
    private fb: FormBuilder,
    private completeProfileService: CompleteProfileService,
    private location: Location,
    private router: Router,
    private photoService: PhotoService,
    private geolocationService: GeolocationService,
  ){
    this.profileForm = this.fb.group(
      {
        name: ['', Validators.required],
        birthDate: ['',
          [
            Validators.required,
            this.completeProfileService.dateFormatValidator()
          ]
        ],
        gender: [null, Validators.required],
        country: [],
        city: [],
        interestedIn: [null, Validators.required],
        latitude: [],
        longitude: [],
        photos: this.fb.array([
          this.fb.control<string|null>(null),
          this.fb.control<string|null>(null),
          this.fb.control<string|null>(null),
          this.fb.control<string|null>(null),
        ], Validators.maxLength(4)),
      });
  }
  ngOnInit(): void {
    this.getCoordinates();
  }

  onDateInput(event: any): void {
    let input = event.detail.value || '';
    input = input.replace(/\D/g, '');

    // Limit to 12 digits max (DDMMYYYY)
    if (input.length > 12) {
      input = input.slice(0, 12);
    }

    // Add spaces around slashes for clarity
    if (input.length >= 5) {
      input = `${input.slice(0, 2)} / ${input.slice(2, 4)} / ${input.slice(4)}`;
    } else if (input.length >= 3) {
      input = `${input.slice(0, 2)} / ${input.slice(2)}`;
    }

    this.profileForm.get('birthDate')?.setValue(input, { emitEvent: false });
  }

  async getCoordinates(): Promise<Coordinates> {
   const result =  await this.geolocationService.getCurrentCoordinates();
   this.profileForm.get('longitude')?.setValue(result.longitude);
   this.profileForm.get('latitude')?.setValue(result.latitude);
   return result;
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
    .forEach(([key, val]) => {
      if (key === 'birthDate') {
        if (typeof val === 'string') {
          // Convert the formatted string to a Date object
          const [dayStr, monthStr, yearStr] = val.split('/').map((p: string) => p.trim());
          const dateObj = new Date(+yearStr, +monthStr - 1, +dayStr);
          if (!isNaN(dateObj.getTime())) {
            multiPart.append(key, dateObj.toISOString()); // or .toLocaleDateString(), depending on backend
          } else {
            // Handle invalid date (if somehow it passed validation)
            multiPart.append(key, '');
          }
        }
      } else {
        multiPart.append(key, val as string);
      }
    });


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
