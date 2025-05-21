import { Component, Input } from '@angular/core';
import { Coordinates } from 'src/app/core/services/geolocation/geolocation.service';

@Component({
  selector: 'app-profile-coordination',
  templateUrl: './profile-coordination.component.html',
  styleUrls: ['./profile-coordination.component.scss'],
  standalone: false,
})
export class ProfileCoordinationComponent {
  @Input() profile: any;

  constructor() {}

  buildVisiterCoordinates(): Coordinates | null{
    if (!this.profile.latitude || !this.profile.longitude) return null
    return {latitude: this.profile.latitude, longitude: this.profile.longitude} as Coordinates;
  }
}
