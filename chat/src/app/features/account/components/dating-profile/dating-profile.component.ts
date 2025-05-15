import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dating-profile',
  templateUrl: './dating-profile.component.html',
  styleUrls: ['./dating-profile.component.scss'],
  standalone: false,
})
export class DatingProfileComponent {
  constructor(
    private router: Router,
    private location: Location) { }
  onBack():void{
    this.location.back()

  }

  onEditProfile(): void{
    console.log('====================================', 'hello', '====================================');
    this.router.navigate(['/tabs/account/dating-profile/edit-profile']);
     //alert('Clicked!');
  }
}
