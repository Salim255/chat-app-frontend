import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private apiKey = environment.GoogleMapAPIKey;
  private loadingPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if ((window as any).google?.maps) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  getCityCountryFromLatLng(lat: number, lng: number): Promise<{ city: string, country: string } | null> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();

      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status !== 'OK' || !results || results.length === 0) {
          reject('Geocoder failed or returned no results');
          return;
        }

        // Find city and country from address components
        let city = '';
        let country = '';

        const components = results[0].address_components;
        components.forEach(component => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1') && !city) {
            // fallback if locality not found
            city = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });

        if (city && country) {
          resolve({ city, country });
        } else {
          resolve(null);
        }
      });
    });
  }

}
