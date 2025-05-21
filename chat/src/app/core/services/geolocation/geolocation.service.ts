import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private ENV = environment;
  private userCoordinates: Coordinates;

  constructor(private http: HttpClient) { this.userCoordinates = { latitude: 0, longitude: 0 } }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestPermissions(): Promise<any> {
    const permissions = await Geolocation.requestPermissions();
    return permissions;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCurrentCoordinates(): Promise<Coordinates> {
    try {

      if (Capacitor.getPlatform() ===  'web') {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>{
          navigator.geolocation.getCurrentPosition(resolve, reject);
         });

        this.userCoordinates.latitude = position.coords.latitude;
        this.userCoordinates.longitude = position.coords.longitude;
        return this.userCoordinates;
      }

      const permission = await this.requestPermissions();
      if (!permission) {
        throw new Error('Location permission error');
      }

      const position = await Geolocation.getCurrentPosition();
      this.userCoordinates.latitude = position.coords.latitude;
      this.userCoordinates.longitude = position.coords.longitude;
      return this.userCoordinates;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
       throw new Error(error.message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCityByCoordinates(coordinates: Coordinates): Observable<any> {
    // OpenCage API BaseUrl
    const url = `${this.ENV.mapBaseUrl}?q=${coordinates.latitude},++${coordinates.longitude}&key=${this.ENV.mapApiKey}&language=en&pretty=1`;
    return this.http.get(url);
  }


  searchLocationsByText(query: string): Observable<string[]> {
    if (!query.trim()) return of([]);

    const url = `${this.ENV.mapBaseUrl}?q=${encodeURIComponent(query)}&key=${this.ENV.mapApiKey}&language=en&limit=5`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>(url).pipe(
      map(response => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
