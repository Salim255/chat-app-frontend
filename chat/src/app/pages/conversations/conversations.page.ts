import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { SocketIoService } from 'src/app/services/socket.io/socket.io.service';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  conversations: Array<Conversation> = [] ;
  isEmpty: boolean = true ;
  constructor(private conversationService: ConversationService,
    private accountService: AccountService, private socketIoService: SocketIoService
  ) { }

  ngOnInit() {

    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      if(chats){
        this.conversations = chats;
        this.isEmpty = chats.length === 0 ;
      }
    })

    this.socketIoService.getMessageDeliveredToReceiver.subscribe(message => {
       if (message) {
        this.updateChatWithReceivedMessage(message)
       }

    })

    this.socketIoService.updateReceiverMessagesListener();
  }

  ionViewWillEnter () {
    this.conversationService.fetchConversations().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  updateChatWithReceivedMessage(message: Message) {
    // Find the conversation by its ID
    const chatIndex = this.conversations.findIndex(chat => chat.id === message.chat_id);
    if (chatIndex === -1) return;

    const conversation = this.conversations[chatIndex] ;
    if (!conversation?.messages ) return;

    // Check for a message with the message.id
    const messageIndex = this.conversations[chatIndex]?.messages?.findIndex(msg => msg.id === message.id);

    if (messageIndex === -1) {
      // Add the message immutably
      this.conversations[chatIndex] = {
        ...conversation,
        messages: [...conversation.messages, message]
      }

    } else {
      // Add the message immutably
      const updatedMessages = conversation.messages.map((msg, index) =>
        index === messageIndex ? message : msg
      )

      this.conversations[chatIndex] = {
        ...conversation,
        messages: updatedMessages
      }
    }
  }


 ngOnDestroy () {
    this.conversationsSource.unsubscribe();
 }
}
