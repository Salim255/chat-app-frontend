import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
    standalone: false
})
export class EditProfilePage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
    console.log('====================================');
    console.log("hello");
    console.log('====================================');
  }

  onNavigateBack(){
    this.navController.back()
  }

}
