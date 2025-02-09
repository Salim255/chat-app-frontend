import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';;
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

import { Router } from '@angular/router';
import { Partner } from 'src/app/interfaces/partner.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { User } from 'src/app/features/active-conversation/models/active-conversation.model';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';

@Component({
    selector: 'app-conversation-item',
    templateUrl: './conversation-item.component.html',
    styleUrls: ['./conversation-item.component.scss'],
    standalone: false
})

export class ConversationItemComponent implements OnInit, OnDestroy {
  @Input() conversation!: Conversation ;

  lastMessage: string | null = null;
  partnerInfo: Partner | null  = null;
  partnerImage: string = 'assets/images/default-profile.jpg';

  private userId: number | null = null;
  private userIdSubscription!: Subscription;


  constructor (
     private authService: AuthService,
     private router: Router,
     private activeConversationService: ActiveConversationService
    ) {}

  ngOnInit(): void {
    this.subscribeToUserId();
    this.initializeConversation();
  }

  // Subscribe to the user ID from aAuthservice
  private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  // Initializes the conversation data.
  private initializeConversation(): void {
    if (!this.conversation) {
      this.conversation = new Conversation(null, null, null, null, null);
    }

    if(this.conversation?.messages?.length  && this.conversation?.users ) {
      this.setLastMessage(this.conversation.messages );
      this.setPartnerInfo();
    }
  }

  // Here we are setting the last message
  setLastMessage (messages: Message []): void {
    const messagesSize = messages.length;
    this.lastMessage = messages[messagesSize - 1].content || null;
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo (): void {
    const partner =   this.conversation.users?.find((user: User) => user.user_id !== this.userId);

    if (!partner)  return;

    this.partnerInfo = {
        partner_id: partner?.user_id,
        avatar: partner.avatar,
        last_name: partner.last_name,
        first_name: partner.first_name,
        connection_status: partner.connection_status
      }

      this.partnerImage = partner.avatar ? `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.partnerInfo?.avatar}`:  this.partnerImage;
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat (): void {
      if (!this.conversation || !this.partnerInfo?.partner_id) return;

      this.activeConversationService.setPartnerInfo(this.partnerInfo);
      this.activeConversationService.setActiveConversation(this.conversation);

      this.router.navigate([`tabs/active-conversation/${this.partnerInfo.partner_id}`], {
        queryParams: { partner: this.partnerInfo.partner_id },
        replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.userIdSubscription?.unsubscribe();
  }
}
