import { Component, OnInit } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Conversation } from 'src/app/models/activeConversation.model';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {
  private conversationsSource!: Subscription;
  conversations!: Array<any> ;
  constructor(private conversationService: ConversationService) { }

  ngOnInit() {

  this.conversationsSource = this.conversationService.getConversations.subscribe(chats => {
    console.log(chats);
    if(chats){
      this.conversations = chats;
      console.log(this.conversations);
    }



  })


  }

  ionViewWillEnter() {
    console.log('====================================');
    console.log("Hello from will enter 💥💥");
    console.log('====================================');
    this.conversationService.fetchConversations().subscribe()
 }


 ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
    this.conversationsSource.unsubscribe();
 }
}
