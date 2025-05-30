import { Component, Input } from '@angular/core';
import { Match } from 'src/app/features/matches/models/match.model';


@Component({
  selector: 'app-profile-viewer-description',
  templateUrl: './profile-viewer-description.component.html',
  styleUrls: ['./profile-viewer-description.component.scss'],
  standalone: false,
})
export class ProfileViewerDescriptionComponent {
  @Input() profileToDisplay!: Match;
  constructor() {}
}
