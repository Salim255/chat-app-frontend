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
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  CreateMessageDto,
  ActiveConversationPage,
} from '../pages/active-conversation/active-conversation.page';
import { ConversationService } from '../../conversations/services/conversations.service';
import { ModalController } from '@ionic/angular';
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
import { MessageNotifierPayload, SocketMessageService } from 'src/app/core/services/socket-io/socket-message.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

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
export type CreateConversationPost = {
  content: string;
  from_user_id: number;
  to_user_id: number;
  partner_connection_status: string;
  session_key_sender: string;
  session_key_receiver: string;
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
  private ENV = environment;
  private userId: number | null= null;
  partnerInfoSource = new BehaviorSubject<Partner | null>(null);
  partnerRoomStatusSource = new BehaviorSubject<PartnerConnectionStatus>(PartnerConnectionStatus.OFFLINE);
  private activeConversationSource = new BehaviorSubject<Conversation | null>(null);
  receiverPublicKey: string | null = null;
  // This is where we store messages in a Map, indexed by status
  private triggerMessagePageScrollSource = new BehaviorSubject<string>('scroll');
  private workerHandler!: ConversationWorkerHandler;

  constructor(
    private http: HttpClient,
    private conversationService: ConversationService,
    private modalController: ModalController,
    private socketMessageService: SocketMessageService,
    private authService: AuthService,
  ) {
    this.setPartnerInfo(null);
    this.setActiveConversation(null);
    this.workerHandler = new ConversationWorkerHandler;
    this.authService.userId.subscribe(userId => this.userId = userId);
  }

  fetchActiveConversation(): Observable<{ status: string; data: { chat: Conversation } }> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap(authData => {
        if (!authData) throw new Error('Missing auth data');
        const activeChatId = this.activeConversationSource.value?.id;
        return this.http
        .get<{ status: string; data: { chat: Conversation } }>(`${this.ENV.apiUrl}/chats/${activeChatId}`).pipe(
          tap(response => {
           this.handleFetchedConversation(
              [response.data.chat],
              { email: authData._email, privateKey: authData._privateKey },
            )
          })
        );
      })
    );
  }

  private handleFetchedConversation(
    conversations: Conversation[],
    authData: { email: string; privateKey: string },
  ) {
    if (conversations.length > 0) {
      this.workerHandler.decryptConversations(conversations, authData)
      .pipe(
        take(1),
        catchError(() => {
          return [];
        }
      ))
      .subscribe(decrypted => {
        this.setActiveConversation(decrypted[0])
      });
    }
  }
    //

  openConversation(partnerInfo: Partner, conversation: Conversation | null): void {
    if (!partnerInfo || !partnerInfo.partner_id) return;
    if (partnerInfo.connection_status === 'online') {
      this.setPartnerInRoomStatus(PartnerConnectionStatus.ONLINE);
    }
    this.setPartnerInfo(partnerInfo);
    this.setActiveConversation(conversation);
    this.openChatModal();
  }

  private sendEncryptedMessage(
    encryptedMessage: EncryptedMessageData,
    authData: AuthData
  ) {
    const payload =
       builtEncryptedMessageData(encryptedMessage, authData, this.partnerInfoSource.value);
    if (!payload) throw new Error('Missing chat creation data');
    return this.http
      .post<{ status: string, data: { chat: Conversation } }>(`${this.ENV.apiUrl}/chats`,payload);
  }

  // A function that create a new conversation
  createConversation(content:string):
   Observable<{ status: string, data: { chat: Conversation } }> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) {
          throw new Error('Missing authentication data');
        }

        const messagePayload: MessageEncryptionData =
          buildMessageEncryptionData(
            content,
            authData,
            this.partnerInfoSource.value,
            this.activeConversationSource.value
          );
        return from(MessageEncryptDecrypt.encryptMessage(messagePayload))
        .pipe(
            switchMap((encryptedData) => {
              return this.sendEncryptedMessage(encryptedData as EncryptedMessageData, authData);
            }),
            tap((response) => {
              const chat: Conversation = processConversationResponse(response, content);
              this.setActiveConversation(chat);
              this.conversationService.fetchConversations();
              //this.socketIoService.createdConversationEmitter(response.data.chat);
            })
        );
      })
    );
  }

  // Here we send a message to a current conversation
  sendMessage(message: string):
    Observable<{ status: string, data: { message: Message }}> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) throw new Error('There is no auth data');
        if (
          !this.activeConversationSource.value
          || !this.partnerInfoSource.value?.partner_id
        ) throw new Error('Missing chat information');
        const data: CreateMessageDto =
          {
            chat_id: this.activeConversationSource?.value?.id,
            from_user_id:Number(authData.id),
            to_user_id: this.partnerInfoSource.value.partner_id,
            content: message,
            partner_connection_status: this.partnerRoomStatusSource.value,
          }
          console.log('hello from ', this.partnerRoomStatusSource.value)
          return this.sendSingleEncryptedMessage(data, authData);
      })
    );
  }

  private sendSingleEncryptedMessage(
    data: CreateMessageDto,
    authData: AuthData
  ): Observable<{ status: string; data: { message: Message } }> {
    const messageData =
      buildMessageEncryptionData(
        data.content,
        authData,
        this.partnerInfoSource.value,
        this.activeConversationSource?.value,
      );
    return from(MessageEncryptDecrypt.encryptMessage(messageData))
      .pipe(
        switchMap((encryptedMessage) => {
          const requestData =
            prepareEncryptedMessagePayload(data, encryptedMessage.encryptedMessageBase64);
          return this.http.post<{
              status: string,
              data: { message: Message }
            }>(`${this.ENV.apiUrl}/messages`, requestData).pipe(
            map((response) => {
              const sentMessage =
                restoreOriginalMessageContent(response.data.message, data.content);
              this.handlePostMessageSent(sentMessage);
              return { status: 'success', data: { message: sentMessage } };
            })
          );
        })
    );
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
    this.setMessagePageScroll();
    // Notify partner of this message, if its not in room
    if (this.partnerRoomStatusSource.value === PartnerConnectionStatus.ONLINE) {
      this. handlePartnerNotification();
    }
  }

  handlePartnerNotification(): void {
    const toUserId = this.partnerInfoSource.value?.partner_id;
    const chatId = this.activeConversationSource.value?.id;
    const fromUserId = this.userId;
    if (!(this.userId && toUserId && chatId && fromUserId)) return;
    const notificationData: MessageNotifierPayload =
      { fromUserId, toUserId, chatId }
    this.socketMessageService.notifyPartnerOfComingMessage(notificationData);
  }

  updateMessagesToReadWithPartnerJoinRoom(
    chatId: number,
  ): Observable<{ status: string, data: { messages: Message[] } }>{
    console.log(chatId)
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((authData) => {
        if (!authData) {
          throw new Error('Missing authentication data');
        }
        ///
        return this.http.patch<{ status: string; data: { messages: Message[] } }>(
          `${this.ENV.apiUrl}/chats/${chatId}/update-ms-to-read`,
           {},
        ).pipe(
          tap(res => {
            if (!this.activeConversationSource.value) return
            const conversationInfo: Conversation =
              {
                ...this.activeConversationSource.value,
                messages: res.data.messages,
              };
            this.handleUpdatedMessagesConversation(
              [conversationInfo],
              {
                email: authData._email,
                privateKey: authData._privateKey,
              });
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
          const updatedMsg = updatedMessages.find(m=> m.id = msg.id);
          if (updatedMsg) {
            return {...msg, status: updatedMsg.status}
          }
          return msg;
        })
        // Update the active conversation
        this.setActiveConversation(activeConversation)
      });
    }
  }

  setMessagePageScroll(): void {
    this.triggerMessagePageScrollSource.next('scroll');
  }
  get getTriggerMessagePageScroll():Observable<string> {
    return this.triggerMessagePageScrollSource.asObservable();
  }
  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null): void {
    this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data);
  }

  setPartnerInRoomStatus(status: PartnerConnectionStatus): void {
    this.partnerRoomStatusSource.next(status);
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

  get getPartnerConnectionStatus(): Observable<PartnerConnectionStatus> {
    return this.partnerRoomStatusSource.asObservable();
  }
  get getPartnerInfo():Observable<Partner| null> {
    return this.partnerInfoSource.asObservable();
  }

  get getActiveConversation(): Observable<Conversation | null> {
    return this.activeConversationSource.asObservable();
  }

  async openChatModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: ActiveConversationPage,
    });
    await modal.present();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
