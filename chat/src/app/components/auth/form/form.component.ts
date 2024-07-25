import { Component, EventEmitter, Input, Output, output } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";
import { AuthPost } from "src/app/interfaces/auth.interface";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-auth-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent {
  @Input() autMode!: boolean;
  @Output() switchAuth = new EventEmitter();

  userInput: AuthPost;

  constructor(private  authService:  AuthService, private router: Router ) {
    this.userInput  = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  }

  onSubmit(f: NgForm) {

    if(!f.valid){
     return
    }

    let mode = this.autMode ? 'login' : 'signup/createUser'
    let authObs: Observable<any>

    authObs = this.authService.authenticate(mode, this.userInput)

    authObs.subscribe({
     error: (err) => {

     },
     next: (res) => {
      f.reset();
      this.router.navigateByUrl('/tabs/community')

     }
    })
   }

   onSwitchAuth(){
      this.switchAuth.emit();
   }
}
