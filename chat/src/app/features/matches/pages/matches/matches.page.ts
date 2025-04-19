import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchesService } from 'src/app/features/matches/services/matches.service';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: false,
})
export class MatchesPage implements OnInit, OnDestroy {
  private partnerSourceSubscription!: Subscription;
  placeHolderText = `You haven't any matches yet. Start exploring and find your perfect match!`;
  matchesArray = signal<Match[]>([]);

  constructor(private matchesService: MatchesService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('hello', this.matchesArray().length);
  }
  // Add a trackBy function for better performance
  trackById(index: number, conversation: any) {
    return conversation.id;
  }

  ionViewWillEnter(): void {
    this.subscribeToMatches();
    this.matchesService.fetchMatches().subscribe();
  }

  ionViewWillLeave(): void {
    this.cleanUp();
  }

  private cleanUp() {
    this.partnerSourceSubscription?.unsubscribe();
  }

  private subscribeToMatches() {
    this.partnerSourceSubscription = this.matchesService.getMatchesArray.subscribe((data) => {
      console.log('Data received:', data);
      if (data) {
        this.matchesArray.set(data);
        console.log('hello', this.matchesArray().length);
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
