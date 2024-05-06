import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/models/activeConversation.model';
import { ConversationService } from 'src/app/services/conversation/conversation.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  conversations!: Array<Conversation> ;
  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      if(chats){
        this.conversations = chats;
      }
    })
  }

  ionViewWillEnter () {
    this.conversationService.fetchConversations().subscribe();
  }

 ngOnDestroy () {
    this.conversationsSource.unsubscribe();
 }
}
