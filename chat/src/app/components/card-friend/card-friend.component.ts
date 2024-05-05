import { Component,  Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Friend } from 'src/app/models/friend.model';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
@Component({
  selector: 'app-card-friend',
  templateUrl: './card-friend.component.html',
  styleUrls: ['./card-friend.component.scss'],
})
export class CardFriendComponent  implements OnInit {
 @Input() friend!: any;
  constructor(private router: Router, private conversationService: ConversationService) { }

  ngOnInit() {
    console.log("Hello") ;
  }

  openChat(){
    if (!this.friend?.friend_id) return;
    this.conversationService.setPartnerInfo(this.friend);
    let fetchChatObs: Observable<any>
    fetchChatObs = this.conversationService.fetchChatByUsers(this.friend?.friend_id)

    fetchChatObs.subscribe({
      error: () => {
        console.error()
      },
      next: () => {
          this.router.navigate(['/active-conversation'], { queryParams: { partner: this.friend?.friend_id } });
      }
    })

  }
}
