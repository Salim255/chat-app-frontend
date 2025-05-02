import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Conversation } from '../../conversations/models/conversation.model';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import {
  CreateMessageDto,
} from '../pages/active-conversation/active-conversation.page';
import { ConversationService } from '../../conversations/services/conversations.service';
import {
  MessageEncryptDecrypt,
  MessageEncryptionData,
} from 'src/app/core/services/encryption/message-encrypt-decrypt-';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { Message } from '../../messages/model/message.model';
import {
  buildMessageEncryptionData,
  builtEncryptedMessageData,
  prepareEncryptedMessagePayload,
  processConversationResponse,
  restoreOriginalMessageContent,
} from './active-conversation.utils';
import { PartnerConnectionStatus } from 'src/app/core/services/socket-io/socket-room.service';
import { ConversationWorkerHandler } from '../../conversations/services/conversation.worker-handler';
import { MessageNotifierPayload } from 'src/app/core/services/socket-io/socket-message.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MessageEncryptionService } from './message-encryption.service';
import {
  ActiveConversationHttpService,
  ConversationResponse,
  CreateMessageResponse,
  RequestStatus,
  UpdateChatMessagesResponse,
} from './active-conversation-http.service';
import { ActiveConversationUIService } from './active-conversation-ui.service';
import { ActiveConversationNotificationService } from './active-conversation-notification.service';
import { ActiveConversationPartnerService } from './active-conversation-partner.service';

export type AuthData = {
  _privateKey: string;
  _publicKey: string;
  _email: string;
  id: string;
}
export type ConversationDto = {
  status: string;
  data: { chat: Conversation }
}

