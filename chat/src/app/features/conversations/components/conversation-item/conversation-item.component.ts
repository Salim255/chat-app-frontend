import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  ActiveConversationService,
} from 'src/app/features/active-conversation/services/active-conversation.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Conversation } from '../../../conversations/models/conversation.model';
import { Subscription } from 'rxjs';
import { Message } from '../../../messages/model/message.model';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ProfileUtils } from 'src/app/shared/utils/profiles-utils';
import { RandomUserConnectionStatus } from 'src/app/core/services/socket-io/socket-presence.service';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
  standalone: false,
})
export class ConversationItemComponent
implements OnDestroy, OnChanges {
  @Input() conversation!: Conversation;
  @Input() userId: number | null = null;
  @Input() partnerConnection: RandomUserConnectionStatus | null  = null;

  lastMessage = signal<Message | null>(null);
  partnerInfo: Partner | null = null;
  private messageDeliverySubscription!: Subscription;

  constructor(private activeConversationService: ActiveConversationService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.initializeConversation();
    this.subscribeToPartnerConnectionStatus();

  }

  private subscribeToPartnerConnectionStatus() {
    if (
      !this.partnerInfo
      || !this.partnerConnection
      || (this.partnerInfo.partner_id !== this.partnerConnection.userId)
    )  return
    this.partnerInfo =
      { ...this.partnerInfo, connection_status: this.partnerConnection.status };
  }

  private initializeConversation(): void {
    if (!this.conversation?.messages?.length || !this.conversation?.users) return;

    this.lastMessage
    .set(this.conversation.messages [this.conversation.messages.length - 1]);
    this.setPartnerInfo();
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo(): void {
    const partner = this.conversation?.users?.find(
      (user) => user.user_id !== this.userId
    );

    if (!partner) return;
    this.partnerInfo = ProfileUtils.setProfileData(partner);
    this.partnerInfo.avatar = StringUtils.getAvatarUrl(partner.avatar);
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat(): void {
    if (!this.conversation || !this.partnerInfo?.partner_id) return;
    this.activeConversationService.openConversation(this.partnerInfo, this.conversation);
  }

  ngOnDestroy(): void {
    this.messageDeliverySubscription?.unsubscribe();
  }
}
