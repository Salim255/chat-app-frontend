import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Foreigner } from 'src/app/models/foreigner.model';
import { DiscoverService } from 'src/app/services/discover/discover.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private currentProfileSource!: Subscription;
  currentProfile!: Foreigner;

  constructor(private nativeController: NavController, private  discoverService :  DiscoverService ) {

   }

  ngOnInit() {

    this.currentProfileSource = this. discoverService .getDisplayedProfile.subscribe( (data )=> {
      if (data) {
        this.currentProfile = data;
      }
      console.log("Hello world",   this.currentProfile);
    });
  }

  ionViewWillEnter () {
    //this.communityService.fetchUsers().subscribe()
  }
  goBackToExplore () {
      this.nativeController.back()
  }

  ngOnDestroy() {
     if (this.currentProfileSource) {
      this.currentProfileSource.unsubscribe()
     }
  }
}
