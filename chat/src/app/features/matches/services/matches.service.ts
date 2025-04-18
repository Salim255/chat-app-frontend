import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Partner } from 'src/app/shared/interfaces/partner.interface';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private ENV = environment;
  private matchesArraySource = new BehaviorSubject<Partner[] | null>(null);
  constructor(private http: HttpClient) {}

  fetchMatches() {
    return this.http.get<any>(`${this.ENV.apiUrl}/friends`).pipe(
      tap((response) => {
        console.log(response, 'Hello');
        this.setMatchArray(response.data);
      })
    );
  }

  setMatchArray(matchesArray: Partner[] | null) {
    this.matchesArraySource.next(matchesArray);
  }

  get getMatchesArray() {
    return this.matchesArraySource.asObservable();
  }
}
