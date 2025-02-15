import {  Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';

@Component({
    selector: 'app-messages',
    templateUrl: './active-conversation-messages.page.html',
    styleUrls: ['./active-conversation-messages.page.scss'],
    standalone: false
})

export class ActiveConversationMessagesPage implements OnInit, OnDestroy {
  private typingSubscription!: Subscription;
  typingState: boolean = false;;

  constructor(
    private socketIoService: SocketIoService,
  ) { }

  ngOnInit() {
    this.subscribeToTyping();

  }

  private subscribeToTyping() {
    this.typingSubscription =
        this.socketIoService.getUserTypingStatus
        .subscribe(typingStatus => {
        this.typingState = typingStatus || false;
    });
  }

  ngOnDestroy() {
    this.typingSubscription?.unsubscribe();
  }

}
