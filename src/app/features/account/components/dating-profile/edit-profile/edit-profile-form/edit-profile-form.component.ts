import { Component, Input, OnInit} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Gender, InterestedIn } from "src/app/features/auth/components/create-profile/create-profile.component";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";
import { SexOrientation } from "../edit-children/edit-children.component";

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
  gender = {
    male: false,
    female: false,
    other: false,
  };
  selectedSexOrientation: SexOrientation | null = null;
  readonly sexOrientationList =  [ 'straight','heterosexual','gay',
    'lesbian','bisexual','asexual',
    'pansexual','queer','questioning',
    'demisexual',
  ]

  readonly childrenOptions = [`I don't have children`, 'I have children'];
  selectedChildrenOption: string | null = null;

  heightOptions: number[] = [];
  selectedHeight: number | null = null;
  editProfileFormFields!: FormGroup;

  constructor(
    private editingProfileService: EditingProfileService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    if(this.fieldName) this.buildForm();
    if (this.fieldName === this.FieldName.Children) {
      const value =  (this.fieldValue as boolean) === false
        ?  this.childrenOptions[0]
        : (this.fieldValue as boolean) === false
        ? this.childrenOptions[1]: null;
      this.selectedChildrenOption = value;
    }

    if( this.fieldName ===  this.FieldName.UserHeight) {
       this.heightOptions = Array.from({ length: 101 }, (_, i) => 120 + i);
       const value = this.fieldValue as number;
       this.selectedHeight = value ?? 170;
    }
  }

  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} characters remaining`;
  }

  onHeightPicker(event: any): void{
    const value = event.detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value);
  }
  onSubmit(): void{
    const value = this.editProfileFormFields.get(this.fieldName)?.value;
    if(this.fieldName === FieldName.Bio) {
      this.editingProfileService
      .updateBio(this.editProfileFormFields.get(this.fieldName)?.value).subscribe();
    }

    if(this.fieldName === FieldName.Gender) {
      this.editingProfileService
      .updateGender(this.editProfileFormFields.get(this.fieldName)?.value).subscribe();
    }

    if (this.fieldName === FieldName.City) {
      const city = this.editProfileFormFields.get(this.FieldName.City)?.value;
      const country = this.editProfileFormFields.get(this.FieldName.Country)?.value;
      this.editingProfileService.updateHome({city, country}).subscribe();
    }

    if(this.fieldName === FieldName.SexOrientation) {
      this.editingProfileService.updateSexOrientation(value).subscribe();
    }
    this.editingProfileService.onDismissEditFormModal();
  }

   buildForm():void {
    if (this.fieldName === FieldName.City) {
        this.editProfileFormFields = this.fb.group({
        [this.fieldName]: [this.fieldValue || '', Validators.required],
        country: ['', Validators.required],
      });
      return;
    }

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

  onSexOrientation(event: any): void{
    const value = event.detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value);

  }
  onSelectChildrenOption(event : any): void{
    const value = event.detail.value;
    this.editProfileFormFields.get(this.fieldName)?.setValue(value);
  }
  onSelectLocation(event: {city: string, country: string}): void {
    this.selectedLocation = `${event.city}, ${event.country}`
    // Update form controls
    this.editProfileFormFields.get(FieldName.City)?.setValue(event.city);
    this.editProfileFormFields.get('country')?.setValue(event.country);
    console.log(this.editProfileFormFields)
    // Update search bar input as well
    this.editProfileFormFields.get(FieldName.City)?.markAsTouched();
  }
}
