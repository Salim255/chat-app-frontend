import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';

@Component({
    selector: 'app-conversations',
    templateUrl: './conversations.page.html',
    styleUrls: ['./conversations.page.scss'],
    standalone: false
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  private updatedUserDisconnectionSubscription!: Subscription;

  conversations: Array<Conversation> = [] ;
  isEmpty: boolean = true ;
  constructor(private conversationService: ConversationService,
    private accountService: AccountService, private socketIoService: SocketIoService
  ) { }

  ngOnInit() {
    this.subscribeToConversations();
    this.subscribeUpdatedUserDisconnection();
  }

  ionViewWillEnter () {
    if (!this.conversationsSource || this.conversationsSource.closed) {
        this.subscribeToConversations();
    }

    if (!this.updatedUserDisconnectionSubscription || this.updatedUserDisconnectionSubscription.closed) {
      this.subscribeUpdatedUserDisconnection();
    }

    this.conversationService.fetchConversations().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  ionViewWillLeave () {
    this.cleanUp();
  }

  private subscribeToConversations() {
    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      if(chats){
        this.conversations = chats;
        this.isEmpty = chats.length === 0 ;
      }
    })
  }

  private subscribeUpdatedUserDisconnection() {
    this.updatedUserDisconnectionSubscription = this.socketIoService.updatedUserDisconnectionGetter.subscribe(data => {
      this.conversationService.fetchConversations().subscribe();
     })
  }

  private cleanUp() {
    this.conversationsSource?.unsubscribe();
    this.updatedUserDisconnectionSubscription?.unsubscribe()
  }

  ngOnDestroy () {
    this.cleanUp();
  }
}
