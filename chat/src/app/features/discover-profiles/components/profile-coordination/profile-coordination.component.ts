import { Component, Input} from "@angular/core";


@Component({
  selector: 'app-profile-coordination',
  templateUrl: './profile-coordination.component.html',
  styleUrls: ['./profile-coordination.component.scss']
})
export class ProfileCoordinationComponent {

  @Input() profile: any;

  constructor () { }


}
