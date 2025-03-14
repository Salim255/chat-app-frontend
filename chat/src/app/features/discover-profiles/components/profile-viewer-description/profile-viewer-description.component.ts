import { Component, Input } from "@angular/core";
import { Member } from "src/app/shared/interfaces/member.interface";

@Component({
  selector: 'app-profile-viewer-description',
  templateUrl: './profile-viewer-description.component.html',
  styleUrls: ['./profile-viewer-description.component.scss'],
  standalone: false
})
export class  ProfileViewerDescriptionComponent {
  @Input() profileToDisplay!: Member
  constructor(){}
}
