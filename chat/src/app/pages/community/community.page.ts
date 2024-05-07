import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CommunityService } from 'src/app/services/community/community.service';
import { Foreigner } from 'src/app/models/foreigner.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit, OnDestroy {

  private foreignersSource!: Subscription;
  foreignersList: Array < Foreigner >

  constructor (private communityService: CommunityService, private router: Router) {
    this.foreignersList = []
  }

  ngOnInit () {
    this.foreignersSource = this.communityService.      getNoConnectedFriendsArray.subscribe( (data )=> {
      this.foreignersList = data;
    })
  }

  ionViewWillEnter () {
     this.communityService.fetchUsers().subscribe()
  }

  addFriend(foreigner_id: number){
    if (foreigner_id) {
      let addFriendObs: Observable<any>
      addFriendObs = this.communityService.addFriend(foreigner_id);

      addFriendObs.subscribe({
        error: () => {
          console.log("error");
        },
        next: () => {
          this.foreignersList.pop();
        }
     })
    }
  }

  skipFriend (event: any) {
    this.foreignersList.pop()
  }

  ngOnDestroy () {
    this.foreignersSource.unsubscribe()
  }
}
