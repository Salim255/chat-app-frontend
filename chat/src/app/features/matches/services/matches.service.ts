import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { ActiveConversationService } from '../../active-conversation/services/active-conversation.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private ENV = environment;
  private matchesArraySource = new BehaviorSubject <Partner [] | null > (null)
  constructor(
     private http: HttpClient ) { }

  fetchMatches(){
    return this.http.get<any>(`${this.ENV.apiUrl}/friends`)
    .pipe(tap( response => {
        this.setMatchArray(response.data)
      }));
  }

  get getMatchesArray () {
    return this.matchesArraySource.asObservable();
  }

  setMatchArray(matchesArray: Partner [] | null) {
    this.matchesArraySource.next(matchesArray);
  }
}