export type EncryptedMessageData = {
  encryptedMessageBase64: string;
  encryptedSessionKeyForSenderBase64: string | undefined;
  encryptedSessionKeyForReceiverBase64: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ActiveConversationService {
  private userId: number | null= null;
  private workerHandler!: ConversationWorkerHandler;
  private readonly activeConversationSource = new BehaviorSubject<Conversation | null>(null);

  constructor(
    private activeConversationUIService : ActiveConversationUIService,
    private conversationService: ConversationService,
    private authService: AuthService,
    private messageEncryptionService: MessageEncryptionService,
    private activeConversationHttpService: ActiveConversationHttpService,
    private activeConversationNotificationService: ActiveConversationNotificationService,
    private activeConversationPartnerService: ActiveConversationPartnerService,
  ) {
    this.workerHandler = new ConversationWorkerHandler();
    this.authService.userId.subscribe(userId => this.userId = userId);
  }

  // Open Conversation (Handle Room status and Messages)
  openConversation(partnerInfo: Partner, conversation: Conversation | null): void {
    if (!partnerInfo?.partner_id) return;

    this.updatePartnerConnectionStatus(partnerInfo.connection_status);
    if(conversation && conversation.delivered_messages_count > 0) {
      // Avoid call updated with sender join room
      this.markMessagesAsRead(conversation.id).pipe(take(1)).subscribe();
    }
    this.setPartnerInfo(partnerInfo);
    this.setActiveConversation(conversation);
    this.activeConversationUIService.openChatModal();
  }

  // Fetch Active conversation and handle Decryption
  fetchActiveConversation(): Observable<ConversationResponse> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        const activeChatId = this.activeConversationSource.value?.id;
        if (!authData || !activeChatId) throw new Error('Missing auth data');

        return this.activeConversationHttpService.fetchActiveConversation(activeChatId)
        .pipe(
          switchMap(response =>
            this.messageEncryptionService.decryptConversation(
              [response.data.chat],
              { email: authData._email, privateKey: authData._privateKey },
            ).pipe(
              map(decryptedConversation => ({
                status: response.status,
                data: { chat: decryptedConversation as Conversation }
              }))
            )
          ),
          tap(response => this.setActiveConversation(response.data.chat))
        );
      })
    );
  }

  // A function that create a new conversation
  createConversation(content:string):
   Observable<ConversationResponse> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) {
          throw new Error('Missing authentication data');
        }

        const messagePayload: MessageEncryptionData =
          buildMessageEncryptionData(
            content,
            authData,
            this.activeConversationPartnerService.partnerInfo,
            this.activeConversationSource.value
          );
        return from(MessageEncryptDecrypt.encryptMessage(messagePayload))
        .pipe(
            switchMap((encryptedData) => {
              return this.createConversationPost(encryptedData as EncryptedMessageData, authData);
            }),
            tap((response) => {
              const chat: Conversation = processConversationResponse(response, content);
              this.setActiveConversation(chat);
              this.conversationService.fetchConversations();
            })
        );
      })
    );
  }

  // Here we send a message to a current conversation
  sendMessage(message: string):
    Observable<CreateMessageResponse> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) throw new Error('There is no auth data');
        const roomStatus =this.activeConversationPartnerService.partnerInRoomStatus;
        if (
          !this.activeConversationSource.value
          || !this.activeConversationPartnerService.partnerInfo?.partner_id
          || !roomStatus
        ) throw new Error('Missing chat information');

        const messageData: CreateMessageDto =
          {
            chat_id: this.activeConversationSource?.value?.id,
            from_user_id:Number(authData.id),
            to_user_id:this.activeConversationPartnerService.partnerInfo.partner_id,
            content: message,
            partner_connection_status: roomStatus,
          }
          return this.encryptAndSendMessage(messageData, authData);
      })
    );
  }

  private encryptAndSendMessage(
    data: CreateMessageDto,
    authData: AuthData
  ): Observable<CreateMessageResponse> {
    return this.messageEncryptionService.encryptMessage(
      data.content,
      authData,
      this.activeConversationPartnerService.partnerInfo,
      this.activeConversationSource?.value)
      .pipe(
        switchMap((encryptedMessage) => {
        return this.sendEncryptedMessage(data, encryptedMessage.encryptedMessageBase64)
        .pipe(
            map((response) => {
              const sentMessage =
                restoreOriginalMessageContent(response.data.message, data.content);
              this.handlePostMessageSent(sentMessage);
              return { status: RequestStatus.Success , data: { message: sentMessage } };
            })
          );
        })
    );
  }

  private sendEncryptedMessage(
    originalData: CreateMessageDto,
    encryptedBase64: string,
  ): Observable<CreateMessageResponse> {
    const requestData = prepareEncryptedMessagePayload(originalData, encryptedBase64);
    return this.activeConversationHttpService.createMessage(requestData);
  }

  private handlePostMessageSent(message: Message): void {
    if (!this.activeConversationSource?.value?.messages) return
    const updatedConversation: Conversation =
     {
      ...this.activeConversationSource.value,
      messages:
        [ ...this.activeConversationSource.value.messages, message ]
    }
    this.setActiveConversation(updatedConversation);
    // Update conversation that this message belongs to in the conversations list
    this.conversationService.updateConversationWithNewMessage(message);
    // Update active conversation messages
    this.activeConversationUIService.setMessagePageScroll();
    // Notify partner of this message, if its not in room
    const roomStatus = this.activeConversationPartnerService.partnerInRoomStatus;
    if (
      (roomStatus === PartnerConnectionStatus.ONLINE)
      || (roomStatus === PartnerConnectionStatus.InRoom)
     ) {
      this.handlePartnerNotification(roomStatus);
    }
  }

  handlePartnerNotification(partnerInRoomStatus: 'in-room'| 'online'): void {
    const toUserId = this.activeConversationPartnerService.partnerInfo?.partner_id;
    const chatId = this.activeConversationSource.value?.id;
    const fromUserId = this.userId;
    if (!(this.userId && toUserId && chatId && fromUserId)) return;
    const notificationData: MessageNotifierPayload =
      {
        fromUserId,
        toUserId,
        chatId,
        partnerStatus: partnerInRoomStatus,
       }
    this.activeConversationNotificationService.notifyPartnerOfNewMessage(notificationData);
  }

  // Mark Messages as Read
  markMessagesAsRead(
    chatId: number,
  ): Observable<UpdateChatMessagesResponse>{
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) {
          throw new Error('Missing authentication data');
        }

        return this.activeConversationHttpService.updateChatMessagesToRead(chatId).pipe(
          tap(res => {
            const updatedMessages = res.data.messages;
            if (!this.activeConversationSource.value) return
            const conversationInfo: Conversation =
              {
                ...this.activeConversationSource.value,
                messages: updatedMessages,
                delivered_messages_count: 0,
              };

            this.handleUpdatedMessagesConversation(
              [conversationInfo],
              { email: authData._email, privateKey: authData._privateKey}
            );
          })
        );
    }));
  }

  private handleUpdatedMessagesConversation(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ) {
    if (conversations.length > 0) {
      this.workerHandler.decryptConversations(conversations, authData)
      .pipe(
        take(1),
        catchError(() => {
          return of([]);
        }
      ))
      .subscribe(decryptedConversations => {
        if (!decryptedConversations.length) return;
        // 1: Get the updated message
        const updatedMessages = decryptedConversations[0].messages;
        const activeConversation = this.activeConversationSource.value;
        if (!activeConversation) return;

        activeConversation.messages = activeConversation.messages.map(msg => {
          const updatedMsg = updatedMessages.find(m=> m.id === msg.id);
          if (updatedMsg) {
            return {...msg, status: updatedMsg.status}
          }
          return msg;
        })
        // Update the active conversation
        this.setActiveConversation(activeConversation);
        // Set conversations with updated conversation
        activeConversation.delivered_messages_count = 0;
        this.conversationService.restActiveConversationCounterWithJoinRoom(activeConversation);
      });
    }
  }

  // Update Partner Connection Status
  private updatePartnerConnectionStatus(status: string): void {
    const roomStatus =  status === 'online' ? PartnerConnectionStatus.ONLINE : PartnerConnectionStatus.OFFLINE;
    this.activeConversationPartnerService.setPartnerInRoomStatus(roomStatus)
  }

  private createConversationPost( encryptedMessage: EncryptedMessageData,authData: AuthData) {
    const payload =
        builtEncryptedMessageData(encryptedMessage, authData, this.activeConversationPartnerService.partnerInfo);
    if (!payload) throw new Error('Missing chat creation data');
    return this.activeConversationHttpService.createChat(payload) ;
  }

  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null): void {
    this.activeConversationPartnerService.setPartnerInfo(data);
  }

  // Here we set the active conversation
  setActiveConversation(conversation: Conversation | null): void {
    if (!conversation?.id) {
      this.activeConversationSource.next(null);
    } else {
      const builtActiveChat = { ...conversation }; // Immutable copy
      this.activeConversationSource.next(builtActiveChat);
    }
  }

  get getActiveConversation(): Observable<Conversation | null> {
    return this.activeConversationSource.asObservable();
  }
  get getActiveConversationValue(): Conversation | null{
      return this.activeConversationSource.value;
  }

  resetState(): void {
    this.activeConversationPartnerService.setPartnerInfo(null);
    this.activeConversationPartnerService.partnerRoomStatusSource.next(null);
    this.activeConversationSource.next(null);
  }
}
