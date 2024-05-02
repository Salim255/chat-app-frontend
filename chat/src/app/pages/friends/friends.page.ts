import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Friend } from 'src/app/models/friend.model';
import { FriendsService } from 'src/app/services/friends/friends.service';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit, OnDestroy {
  private friendsSource!: Subscription;
  friendsArray: Array<Friend>;

  constructor(private friendsService: FriendsService) {
    this.friendsArray = []
  }

  ngOnInit() {
      this.friendsSource = this.friendsService.getFriendsArray.subscribe(data => {
      this.friendsArray = data;
    })
  }

  ionViewWillEnter() {
    this.friendsService.fetchFriends().subscribe( )
  }

  ngOnDestroy(){
      this.friendsSource.unsubscribe()
   }

}
