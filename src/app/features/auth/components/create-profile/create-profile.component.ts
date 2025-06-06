import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { formatDate } from "@angular/common";
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
  maxDate: string = new Date().toISOString(); // prevent future date
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
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0]; // format: YYYY-MM-DD

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
        country: ['', Validators.required],
        city: ['', Validators.required],
        day: [null, Validators.required],
        month: [null, Validators.required],
        year: [null, Validators.required],
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCoordinates();
    console.log(this.profileForm);
    //this.updateBirthDate();
    // latitude: 50.63256229343488, longitude: 3.0136012571323887
  }
  restrictDateInput(event: any): void {
    console.log(event, "hello")
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9/]/g, ''); // allow only digits and slashes
    this.profileForm.get('birthDate')?.setValue(input.value);
}
   onCityInput(event: any): void {
    const value = event.detail.value;
    this.geolocationService.searchLocationsByText(value).subscribe(suggestions => {
      this.locationSuggestions = suggestions;
      console.log('Location suggestions:', this.locationSuggestions);
    });
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
   const cor =  await this.geolocationService.getCurrentCoordinates();
   this.profileForm.get('longitude')?.setValue(cor.longitude);
   this.profileForm.get('latitude')?.setValue(cor.latitude);
   return cor
  }

  onLocationSuggestionSelect(location: string): void {
    this.selectedLocation = location;

    // Example: if the format is "City, Country, Continent"
    const parts = location.split(',').map(part => part.trim());
    const city = parts[0] || '';
    const country = parts[1] || '';

    // Update form controls
    this.profileForm.get('city')?.setValue(city);
    this.profileForm.get('country')?.setValue(country);

    // Update search bar input as well
    this.locationSuggestions = []; // Clear suggestions
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
