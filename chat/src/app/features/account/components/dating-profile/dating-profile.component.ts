import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EditingProfileService } from '../../services/editing-profile.service';
@Component({
  selector: 'app-dating-profile',
  templateUrl: './dating-profile.component.html',
  styleUrls: ['./dating-profile.component.scss'],
  standalone: false,
})
export class DatingProfileComponent {
  segmentValue: string = 'default';
  constructor(
    private editingProfileService:  EditingProfileService,
    private router: Router,
    private location: Location) { }
  onBack():void{
   // this.location.back();
   this.editingProfileService.onDismissModal();

  }

  onEditProfile(): void{
    console.log('====================================', 'hello', '====================================');
    this.router.navigate(['/tabs/account/dating-profile/edit-profile']);
     //alert('Clicked!');
  }
}
