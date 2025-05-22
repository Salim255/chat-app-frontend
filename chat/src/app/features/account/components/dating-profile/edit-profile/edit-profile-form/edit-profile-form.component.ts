import { Component, Input, OnInit} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Gender, InterestedIn } from "src/app/features/auth/components/create-profile/create-profile.component";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";
import { GeolocationService } from "src/app/core/services/geolocation/geolocation.service";

export  type EditProfilePayload = {
  name: string;
  birthDate: Date;
  gender:  Gender;
  country: string;
  city: string;
  interestedIn: InterestedIn;
  photos: string,
  bio: string,
}


@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss'],
  standalone: false,
})

export class EditProfileFormComponent implements OnInit {
  @Input() fieldValue!: string;
  @Input() fieldName!: FieldName;
  locationSuggestions: string[] = [];
  selectedLocation: string = '';
  FieldName = FieldName;
  gender = {
      male: false,
      female: false,
      other: false,
    };

  editProfileFormFields!: FormGroup;
  constructor(
    private geolocationService: GeolocationService,
    private editingProfileService: EditingProfileService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    if(this.fieldName) this.buildForm();
  }

  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} characters remaining`;
  }

  onSubmit(): void{
    if(this.fieldName === FieldName.Bio) {
      this.editingProfileService
      .updateBio(this.editProfileFormFields.get(this.fieldName)?.value).subscribe();
    }

    if(this.fieldName === FieldName.Gender) {
      this.editingProfileService
      .updateGender(this.editProfileFormFields.get(this.fieldName)?.value).subscribe();
    }
    this.editingProfileService.onDismissEditFormModal();
  }

   buildForm():void {
    if (this.fieldName) {
      this.editProfileFormFields = this.fb.group({
        [this.fieldName]: [this.fieldValue || '', Validators.required],
      });
    }
  }

  onSingleCheckboxSelect(value: string): void {
    this.editProfileFormFields.get(FieldName.Gender)?.setValue(value);
  }
  get genderControl(): FormControl {
    return this.editProfileFormFields.get(FieldName.Gender) as FormControl;
  }
  onSave(): void{
    this.editingProfileService.onDismissEditFormModal();
  }

  onCancelEditing(): void{
    this.editingProfileService.onDismissEditFormModal();
  }
 onLocationSuggestionSelect(location: string): void {
  this.selectedLocation = location;

  // Example: if the format is "City, Country, Continent"
  const parts = location.split(',').map(part => part.trim());
  const city = parts[0] || '';
  const country = parts[1] || '';

  // Update form controls
  this.editProfileFormFields.get(FieldName.City)?.setValue(city);
  this.editProfileFormFields.get(FieldName.Country)?.setValue(country);

  // Update search bar input as well (you can bind it with [(ngModel)] or patch form)
  this.editProfileFormFields.get(FieldName.City)?.markAsTouched();
  this.locationSuggestions = []; // Clear suggestions
}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  onCityInput(event: any): void {
  const value = event.detail.value;
  this.geolocationService.searchLocationsByText(value).subscribe(suggestions => {
    this.locationSuggestions = suggestions;
    console.log('Location suggestions:', this.locationSuggestions);
  });
}
}
