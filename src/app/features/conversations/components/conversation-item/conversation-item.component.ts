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
import { Conversation } from '../../../conversations/models/conversation.model';
import { Subscription } from 'rxjs';
import { Message } from '../../../messages/model/message.model';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { RandomUserConnectionStatus } from 'src/app/core/services/socket-io/socket-presence.service';
import { SocketTypingService, TypingStatus } from 'src/app/core/services/socket-io/socket-typing.service';
import { UserInChatDto } from '../../interfaces/conversations.dto';


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
  @Input()isTyping: boolean = false;

  lastMessage = signal<Message | null>(null);
  partnerInfo!: any;
  private messageDeliverySubscription!: Subscription;

  constructor(
    private socketTypingService: SocketTypingService,
    private activeConversationService: ActiveConversationService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.partnerInfo, this.partnerConnection)
    this.initializeConversation();
    this.subscribeToTyping();
    this.setPartnerConnectionStatus()
  }

  private subscribeToTyping():void {
      this.socketTypingService.getUserTypingStatus$.subscribe((typingStatus) => {
        if(!typingStatus || (this.conversation.id !== typingStatus?.chatId)) return;
        this.isTyping = (typingStatus.typingStatus === TypingStatus.Typing);
      }
     );
  }

  private setPartnerConnectionStatus() {
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

    this.lastMessage.set(this.conversation.messages[this.conversation.messages.length - 1]);
    this.setPartnerInfo();
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo(): void {
    const partner: UserInChatDto | undefined = this.conversation?.users?.find(
      (user) => user.user_id !== this.userId
    );

    if (!partner) return;
    this.partnerInfo = partner;
  }

  setAvatarUrl(): string {
   return StringUtils.getAvatarUrl(this.partnerInfo?.photos[0]);
  }

  // Here we are setting the active conversation and navigating to the active conversation
  onOpenChat(): void {
    if (!this.conversation || !this.partnerInfo?.user_id) return;
    this.activeConversationService.openConversation(this.partnerInfo, this.conversation);
  }

  getStatusColor(status: string): string {
    return status === 'online'
      ? 'var(--ion-color-online)'
      : 'var(--ion-color-offline)';
  }

  ngOnDestroy(): void {
    this.messageDeliverySubscription?.unsubscribe();
  }
}
