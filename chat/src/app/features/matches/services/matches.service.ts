import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private ENV = environment;
  private matchesArraySource = new BehaviorSubject<Match[] | null>(null);
  constructor(private http: HttpClient) {}

  fetchMatches(): Observable<{
    status: string,
    data: { matches: Match[]},
   }> {
      return this.http.get<{ status: string, data: { matches: Match[] } }>(
        `${this.ENV.apiUrl}/matches`).pipe(
          tap((response) => {
            console.log(response, 'Hello');
            this.setMatchArray(response.data.matches);
          })
      );
  }

  setMatchArray(matchesArray: Match[] | null): void {
    this.matchesArraySource.next(matchesArray);
  }

  get getMatchesArray(): Observable<Match[] | null> {
    return this.matchesArraySource.asObservable();
  }
}
