import { Component, OnInit } from "@angular/core";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
import { Foreigner } from "src/app/models/foreigner.model";
@Component({
  selector: 'app-view-profile',
  templateUrl: './profile-viewer.page.html',
  styleUrls: ['./profile-viewer.page.scss']
})

export class ProfileViewerPage implements OnInit{
    profileToDisplay:any ;
    constructor(private profileViewerService: ProfileViewerService){

    }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
        this.profileViewerService.getProfileToDisplay.subscribe(profile => {
          this.profileToDisplay = profile;

          console.log('====================================');
          console.log(this.profileToDisplay);
          console.log('====================================');
        })
    }
}
