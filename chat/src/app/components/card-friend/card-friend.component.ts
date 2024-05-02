import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/friend.model';
@Component({
  selector: 'app-card-friend',
  templateUrl: './card-friend.component.html',
  styleUrls: ['./card-friend.component.scss'],
})
export class CardFriendComponent  implements OnInit {
 @Input() friend!: Friend;
  constructor(private router: Router) { }

  ngOnInit() {
    console.log('====================================');
    console.log("Hello");
    console.log('====================================');
  }
  openChat(partnerId: number){
    this.router.navigate(['/active-conversation'], { queryParams: { partner: partnerId } });

  }
}
