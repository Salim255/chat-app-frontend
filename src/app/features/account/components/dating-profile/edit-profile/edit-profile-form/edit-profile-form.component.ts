import { Component, Input, OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Gender, InterestedIn } from "src/app/features/auth/components/create-profile/create-profile.component";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";
import { SexOrientation } from "../edit-sex-orientation/edit-sex.component";

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
  @Input() fieldValue!:  string | boolean | SexOrientation | number |  null;
  @Input() fieldName!: FieldName;
  locationSuggestions: string[] = [];
  selectedLocation: string = '';
  FieldName = FieldName;

  selectedSexOrientation: SexOrientation | null = null;
  readonly sexOrientationList =  [
    'straight', 'heterosexual','gay',
    'lesbian','bisexual','asexual',
    'pansexual','queer','questioning',
    'demisexual',
  ]

  readonly childrenOptions = [`I don't have children`, 'I have children'];
  readonly genderOptions = [
      {title: 'female', value: 'woman'},
      {title: 'male', value: 'man'},
      {title: 'other', value: 'other'}
    ]
  genderValue: Gender | null = null;
  selectedChildrenOption: string | null = null;

  heightOptions: number[] = [];
  selectedHeight: number | null = null;
  editProfileFormFields!: FormGroup;
  educationTextValue: string = '' ;
  bioTextValue: string = '';

  constructor(
    private editingProfileService: EditingProfileService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    if(this.fieldName) this.buildForm();
    if (this.fieldName === this.FieldName.Children) {
      const value =  (this.fieldValue as boolean) === false
        ?  this.childrenOptions[0]
        : (this.fieldValue as boolean) === true
        ? this.childrenOptions[1]: null;
      this.selectedChildrenOption = value;
    }

    if(this.fieldName ===  this.FieldName.UserHeight) {
       this.heightOptions = Array.from({ length: 101 }, (_, i) => 120 + i);
       const value = this.fieldValue as number;
       this.selectedHeight = value ?? 170;
    }

    if(this.fieldName === this.FieldName.Education){
      const value = this.fieldValue as string;
      this.educationTextValue = value;
    }

    if (this.fieldName === this.FieldName.Bio) {
      const value  = this.fieldValue as string;
      this.bioTextValue = value;
    }

    if(this.fieldName === this.FieldName.Gender) {
      const value = this.fieldValue as Gender;
      this.genderValue =  value;
    }
  }

  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} characters remaining`;
  }

  onHeightPicker(event: Event): void{
    const customEvent = event  as CustomEvent<{ value: number }>;
    const value = customEvent .detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value);
  }

  onBioInput(event: Event): void{
    const customEvent = event  as CustomEvent<{ value: string }>;
    const value = customEvent.detail.value.trim();
     if (value.length) {
      this.bioTextValue = value;
      this.editProfileFormFields.get(this.fieldName)?.setValue(value);
    } else {
      this.editProfileFormFields.get(this.fieldName)?.setValue(null);
    }
  }

  onEducationInput(event: Event): void{
    const customEvent = event as CustomEvent<{value: string}>;
    const value = customEvent.detail.value.trim();
    if (value.length) {
      this.educationTextValue = value;
      this.editProfileFormFields.get(this.fieldName)?.setValue(value);
    } else {
      this.editProfileFormFields.get(this.fieldName)?.setValue(null);
    }
  }

  onSubmit(): void{
    const value = this.editProfileFormFields.get(this.fieldName)?.value;
    this.editingProfileService.onDismissEditFormModal();
    switch(this.fieldName){
      case FieldName.Bio:
        this.editingProfileService.updateBio(value).subscribe();
        return;

      case FieldName.Gender:
        this.editingProfileService.updateGender(value).subscribe();
        return;

      case FieldName.City:
        const city = this.editProfileFormFields.get(this.FieldName.City)?.value;
        const country = this.editProfileFormFields.get(this.FieldName.Country)?.value;
        this.editingProfileService.updateHome({city, country}).subscribe();
        const latitude = this.editProfileFormFields.get('latitude')?.value;
        const longitude = this.editProfileFormFields.get('longitude')?.value;
        this.editingProfileService.updateHomeByCoordinate({ latitude, longitude }).subscribe();
        return

      case  FieldName.SexOrientation:
        this.editingProfileService.updateSexOrientation(value).subscribe();
        return;

      case FieldName.Children :
        this.editingProfileService.updateChildrenStatus(value).subscribe();
        return;

      case FieldName.Education:
        this.editingProfileService.updateEducation(value).subscribe();
        return;
      case FieldName.UserHeight:
        this.editingProfileService.updateHeight(value).subscribe();
        return;
    }
  }

   buildForm():void {
    if (this.fieldName === FieldName.City) {
        this.editProfileFormFields = this.fb.group({
        [this.fieldName]: [null, Validators.required],
        country: [null, Validators.required],
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
      });
      return;
    }

    this.editProfileFormFields = this.fb.group({
      [this.fieldName]: [null, Validators.required],
    });

  }

  onSelectGender(value: string): void {
    this.genderValue = value as Gender;
    this.editProfileFormFields.get(FieldName.Gender)?.setValue(value);
  }

  onCancelEditing(): void{
    this.editingProfileService.onDismissEditFormModal();
  }

  onSexOrientation(event: Event): void{
    const customEvent = event as CustomEvent<{value: string}>;
    const value = customEvent.detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value);
  }

  onSelectChildrenOption(event: Event): void{
    const customEvent = event as CustomEvent<{value: string}>;
    const value = customEvent.detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value === this.childrenOptions[1]);
  }

  onSelectLocation(
    event: {
      city: string, country: string,
      latitude: number, longitude: number
    }
  ): void {
    this.selectedLocation = `${event.city}, ${event.country}`;
    // Update form controls
    this.editProfileFormFields.get(FieldName.City)?.setValue(event.city);
    this.editProfileFormFields.get('country')?.setValue(event.country);
    this.editProfileFormFields.get('latitude')?.setValue(event.latitude);
    this.editProfileFormFields.get('longitude')?.setValue(event.longitude);
    // Update search bar input as well
    this.editProfileFormFields.get(FieldName.City)?.markAsTouched();
  }
}
