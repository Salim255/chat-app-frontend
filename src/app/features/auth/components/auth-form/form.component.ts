import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthMode } from 'src/app/features/auth/services/auth.service';
import { LoadingSpinnerService } from 'src/app/shared/components/app-loading-spinner/loading-spinner.service';

interface FormField {
  label: string;
  id: string;
  name: string;
  model: keyof UserInput; // Ensures the model key matches `userInput`
  type: string;
  required: boolean;
  email: boolean;
}

// Define the structure of userInput
interface UserInput {
  email?: string;
  password?: string;
  confirm_password?: string;
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false,
})
export class AuthFormComponent implements OnInit {
  authMode: AuthMode | null = null;
  userInputs: UserInput = {};
  formFields: FormField[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    this.authService.getAuthMode.subscribe((mode) => {
      if (mode) {
        this.authMode = mode as AuthMode;
        this.formFields = this.generateFormFields();
      }
    });
  }

  onSubmit(f: NgForm): void {
    this.loadingSpinnerService.showSpinner();
    if (!f.valid || !this.authMode ) {
      return ;
    }


  // Check password match for signup
  if (
    this.authMode === 'signup' &&
    this.userInputs.password !== this.userInputs.confirm_password
   ) {
    this.loadingSpinnerService.hideSpinner();
    return; // Stop submission if not matching
  }
  // Create a copy without confirm_password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm_password, ...userInputsWithoutConfirm } = this.userInputs;
  this.authService.authenticate(this.authMode, userInputsWithoutConfirm).subscribe({
      next: () => {
        f.reset();
        if(this.authMode === AuthMode.signup) {
          this.router.navigateByUrl('auth/create-profile')
        } else {
          this.router.navigateByUrl('/tabs/account');
        }

        //
        setTimeout(() => {
          this.loadingSpinnerService.hideSpinner();
        }, 150);
      },
      error: (err) => {
        f.reset();
        this.loadingSpinnerService.hideSpinner();
        // We need to deal with error message
        console.log(err, 'hello error 💥💥');
      },
    });
  }

  //Returns the form fields based on the authentication mode.
  private generateFormFields(): FormField[] {
    const fields: FormField[] = [
      {
        label: 'Your email',
        id: 'e_mail',
        name: 'e_mail',
        model: 'email',
        type: 'email',
        required: true,
        email: true,
      },
      {
        label: 'Password',
        id: 'password',
        name: 'password',
        model: 'password',
        type: 'password',
        required: true,
        email: false,
      },
    ];

    if (this.authMode === 'signup') {
      return [
        ...fields,
        {
          label: 'Confirm password',
          id: 'confirm-password',
          name: 'confirm-password',
          model: 'confirm_password',
          type: 'password',
          required: true,
          email: false,
        },
      ];
    } else {
      return fields;
    }
  }
}
