import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  private messagesSource!: Subscription;
  messagesList:any;
  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    console.log('====================================');
    console.log("Hello");
    console.log('====================================');
    this.messagesSource = this.conversationService.getActiveChatMessages.subscribe(messages => {
      console.log(messages);
     this.messagesList = messages
    })
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.messagesSource.unsubscribe()
  }

}
