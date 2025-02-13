import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
@Component({
    selector: 'app-messages',
    templateUrl: './active-conversation-messages.page.html',
    styleUrls: ['./active-conversation-messages.page.scss'],
    standalone: false
})
export class ActiveConversationMessagesPage implements OnInit, OnDestroy {
  private typingSubscription!: Subscription;
  private messagesSubscription!: Subscription
  typingState: boolean = false;;

  constructor(
    private socketIoService: SocketIoService,
    private cdRef: ChangeDetectorRef,
    private activeConversationService:  ActiveConversationService
  ) { }

  ngOnInit() {
    this.subscribeToTyping();
    this.subscribeToMessages();
  }

  private subscribeToMessages() {
    this.messagesSubscription = this.activeConversationService
    .getActiveConversationMessages
    .subscribe(messages => {
      console.log(messages)
      //this.scrollToBottom();
    })
  }

  private subscribeToTyping() {
    this.typingSubscription =
        this.socketIoService.getUserTypingStatus
        .subscribe(typingStatus => {
        this.typingState = typingStatus || false;
    });
  }




  ngOnDestroy() {
    this.messagesSubscription?.unsubscribe();
    this.typingSubscription?.unsubscribe();
  }

}
