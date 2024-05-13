import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private nativeController: NavController) { }

  ngOnInit() {
    console.log("Hello world");

  }

  goBackToExplore () {
      this.nativeController.back()
  }
}
