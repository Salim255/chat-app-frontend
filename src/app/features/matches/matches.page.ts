import { Component, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchesService } from 'src/app/features/matches/services/matches.service';
import { Match } from './models/match.model';
import { AccountService } from 'src/app/features/account/services/account.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: false,
})
export class MatchesPage implements OnDestroy {
  private partnerSourceSubscription!: Subscription;
  private hostProfileSubscription!: Subscription;
  hostAvatar!: string;
  placeHolderText = `You haven't any matches yet. Start exploring and find your perfect match!`;
  matchesArray = signal<Match[]>([]);

  constructor(
    private accountService: AccountService,
    private matchesService: MatchesService,
  ) {}


  // Add a trackBy function for better performance
  trackById(index: number, match: Match): string | number {
    return match.match_id;
  }

  ionViewWillEnter(): void {
    this.subscribeToMatches();
    this.matchesService.fetchMatches().subscribe();
    this.subscribeToHostProfile();
  }

  ionViewWillLeave(): void {
    this.cleanUp();
  }

  private cleanUp() {
    this.partnerSourceSubscription?.unsubscribe();
    this.hostProfileSubscription?.unsubscribe();
  }

  private subscribeToHostProfile(){
    this.hostProfileSubscription = this.accountService.getHostUserPhoto.subscribe(avatar => {
      if (!avatar) return;
        this.hostAvatar = avatar;
    })
  }

  private subscribeToMatches() {
    this.partnerSourceSubscription = this.matchesService.getMatchesArray.subscribe((data) => {
      if (data) {
        this.matchesArray.set(data);
      } else {
        console.log('Hello here');
        this.matchesArray.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
