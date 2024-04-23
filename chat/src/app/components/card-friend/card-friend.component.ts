import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card-friend',
  templateUrl: './card-friend.component.html',
  styleUrls: ['./card-friend.component.scss'],
})
export class CardFriendComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('====================================');
    console.log("Hello");
    console.log('====================================');
  }
  openChat(){
     this.router.navigateByUrl('/conversation')
  }
}
