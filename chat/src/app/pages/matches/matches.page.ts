import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Partner } from 'src/app/interfaces/partner.interface';
import { MatchesService } from 'src/app/features/matches/services/matches.service';
import { AccountService } from 'src/app/features/account/services/account.service';
@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})

export class MatchesPage implements OnInit, OnDestroy {
  private partnerSourceSubscription!: Subscription;
  placeHolderText = `You haven't any matches yet. Start exploring and find your perfect match!`;
  matchesArray: Array < Partner >;
  isEmpty: boolean = false;
  constructor(private matchesService: MatchesService, private accountService: AccountService) {
    this.matchesArray = []
  }

  ngOnInit () {
    this.partnerSourceSubscription = this. matchesService.getMatchesArray
      .subscribe(data => {
          this.matchesArray = data;
          if (this.matchesArray.length > 0) {
            this.isEmpty = false
          } else {
            this.isEmpty = true;
          }
      });
  }

  ionViewWillEnter () {
    this.matchesService.fetchMatches().subscribe( );
    this.accountService.fetchAccount().subscribe();
  }

  ngOnDestroy() {
    if (this.partnerSourceSubscription) {
      this.partnerSourceSubscription.unsubscribe();
    }
  }

}
