import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Match } from 'src/app/models/friend.model';
import { MatchesService } from 'src/app/services/matches/matches.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})

export class MatchesPage implements OnInit, OnDestroy {
  private matchesSource!: Subscription;
  matchesArray: Array < Match >;
  isEmpty: boolean = true;
  constructor(private matchesService: MatchesService) {
    this.matchesArray = []
  }

  ngOnInit () {
    this.matchesSource = this. matchesService.getMatchesArray
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
  }

  ngOnDestroy() {
    if (this.matchesSource) {
      this.matchesSource.unsubscribe();
    }
  }

}
