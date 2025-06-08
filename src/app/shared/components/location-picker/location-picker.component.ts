import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GoogleMapsLoaderService } from '../../../core/services/geolocation/google-maps-loader-service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  standalone: false
})
export class LocationPickerComponent implements AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElementRef!: ElementRef;
  @Output() locationSelected = new EventEmitter<{city : string, country: string }>();

  map!: google.maps.Map;
  marker!: google.maps.Marker;

  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  ngAfterViewInit(): void {
    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch((err) => {
      console.error('Google Maps failed to load', err);
    });
  }

   initMap(): void {
    const el = this.mapElementRef?.nativeElement;

    if (!el) {
      console.error('Map element not available');
      return;
    }

    this.map = new google.maps.Map(el, {
      center: { lat: 48.3794, lng: 31.1656 },
      zoom: 6,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180
        },
        strictBounds: false
      }
    });

    this.map.addListener('click', async (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();

      if (lat !== undefined && lng !== undefined) {
        this.setMarker(lat, lng);
        const result =  await this.mapsLoader.getCityCountryFromLatLng(lat, lng);
        if (result) this.locationSelected.emit(result);
      }
    });
  }


  setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
    });

    this.map.panTo({ lat, lng });
  }
}
