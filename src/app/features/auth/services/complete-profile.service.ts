import { Injectable } from "@angular/core";
import { CompleteProfileHttpService, PostResponse } from "./complete-profile-http.service";
import { Observable } from "rxjs";
  import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class CompleteProfileService {
  constructor(private completeProfileHttpService: CompleteProfileHttpService){}

  createProfile(profile: FormData): Observable<PostResponse>{
    return this.completeProfileHttpService.postProfile(profile);
  }


 dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    // Must be in DD/MM/YYYY format
    const regex = /^(0[1-9]|[12][0-9]|3[01])\s*\/\s*(0[1-9]|1[0-2])\s*\/\s*(\d{4})$/;
    if (!regex.test(value)) {
      return { invalidDateFormat: true };
    }

    // Parse the date components
    const [dayStr, monthStr, yearStr] = value.split('/').map((part: string) => part.trim());
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1; // JavaScript months are 0-based
    const year = parseInt(yearStr, 10);

    const birthDate = new Date(year, month, day);
    if (isNaN(birthDate.getTime())) {
      return { invalidDateFormat: true };
    }

    // Check if the date is valid (e.g., not 31/02/2024)
    if (
      birthDate.getDate() !== day ||
      birthDate.getMonth() !== month ||
      birthDate.getFullYear() !== year
    ) {
      return { invalidDateFormat: true };
    }

    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return { underage: true };
    }

    return null;
  };
}

}
