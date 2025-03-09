import { Component, Input } from "@angular/core";
import { Member } from "src/app/shared/interfaces/member.interface";
import { DisableProfileSwipe } from "../../services/discover.service";

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
  standalone: false
})

export class ProfileContentComponent {
  @Input() profile!: Member;
  @Input() profileToView: DisableProfileSwipe | null = null;
  constructor () {}
}
