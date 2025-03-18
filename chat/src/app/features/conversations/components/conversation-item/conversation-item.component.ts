import { Component, Input, OnChanges, OnDestroy, OnInit, signal, Signal, SimpleChanges } from '@angular/core';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ProfileUtils } from 'src/app/shared/utils/profiles-utils';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { SocketMessageHandler } from 'src/app/core/services/socket-io/socket-message-handler';

@Component({
    selector: 'app-conversation-item',
    templateUrl: './conversation-item.component.html',
    styleUrls: ['./conversation-item.component.scss'],
    standalone: false
})

export class ConversationItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversation: Conversation  | null = null;
  @Input() userId: number | null = null

  lastMessage = signal< Message | null >(null);
  readMessagesCounter: number = 0 ;
  partnerInfo: Partner | null  = null;

  private updatedUserDisconnectionSubscription!: Subscription;
  private messageDeliverySubscription!: Subscription;

  constructor (
     private activeConversationService: ActiveConversationService,
     private  socketMessageHandler:  SocketMessageHandler
    ) {}

  ngOnInit(): void {
    this.subscribeToPartnerConnectionStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
   this.initializeConversation();
  }

  private subscribeToPartnerConnectionStatus() {
    this.updatedUserDisconnectionSubscription = this.socketMessageHandler.getPartnerConnectionStatus.subscribe(updatedUser => {
      if ( updatedUser?.connection_status !== undefined && this.partnerInfo && updatedUser.user_id === this.partnerInfo.partner_id) {
        this.partnerInfo = {
          ...this.partnerInfo,
          connection_status: updatedUser.connection_status
        }
      }
    })
  }

  // Initializes the conversation data.
  private initializeConversation(): void {
    if (!this.conversation) {
      this.conversation = new Conversation(null,null, null, null, null, null, null, null, null);
    }

    if(this.conversation?.messages?.length && this.conversation?.users ) {
      this.lastMessage.set(this.conversation.messages?.at(-1) || null) ;
      this.readMessagesCounter = this.conversation.no_read_messages ?? 0;
      this.setPartnerInfo();
    }
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo (): void {
    const partner =   this.conversation?.users?.find((user: Member) => user.user_id !== this.userId);

    if (!partner)  return;
    this.partnerInfo = ProfileUtils.setProfileData(partner);
    this.partnerInfo.avatar = StringUtils.getAvatarUrl(partner.avatar)
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat (): void {
    if (!this.conversation || !this.partnerInfo?.partner_id) return;
    this.activeConversationService.openConversation(this.partnerInfo, this.conversation)
  }


  ngOnDestroy(): void {
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.messageDeliverySubscription?.unsubscribe();
  }
}
