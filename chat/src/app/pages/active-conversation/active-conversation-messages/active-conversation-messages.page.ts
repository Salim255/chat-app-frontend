import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketIoService } from 'src/app/services/socket.io/socket.io.service';

@Component({
  selector: 'app-messages',
  templateUrl: './active-conversation-messages.page.html',
  styleUrls: ['./active-conversation-messages.page.scss'],
})
export class ActiveConversationMessagesPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  private messagesSource!: Subscription;
  private typingSubscription!: Subscription;

  typingState = false;
  messagesList:any;
  constructor( private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService
  ) { }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  ngOnInit() {
    //getActiveConversationMessages
    this.messagesSource = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
     this.messagesList = messages
    })
  }

  ionViewWillEnter () {
    this.typingState = false;

    // Here we listen to partner typing event
    this.typingSubscription = this.socketIoService.getComingTypingEvent.subscribe((status) => {
        if (status) {
          // If data = true, then we set typing to true
          this.typingState = status
        } else {
          // If data = false, then we set typing to false
          this.typingState = status
        }
      })
   }

  scrollToBottom() {
    this.content.scrollToBottom(300); // Scrolls to bottom with a duration of 300ms
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.messagesSource) {
      this.messagesSource.unsubscribe()
    }
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }

    this.activeConversationService.setActiveConversationMessages(null);
  }

}
