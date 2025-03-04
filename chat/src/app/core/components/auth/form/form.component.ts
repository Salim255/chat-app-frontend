import { Component, EventEmitter, Input, OnInit, Output, output } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";
import { AuthPost } from "src/app/core/interfaces/auth.interface";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Router } from "@angular/router";
// import { AuthMode } from "aws-sdk/clients/emr";

export enum AuthMode {
  SignIn = "sign-in",
  Create = "create"
}

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
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

@Component({
    selector: 'app-auth-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})

export class FormComponent implements OnInit {
  authMode: AuthMode | null = null;;
  userInputs: UserInput = {};
  formFields: FormField[] = [];

  constructor(private  authService:  AuthService, private router: Router ) {}

  ngOnInit(): void {
    this.authService.getAuthMode.subscribe(mode => {
      if (mode) {
       this.authMode = mode as AuthMode;
       this.formFields = this.generateFormFields();
      }
    })
   }

  onSubmit(f: NgForm) {
    if(!f.valid){
     return
    }

    const mode = this.authMode === 'sign-in' ? 'login' : 'signup/createUser';
    this.authService.authenticate(mode, this.userInputs)
    .subscribe({
     next: (res) => {
      f.reset();
      this.router.navigateByUrl('/tabs/discover')
     },
     error: (err) => {
      f.reset();
      console.log(err, "hello error 💥💥")
      }
    })
   }

  /**============
   * Returns the form fields based on the authentication mode.
   */
  private generateFormFields(): FormField [] {
    const fields: FormField [] = [
      { label: 'Your email', id: 'e_mail', name: 'e_mail', model: 'email', type: 'email', required: true, email: true },
      { label: 'Password', id: 'password', name: 'password', model: 'password', type: 'password', required: true, email: false },
    ];

    if (this.authMode === 'create') {

    return [
            { label: 'First name', id: 'first_name', name: 'first_name', model: 'first_name', type: 'text', required: true, email: false },
            { label: 'Last name', id: 'last_name', name: 'last_name', model: 'last_name', type: 'text', required: true, email: false },
            ...fields,
            { label: 'Confirm password', id: 'confirm-password', name: 'confirm-password', model: 'confirm_password', type: 'password', required: true, email: false }
          ]

    } else  {
      return fields
    }
  }

}
