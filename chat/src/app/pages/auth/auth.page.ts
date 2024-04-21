import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthPost } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
 autMode: boolean =  true;
 userInput: AuthPost;
  constructor(private authService: AuthService) {
    this.userInput  = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
   }


  switchAuth(){
    this.autMode =  !this.autMode
  }
  onSubmit(f:NgForm){

   if(!f.valid){
    return
   }
   let mode = this.autMode ? 'login' : 'createUser'
   let authObs: Observable<any>

   authObs = this.authService.authenticate(mode, this.userInput)

   authObs.subscribe({
    error: (err) => {

    },
    next: (res) => {


    }
   })
  }

}
