import { Component, Input } from '@angular/core';
import { Profile } from 'src/app/features/discover/model/profile.model';


@Component({
  selector: 'app-profile-essentials',
  templateUrl: './essentials.component.html',
  styleUrls: ['./essentials.component.scss'],
  standalone: false,
})
export class EssentialsComponent {
  @Input() profile!: Profile;
}
