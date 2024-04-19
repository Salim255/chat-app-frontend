import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthPost } from 'src/app/interfaces/auth.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
 autMode: boolean =  true;
 userInput: AuthPost;
  constructor() {
    this.userInput  = {
      first_name: "",
      last_name: "",
      e_mail: "",
      password: "",
      confirm_password: ""
    }
   }

  ngOnInit() {
    console.log('====================================');
    console.log("hello");
    console.log('====================================');
  }

  switchAuth(){
    this.autMode =  !this.autMode
  }
  onSubmit(f:NgForm){
   console.log(this.userInput.e_mail);

  }

}
