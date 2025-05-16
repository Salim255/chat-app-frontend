import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Gender, InterestedIn } from "src/app/features/auth/components/create-profile/create-profile.component";

export  type EditProfilePayload = {
  name: string;
  birthDate: Date;
  gender:  Gender;
  country: string;
  city: string;
  interestedIn: InterestedIn;
  photos: string
}


@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss'],
  standalone: false,
})

export class EditProfileFormComponent implements OnChanges {
  @Input() profile: any;
  editProfileFormFields!: FormGroup;
  constructor(    private fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.editProfileFormFields= this.fb.group({
      name: [this.profile.name, Validators.required],
      birthDate: [this.profile.birthDate, Validators.required],
      gender: [this.profile.gender, Validators.required],
      country: [this.profile.country, Validators.required],
      city: [this.profile.city, Validators.required],
      interestedIn: [this.profile.interestedIn, Validators.required],
      photos: this.fb.array(this.profile.photos, Validators.maxLength(4)),
    });

  }
  onSubmit(){


  }
}
