import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Foreigner } from 'src/app/models/foreigner.model';
import { CommunityService } from 'src/app/services/community/community.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private currentProfileSource!: Subscription;
  currentProfile!: Foreigner;

  constructor(private nativeController: NavController, private communityService: CommunityService) {

   }

  ngOnInit() {

    this.currentProfileSource = this.communityService.getDisplayedProfile.subscribe( (data )=> {
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
