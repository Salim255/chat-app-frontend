import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Message } from "../../interfaces/message.interface";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { Subscription } from "rxjs";


@Component({
    selector: 'app-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: false
})
export class MessagesComponent implements OnInit, OnDestroy{
  messagesList: Message [] = [];
  userId: number | null = null;
  private userIdSubscription!: Subscription;
  date: Date | null = null;
  private messagesSourceSubscription!: Subscription;

  constructor(private authService: AuthService,
    private activeConversationService: ActiveConversationService) {

  }

  ngOnInit() {
    this.messagesSourceSubscription = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
      if (messages )  this.messagesList = messages;
     });

     this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });

  }

  getMessageStatus(messageStatus: string) {
    switch(messageStatus) {
      case 'read':
        return 'checkmark-done-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      default:
        return 'checkmark-outline'
    }
  }
  ngOnDestroy(): void {
    if (this.messagesSourceSubscription) this.messagesSourceSubscription.unsubscribe();
    if (this.userIdSubscription) this.userIdSubscription.unsubscribe();
  }
}
