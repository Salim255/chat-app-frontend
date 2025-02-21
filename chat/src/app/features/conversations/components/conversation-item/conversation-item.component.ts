import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';;
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';
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

export class ConversationItemComponent implements OnDestroy, OnChanges {
  @Input() conversation: Conversation  | null = null;

  lastMessage: Message | null = null;
  readMessagesCounter: number = 0 ;
  partnerInfo: Partner | null  = null;
  partnerImage: string = 'assets/images/default-profile.jpg';


  userId: number | null = null;
  private userIdSubscription!: Subscription;
  private updatedUserDisconnectionSubscription!: Subscription;
  private messageDeliverySubscription!: Subscription;
  private updatedChatCounterSubscription!: Subscription;

  constructor (
     private authService: AuthService,
     private router: Router,
     private activeConversationService: ActiveConversationService,
     private  socketIoService:  SocketIoService,
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
   // console.log(this.conversation)
    this.subscribeToUserId();
    this.initializeConversation();
    this.subscribeToPartnerConnectionStatus();

    this.subscribeToMessageDelivery();
    this.subscribeToUpdateChatCounter();
  }

  // Subscribe to update chat counter
  private subscribeToUpdateChatCounter() {
    this.updatedChatCounterSubscription = this.socketIoService.getUpdatedChatCounter.subscribe(updatedChat => {
      if (updatedChat?.id === this.conversation?.id ) {
        this.readMessagesCounter = updatedChat?.no_read_messages ? updatedChat?.no_read_messages : this.readMessagesCounter ;
      }
    })
  }

  // Subscribe to message delivery
  private subscribeToMessageDelivery(){
    this.messageDeliverySubscription = this.socketIoService.getMessageDeliveredToReceiver.subscribe(message => {
      //console.log(message, "hello message ")
       if (message) {

        this.updateChatWithReceivedMessage(message)
       }
    })
  }
  // Subscribe to the user ID from aAuthservice
  private subscribeToUserId(): void {
    this.userIdSubscription = this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
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
      this.conversation = new Conversation(null, null, null, null, null, null, null);
    }

    if(this.conversation?.messages?.length && this.conversation?.users ) {
      this.lastMessage = this.conversation.last_message;
      this.readMessagesCounter = this.conversation.no_read_messages ?? 0;
      this.setPartnerInfo();
    }
  }

  // Here we are filtering the users to get the partner info
  setPartnerInfo (): void {
    const partner =   this.conversation?.users?.find((user: User) => user.user_id !== this.userId);

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

  private updateChatWithReceivedMessage(message: any) {
    // Only update if the conversation exists and the message belongs to this chat
    if (!this.conversation || this.conversation.id !== message?.chat_id ) return;

    // Always update the last message reference
    this.lastMessage =  message ;

    // Use existing messages or default to an empty array
    const currentMessages = this.conversation.messages || [];

    // Find if this message already exists in the conversation
    const messageIndex = currentMessages.findIndex(msg => msg.id === message.id);
    if (messageIndex === -1) {
      // Add the message immutably
      this.conversation = {
        ...this.conversation,
        messages: [...this.conversation.messages || [], message ]
      }

    } else {
      // Add the message immutably
      const updatedMessages = this.conversation?.messages?.map((msg, index) =>
        index === messageIndex ? message : msg
      )

      this.conversation = {
        ...this.conversation,
        messages: updatedMessages || []
      }
    }
  }

  ngOnDestroy(): void {
    this.userIdSubscription?.unsubscribe();
    this.updatedUserDisconnectionSubscription?.unsubscribe();
    this.messageDeliverySubscription?.unsubscribe();
    this. updatedChatCounterSubscription?.unsubscribe();
  }
}
