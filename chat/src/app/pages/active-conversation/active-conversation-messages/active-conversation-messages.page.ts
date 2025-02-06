import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketIoService } from 'src/app/services/socket.io/socket.io.service';

@Component({
    selector: 'app-messages',
    templateUrl: './active-conversation-messages.page.html',
    styleUrls: ['./active-conversation-messages.page.scss'],
    standalone: false
})
export class ActiveConversationMessagesPage implements OnInit, OnDestroy {
  private typingSubscription!: Subscription;

  typingState: boolean = false;;

  constructor( private socketIoService: SocketIoService
  ) { }

  ngOnInit() {
    this.socketIoService.getUserTypingStatus.subscribe(typingStatus => {
      if (typingStatus) {
        this.typingState = typingStatus
      } else {
        this.typingState = false
      }
    })
  }

  ngOnDestroy() {
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
  }

}
