import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Partner } from 'src/app/interfaces/partner.interface';
import { MatchesService } from 'src/app/features/matches/services/matches.service';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
    standalone: false
})

export class MatchesPage implements OnInit, OnDestroy {
  private partnerSourceSubscription!: Subscription;
  placeHolderText = `You haven't any matches yet. Start exploring and find your perfect match!`;
  matchesArray: Partner [] = [];
  isEmpty: boolean = false;

  constructor(
    private matchesService: MatchesService
    ) {}

  ngOnInit () {
    this.subscribeToMatches();
  }

  ionViewWillEnter () {
    if (!this.partnerSourceSubscription || this.partnerSourceSubscription.closed) {
      this.subscribeToMatches();
    }
    this.matchesService.fetchMatches().subscribe();
  }

  ionViewWillLeave() {
    this.cleanUp();
  }

  private cleanUp(){
    if (this.partnerSourceSubscription) this.partnerSourceSubscription.unsubscribe();
    this.matchesArray = []
  }

  private subscribeToMatches() {
    this.partnerSourceSubscription = this.matchesService.getMatchesArray.subscribe({
      next: (data) => {
        console.log("Data received:", data);
        if (data) {
          this.matchesArray = data;
          this.isEmpty = this.matchesArray.length === 0;
        }

      },
      error: (err) => console.error("Subscription error:", err)
    });
  }

  ngOnDestroy() {
    this.cleanUp();
  }

}
