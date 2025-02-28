import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-profile-images-card',
    templateUrl: './profile-images-card.component.html',
    styleUrls: ['./profile-images-card.component.scss'],
    standalone: false
})
export class ProfileImagesCardComponent implements OnInit {
  @Input() profileToDisplay: any;
  constructor(){}

  ngOnInit(){
      console.log("Hello from profile images card");
  }
}
