import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Friend } from 'src/app/models/friend.model';
import { CommunityService } from 'src/app/services/community/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit, OnDestroy {

  private noConnectedFriendsSource!: Subscription;
  noConnectedFriendsList: Array<Friend>

  constructor(private communityService: CommunityService, private router: Router) {
    this.noConnectedFriendsList = []
  }

  ngOnInit(): void {
    this.noConnectedFriendsSource = this.communityService.      getNoConnectedFriendsArray.subscribe( (data )=> {
      this.noConnectedFriendsList = data;
      console.log(this.noConnectedFriendsList);
    })
  }

  ionViewWillEnter() {
     this.communityService.fetchUsers().subscribe()
  }

  addFriend(non_friend_id: number){
    if (non_friend_id) {
      let addFriendObs: Observable<any>
      addFriendObs = this.communityService.addFriend(non_friend_id);

      addFriendObs.subscribe({
        error: () => {
          console.log("error");
        },
        next: () => {
          this.noConnectedFriendsList.pop();
        }
     })
    }

  }

  skipFriend(event: any){
    this.noConnectedFriendsList.pop()
  }

  ngOnDestroy(): void {
    this.noConnectedFriendsSource.unsubscribe()
  }
}
