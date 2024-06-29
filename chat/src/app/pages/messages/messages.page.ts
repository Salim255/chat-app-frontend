import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  private messagesSource!: Subscription;
  messagesList:any;
  constructor(private conversationService: ConversationService) { }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  ngOnInit() {

    this.messagesSource = this.conversationService.getActiveChatMessages.subscribe(messages => {
     this.messagesList = messages
    })
  }

  scrollToBottom() {
    this.content.scrollToBottom(300); // Scrolls to bottom with a duration of 300ms
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.messagesSource.unsubscribe()
  }

}
