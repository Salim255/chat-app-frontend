import { Component, ViewChild } from "@angular/core";
import { CompleteProfileService } from "./services/complete-profile.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from "@ionic/angular";
import { formatDate } from "@angular/common";

export enum InterestedIn {
  Men = 'men',
  Women = 'women',
  Both = 'both'
}


@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
  standalone: false,
})

export class CompleteProfilePage {
  @ViewChild('birthDatePicker', { static: false }) birthDatePicker!: IonDatetime;
  profileForm!: FormGroup;

  maxDate: string = new Date().toISOString(); // prevent future date
  showDateModal = false;
  tempDate: string | null = null;
  InterestedIn = InterestedIn;

  constructor(
    private fb: FormBuilder,
    private completeProfileService: CompleteProfileService,
  ){
    this.profileForm = this.fb.group({
      birthDate: ['', Validators.required],
    });

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0]; // format: YYYY-MM-DD

    this.profileForm = this.fb.group({
      birthDate: [null, Validators.required],
      interestedIn: [null, Validators.required]
    });
  }

  onClose(): void{
    this.completeProfileService.closeModal();
  }

  openDateModal(): void {
    this.showDateModal = true;
  }

  closeDateModal(): void {
    this.showDateModal = false;
  }


  onDateSelected(event: any): void {
    const rawDate = event.detail.value;
    const formatted = formatDate(rawDate, 'MM/ dd/ y', 'en-US');
    this.profileForm.patchValue({ birthDate: formatted });
  }

  confirmDate(): void {
    if (this.tempDate) {
      this.profileForm.get('birthDate')?.setValue(this.tempDate);
    }
    this.closeDateModal();
  }
}
