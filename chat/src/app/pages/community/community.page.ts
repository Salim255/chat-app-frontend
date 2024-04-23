import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Friend } from 'src/app/models/friend.model';
import { CommunityService } from 'src/app/services/community/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  private noConnectedFriendsSource!: Subscription;
  noConnectedFriendsList: Array<Friend>
  constructor(private communityService: CommunityService, private router: Router) {
    this.noConnectedFriendsList = []
  }

  ngOnInit(): void {
    this.noConnectedFriendsSource = this.communityService.      getNoConnectedFriendsArray.subscribe( (data )=> {
      this.noConnectedFriendsList = data
      console.log('====================================');
      console.log(this.noConnectedFriendsList);
      console.log('====================================');
    })

  }

  ionViewWillEnter() {
     this.communityService.fetchUsers().subscribe()
  }

}
