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
  matchesArray: Partner [] = [];
  isEmpty: boolean = false;

  constructor(
    private matchesService: MatchesService,
    private accountService: AccountService,
    ) {}

  ngOnInit () {
    this.partnerSourceSubscription = this. matchesService.getMatchesArray
      .subscribe(data => {
          this.matchesArray = data;
          this.isEmpty = this.matchesArray?.length === 0 ;
      });
  }

  ionViewWillEnter () {
    this.matchesService.fetchMatches().subscribe( );
    this.accountService.fetchAccount().subscribe();
  }

  ionViewWillLeave() {
    this.cleanUp();
  }
  cleanUp(){
    if (this.partnerSourceSubscription) this.partnerSourceSubscription.unsubscribe();
  }
  ngOnDestroy() {
    this.cleanUp();
  }

}
