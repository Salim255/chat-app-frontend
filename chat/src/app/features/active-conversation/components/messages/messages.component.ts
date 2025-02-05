import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Message } from "../../interfaces/message.interface";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { Subscription } from "rxjs";
import { MessageService } from "../../services/message.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";

@Component({
  selector: 'app-chat-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit{
  messagesList: Message [] = [];
  userId: number | null = null;
  private userIdSubscription!: Subscription;
  date: Date | null = null;
  private messagesSourceSubscription!: Subscription;

  constructor(private authService: AuthService,
    private activeConversationService: ActiveConversationService,
    private messageService: MessageService, private socketIoService : SocketIoService ) {

  }

  ngOnInit() {

    this.messagesSourceSubscription = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
      if (messages )  this.messagesList = messages;
      console.log(this.messagesList, "messages compo..💥💥")
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

}
