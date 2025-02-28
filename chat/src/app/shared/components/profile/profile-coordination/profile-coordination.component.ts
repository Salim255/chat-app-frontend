import { Component, Input, OnInit} from "@angular/core";


@Component({
    selector: 'app-profile-coordination',
    templateUrl: './profile-coordination.component.html',
    styleUrls: ['./profile-coordination.component.scss'],
    standalone: false
})
export class ProfileCoordinationComponent implements OnInit {

  @Input() profile: any;

  constructor () { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.profile)
  }

}
