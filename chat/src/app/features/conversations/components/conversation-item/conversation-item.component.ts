import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';
import { Router } from '@angular/router';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ProfileUtils } from 'src/app/shared/utils/profiles-utils';
import { Member } from 'src/app/shared/interfaces/member.interface';

@Component({
    selector: 'app-conversation-item',
    templateUrl: './conversation-item.component.html',
    styleUrls: ['./conversation-item.component.scss'],
    standalone: false
})

export class ConversationItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversation: Conversation  | null = null;
  @Input() userId: number | null = null

  lastMessage: Message | null = null;
  readMessagesCounter: number = 0 ;
  partnerInfo: Partner | null  = null;
  partnerImage: string = 'assets/images/default-profile.jpg';

  private updatedUserDisconnectionSubscription!: Subscription;
  private messageDeliverySubscription!: Subscription;

  constructor (
     private router: Router,
     private activeConversationService: ActiveConversationService,
     private  socketIoService:  SocketIoService,
    ) {}

  ngOnInit(): void {
    this.subscribeToPartnerConnectionStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
   this.initializeConversation();
  }


  private subscribeToPartnerConnectionStatus() {
    this.updatedUserDisconnectionSubscription = this.socketIoService.getPartnerConnectionStatus.subscribe(updatedUser => {
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
      this.conversation = new Conversation(null, null, null, null, null, null, null, null);
    }

    if(this.conversation?.messages?.length && this.conversation?.users ) {
      this.conversation = {...this.conversation};
      this.lastMessage = this.conversation?.last_message ;
      this.readMessagesCounter = this.conversation.no_read_messages ?? 0;
      this.setPartnerInfo();
    }
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo (): void {
    const partner =   this.conversation?.users?.find((user: Member) => user.user_id !== this.userId);

    if (!partner)  return;

    this.partnerInfo = ProfileUtils.setProfileData(partner);
    console.log(this.partnerInfo, "Hello from conversation item")

    this.partnerInfo.avatar = StringUtils.getAvatarUrl(partner.avatar)
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat (): void {
      if (!this.conversation || !this.partnerInfo?.partner_id) return;
      this.activeConversationService.onOpenChat(this.partnerInfo)
  }

  ngOnDestroy(): void {
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.messageDeliverySubscription?.unsubscribe();
  }
}
