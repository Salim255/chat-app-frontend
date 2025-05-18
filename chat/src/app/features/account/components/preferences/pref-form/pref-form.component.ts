import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PrefFieldName } from "../../../services/preferences.service";
import { PreferencesService } from "../../../services/preferences.service";
import { RangeCustomEvent } from "@ionic/angular";


export  type EditProfilePayload = {
  name: string;
  birthDate: Date;
  country: string;
  city: string;
  photos: string,
  bio: string,
}
@Component({
  selector: 'app-pref-form',
  templateUrl: './pref-form.component.html',
  styleUrls: ['./pref-form.component.scss'],
  standalone: false
})

export class PrefFormComponent implements OnInit{
  @Input() fieldValue: string = '';
  @Input() fieldName: string = '';
  FieldName = PrefFieldName;
  editPrefFormFields!: FormGroup;
  ageOptions: number [] = [] // Age 18 to 100
  distanceOptions: number [] = []; // Distance 1 to 150 miles
  ageRange = { lower: 18, upper: 100 };
  activeKnob: 'lower' | 'upper' = 'lower';
  constructor(
    private preferencesService: PreferencesService,
    private fieldBuilder: FormBuilder){}

  ngOnInit(): void {
    if(this.fieldName) {
      this.buildForm();
    }
    if(this.fieldName === this.FieldName.Age) {
      this.buildAgeOptions();
    }

    if (this.fieldName === this.FieldName.Distance) {
      this.buildDistanceOptions();
    }
  }
  onSave(): void{
    this.preferencesService.dismissPrefForm();
  }

  onCancelEditing(): void{
    this.preferencesService.dismissPrefForm()
  }

  buildForm():void {
    if (this.fieldName) {
      this.editPrefFormFields = this.fieldBuilder.group({
        [this.fieldName]: [this.fieldValue || '', Validators.required],
      });
    }
  }

  buildAgeOptions(): void{
      this.ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);
  }

  buildDistanceOptions(): void{
    this.distanceOptions = Array.from({ length: 150 }, (_, i) => i + 1);
  }

  formTitle(): string| null{
    switch(this.fieldName){
      case this.FieldName.Age:
        return'Age range';
      case this.FieldName.Distance:
        return 'Distance from you';
      case this.FieldName.LookingFor:
        return 'Interested in';
      default:
        return null;
    }
  }

  onPickerChange(event: any): void {
    const minAge = event?.detail?.value?.minAge;
    const maxAge = event?.detail?.value?.maxAge;
    console.log('Selected age range:', minAge, maxAge);
  }
  pinFormatter(value: number): string {

      return `${value}%`;
  }
/* <ion-label>How old are they ?</ion-label>
                   <ion-label slot="end">18-28</ion-label> */

  onIonKnobMoveStart(event: RangeCustomEvent) {
    console.log('ionKnobMoveStart:', event.detail);
    //this.activeKnob = event.detail.knob;
  }

  onIonKnobMoveEnd(event: RangeCustomEvent) {
    console.log('ionKnobMoveEnd:', event.detail.value);
  }



  onSingleCheckboxSelect(gender: string){

  }
}
