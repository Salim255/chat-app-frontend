import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PrefFieldName } from "../../../services/preferences.service";
import { PreferencesService } from "../../../services/preferences.service";
import { RangeCustomEvent } from "@ionic/angular";


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
  ageRange: { minAge: number, maxAge: number } = { minAge: 18, maxAge: 86 };
  distanceRange: number = 1;

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
        return 'Looking for';
      default:
        return null;
    }
  }

  onPickerChangeMin(event: CustomEvent): void {
    const minAge = event?.detail?.value;
    this.ageRange.minAge = minAge ;
    this.editPrefFormFields.get(this.fieldName)
    ?.setValue(`${this.ageRange.minAge}-${this.ageRange.maxAge}`);
  }

  onPickerChangeMax(event: CustomEvent): void {
    const maxAge = event?.detail?.value;
    this.ageRange.maxAge = maxAge ;
    this.editPrefFormFields.get(this.fieldName)
      ?.setValue(`${this.ageRange.minAge}-${this.ageRange.maxAge}`);
  }

  onIonKnobMoveEnd(event: RangeCustomEvent): void {
    if (event.detail.value) this.distanceRange = (event.detail.value as number);
    this.editPrefFormFields.get(this.fieldName)?.setValue(this.distanceRange);
  }

  onSingleCheckboxSelect(gender: string):void{
    console.log(gender);
  }
}
