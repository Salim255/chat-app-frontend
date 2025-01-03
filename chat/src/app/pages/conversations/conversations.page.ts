import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { ConversationService } from 'src/app/features/conversations/services/conversations.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit, OnDestroy {
  private conversationsSource!: Subscription;
  conversations!: Array<Conversation> ;
  isEmpty: Boolean = true ;
  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
      if(chats){
        this.conversations = chats;

        if (this.conversations?.length !== 0) {
          this.isEmpty = false
        } else {
          this.isEmpty = true;
        }
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
