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
     private http: HttpClient,
     private activeConversationService: ActiveConversationService,
    private router : Router ) { }

  fetchMatches(){
    return this.http.get<any>(`${this.ENV.apiUrl}/friends/get-friends`)
    .pipe(tap( response => {
        this.setMatchArray(response.data)
      }));
  }

  get getMatchesArray () {
    return this.matchesArraySource.asObservable();
  }
  onOpenChat (partnerInfo: Partner) {
    console.log("Open chat with partner:", partnerInfo);
    if (!partnerInfo || !partnerInfo.partner_id) return

    this.activeConversationService.setPartnerInfo(partnerInfo);

    // Check if there are a chat with the this partner
    this.activeConversationService.fetchChatByPartnerID(partnerInfo?.partner_id)
    .subscribe({
      next: () => {
        this.router.navigate([`./tabs/active-conversation/${partnerInfo?.partner_id}`],
          { queryParams: { partner: partnerInfo?.partner_id }, replaceUrl: true });
      },
      error: () => {
        console.error()
        this.activeConversationService.setActiveConversation(null);
      }
    })
  }

  setMatchArray(matchesArray: Partner [] | null) {
    this.matchesArraySource.next(matchesArray);
  }
}
