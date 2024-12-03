import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})

export class ProfileDetailsComponent implements OnInit {
  @Input() profileImages: any;
  @Input() foreigner: any;

  constructor(){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello from profile component');

  }
}
