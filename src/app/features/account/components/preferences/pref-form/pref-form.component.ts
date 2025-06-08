import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PrefFieldName } from "../../../services/preferences.service";
import { PreferencesService } from "../../../services/preferences.service";
import { RangeCustomEvent } from "@ionic/angular";
import { LookingFor } from "src/app/features/profile-viewer/components/looking-for/looking-for.component";
import { AccountService } from "../../../services/account.service";
import { DistanceRange } from "../../../services/account-http.service";

@Component({
  selector: 'app-pref-form',
  templateUrl: './pref-form.component.html',
  styleUrls: ['./pref-form.component.scss'],
  standalone: false
})

export class PrefFormComponent implements OnInit{
  @ViewChild('ionRange', { read: ElementRef }) ionRangeRef!: ElementRef;
  @Input() fieldValue: string = '';
  @Input() fieldName: string = '';

  FieldName = PrefFieldName;
  editPrefFormFields!: FormGroup;
  distanceOptions: number [] = []; // Distance 1 to 150 miles
  selectedLookingFor: string[] = [];
  ageRange = { lower: 20, upper: 80 };
  minGap = 4;
  minAge = 18;
  maxAge = 100;

  distanceRange: number = 1;

  constructor(
    private preferencesService: PreferencesService,
    private fieldBuilder: FormBuilder,
    private accountService: AccountService
  ){}

  ngOnInit(): void {
    if(this.fieldName) {
      this.buildForm();
    }

    if (this.fieldName === this.FieldName.Distance) {
      this.buildDistanceOptions();
    }
  }

  onSubmit(): void{
    this.preferencesService.dismissPrefForm();
    const control = this.editPrefFormFields.get(this.fieldName);
    const value = control?.value;

    if(!value) return;

    switch(this.fieldName){
      case this.FieldName.Age:
        const payload = { minAge: value.lower, maxAge: value.upper }
        this.preferencesService.updateAgeRage(payload).subscribe(result => {
          console.log(result)
        });
      return;

      case this.FieldName.Distance:
        this.preferencesService.updateDistanceRage(value).subscribe(result => {
          console.log(result)
        })
        return;
      case this.FieldName.LookingFor:
         this.preferencesService.updateLookingForOptions(value).subscribe(result => {
          console.log(result)
        })
        return;
      default:
        return;
    }
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


  buildDistanceOptions(): void {
    this.distanceOptions = Array.from({ length: 150 }, (_, i) => i + 1);
  }

  onRangeInput(event: any): void {
    const lower = event.detail.value.lower;
    const upper = event.detail.value.upper;

    if (lower + this.minGap > upper) {
      if (lower !== this.ageRange.lower) {
        // User changed lower
        this.ageRange.upper = Math.min(lower + this.minGap, this.maxAge);
      } else if (upper !== this.ageRange.upper) {
        // User changed upper
        this.ageRange.lower = Math.max(upper - this.minGap, this.minAge);
      }
    } else {
      this.ageRange.lower = lower;
      this.ageRange.upper = upper;
    }

    this.editPrefFormFields.get('age')?.setValue(this.ageRange);
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

  onIonKnobMoveEnd(event: RangeCustomEvent): void {
    if (event.detail.value) this.distanceRange = (event.detail.value as number);
    this.editPrefFormFields.get(this.fieldName)?.setValue(this.distanceRange);
  }


  onLookingCheckboxToggle(value: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedLookingFor.includes(value)) {
        this.selectedLookingFor.push(value);
      }
    } else {
      this.selectedLookingFor = this.selectedLookingFor.filter(item => item !== value);
    }
    this.editPrefFormFields.get(this.fieldName)?.setValue(this.selectedLookingFor);
    console.log(this.selectedLookingFor, this.fieldName, this.editPrefFormFields.get(this.fieldName));
  }

  isChecked(value: string): boolean {
    return this.selectedLookingFor.includes(value);
  }
}
