import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getDistanceInKm } from 'src/app/core/services/geolocation/geo-utils';
import { Coordinates, GeolocationService } from 'src/app/core/services/geolocation/geolocation.service';
import { AccountService } from 'src/app/features/account/services/account.service';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss'],
  standalone: false,
})
export class DistanceComponent implements OnChanges {
  @Input() visiterCoordinates!: Coordinates | null;
  distance: number | null = null;
  constructor(
    private accountService:  AccountService,
    private geolocationService: GeolocationService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.distance = this.calculateDistance();
  }

  calculateDistance(): number | null{
    const hostCoordinates: Coordinates | null = this.accountService.getHostCoordinates;
    if (
      !hostCoordinates
      || !this.visiterCoordinates
      || !hostCoordinates.latitude
      || !hostCoordinates.longitude
    ) return null
    const getDistance = getDistanceInKm(hostCoordinates, this.visiterCoordinates);
    return getDistance;
  }
}
