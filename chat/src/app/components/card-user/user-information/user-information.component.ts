import { Component, Input } from "@angular/core";


@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent {
  @Input() profile: any;
  constructor () { }


}
