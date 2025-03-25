import { Component} from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: false
})

export class AuthPage  {
  constructor(
    private location: Location) {}
  customBack(){
    this.location.back();
  }

}
