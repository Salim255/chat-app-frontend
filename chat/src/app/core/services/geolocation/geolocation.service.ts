import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

type Coordinates = {
  latitude: number;
  longitude: number;
};

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private ENV = environment;
  currentLocation = new BehaviorSubject<string>('');
  userCoordinates: Coordinates;
  userCity: string = '';
  constructor(private http: HttpClient) {
    this.userCoordinates = {
      latitude: 0,
      longitude: 0,
    };
  }

  async requestPermissions() {
    const permissions = await Geolocation.requestPermissions();
    console.log('Permissions:', permissions);
    return permissions;
  }

  async getUserCurrentLocation() {
    // Check location permission
    const permission = await this.requestPermissions();

    if (!permission) {
      return;
    }

    try {
      // Get user's coordinates
      const position = await Geolocation.getCurrentPosition();
      this.userCoordinates.latitude = position.coords.latitude;
      this.userCoordinates.longitude = position.coords.longitude;

      // Get user's city using coordinates
      const coordinateObserve: Observable<any> = this.getCityByCoordinates(this.userCoordinates);
      coordinateObserve.subscribe((response) => {
        if (response && response.results.length > 0) {
          this.userCity = response.results[0].components.city;
          this.currentLocation.next(this.userCity);
        }
      });
    } catch (error) {
      console.error('Error getting location', error);
      this.currentLocation.next('Unable to retrieve location');
    }
  }

  getCityByCoordinates(coordinates: Coordinates): Observable<any> {
    // OpenCage API BaseUrl
    //console.log(this.env.mapKey);
    const url = `${this.ENV.mapBaseUrl}?q=${coordinates.latitude},++${coordinates.longitude}&key=${this.ENV.mapApiKey}&language=en&pretty=1`;
    return this.http.get(url);
  }

  get getLocation() {
    return this.currentLocation.asObservable();
  }

  searchLocationsByText(query: string): Observable<string[]> {
  if (!query.trim()) return of([]);

  const url = `${this.ENV.mapBaseUrl}?q=${encodeURIComponent(query)}&key=${this.ENV.mapApiKey}&language=en&limit=5`;
  return this.http.get<any>(url).pipe(
    map(response => {

      return  response.results.map((result: any) =>{
        const { continent, country, city, _normalized_city, county } = result.components;
      const cty = city || _normalized_city || county;
      if (!cty) return ;
      const formatted = [cty, country, continent].filter(Boolean).join(', ');

      return formatted;
      }).filter(Boolean);
    }

    )
  );
}
}
