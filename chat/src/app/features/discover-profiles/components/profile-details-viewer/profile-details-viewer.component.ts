import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-profile-details-viewer',
  templateUrl: './profile-details-viewer.component.html',
  styleUrls: ['./profile-details-viewer.component.scss']
})

export class ProfileDetailsViewerComponent implements OnInit {
  @Input() profileImages: any;
  @Input() foreigner: any;

  constructor(){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello from profile component');

  }
}
