import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss']
})

export class ProfileViewerPage implements OnInit, OnDestroy{
    profileToDisplay:any ;
    private profileToDisplaySubscription!: Subscription
    constructor(private profileViewerService: ProfileViewerService){

    }

    ngOnInit() {
      this.profileToDisplaySubscription =  this.profileViewerService.getProfileToDisplay.subscribe(profile => {
          this.profileToDisplay = profile;
          console.log('====================================');
          console.log(this.profileToDisplay, "Profile do Display");
          console.log('====================================');
        })
    }

    ngOnDestroy() {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      if (this.profileToDisplaySubscription) {
        this.profileToDisplaySubscription.unsubscribe();
      }
    }
}
