import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Conversation } from '../../conversations/models/conversation.model';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateMessageDto } from '../pages/active-conversation/active-conversation.page';
import { ConversationService } from '../../conversations/services/conversations.service';
import { CreateChatDto } from '../pages/active-conversation/active-conversation.page';
import { ModalController } from '@ionic/angular';
import { ActiveConversationPage } from '../pages/active-conversation/active-conversation.page';
import {
  MessageEncryptDecrypt,
  MessageEncryptionData,
} from 'src/app/core/services/encryption/message-encrypt-decrypt-';
import { WorkerService } from 'src/app/core/workers/worker.service';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { Message } from '../../messages/model/message.model';
import { workerRequest } from 'src/app/core/workers/worker-request';

export enum PartnerRoomStatus {
  OFFLINE = 'offline',
  CONNECTED = 'connected',
  IN_ROOM = 'in_room',
}

@Injectable({
  providedIn: 'root',
})
export class ActiveConversationService {
  private ENV = environment;
  private partnerInfoSource = new BehaviorSubject<Partner | null>(null);
  partnerRoomStatusSource = new BehaviorSubject<PartnerRoomStatus>(PartnerRoomStatus.OFFLINE);
  private activeConversationSource = new BehaviorSubject<Conversation | null>(null);
  receiverPublicKey: string | null = null;
  private worker: Worker | null = null;
  // This is where we store messages in a Map, indexed by status
  private triggerMessagePageScrollSource = new BehaviorSubject<string>('scroll');

  constructor(
    private http: HttpClient,
    private conversationService: ConversationService,
    private modalController: ModalController,
    private workerService: WorkerService
  ) {
    this.setPartnerInfo(null);
    this.setActiveConversation(null);
  }

  openConversation(partnerInfo: Partner, conversation: Conversation | null): void {
    if (!partnerInfo || !partnerInfo.partner_id) return;
    if (partnerInfo.connection_status === 'online') {
      this.setPartnerInRoomStatus(PartnerRoomStatus.CONNECTED);
    }
    this.setPartnerInfo(partnerInfo);
    this.setActiveConversation(conversation);
    this.openChatModal();
  }

  // Function that fetch conversation by partner ID
  fetchChatByPartnerID(partnerId: number): Observable<Conversation[] | null> {
    return this.http
      .get<{ data: Conversation }>(`${this.ENV.apiUrl}/chats/users/${partnerId}`)
      .pipe(
        map((response) => response.data),
        switchMap((conversation) => {
          //const worker = this.workerService.createDecryptWorker();
          if (!conversation) return of(null);

          const currentConversation = this.activeConversationSource.value;
          const existingMessages =
            new Set(currentConversation?.messages?.map((msg) => msg.id) || []);

          // Filter out messages that are already in the current conversation
          const newMessages =
            conversation?.messages?.filter((msg) => !existingMessages.has(msg.id));

          if (!newMessages || newMessages.length === 0) return of(null);

          const worker = this.workerService.createDecryptWorker();
          if (!worker) return of(null);

          const decryptPayload = {
            action: 'decrypt-conversations',
            conversations: [{ ...conversation, messages: newMessages }],
            privateKey: 'YOUR_PRIVATE_KEY_HERE', // make sure you pass correct key
            email: 'YOUR_EMAIL_HERE' // same here
          };

          return from(workerRequest<typeof decryptPayload, { action: string; conversations: Conversation[] }>(worker, decryptPayload))
           .pipe(
            map(response => {
              // Merge decrypted messages back into the conversation
              return response.conversations.map((decryptedConv) => ({
                ...decryptedConv,
                messages: [
                  ...(currentConversation?.messages || []),
                  ...(decryptedConv?.messages || []),
                ],
              }));
            })
          );
        }),
        tap((conversations) => {
          if (conversations && conversations?.length > 0) {
            this.setActiveConversation(conversations[0]);
          } else {
            this.setActiveConversation(null);
          }
        })
      );
  }

  // A function that create a new conversation
  createConversation(data: CreateChatDto): Observable<{ status: string, data: { chat: Conversation } }> {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((storedData) => {
        if (!storedData) throw new Error('There is no auth data');

        const messageData: MessageEncryptionData = {
          messageText: data.content,
          senderPublicKeyBase64: storedData._publicKey,
          encryptedSessionKey: null,
          receiverPublicKeyBase64: this.partnerInfoSource.value?.public_key ?? null,
          senderPrivateKeyBase64: storedData._privateKey,
          senderEmail: storedData._email,
        };
        return from(MessageEncryptDecrypt.encryptMessage(messageData)).pipe(
          switchMap((encryptedData) => {
            const { encryptedMessageBase64, ...rest } = encryptedData;
            data.content = encryptedMessageBase64;
            console.log(data)
            return this.http.post<{ status: string, data: { chat: Conversation } }>(`${this.ENV.apiUrl}/chats`,
              {
                ...data,
                session_key_sender: rest.encryptedSessionKeyForSenderBase64,
                session_key_receiver: rest.encryptedSessionKeyForReceiverBase64
               }).pipe(
              tap((response) => {
                if (response?.data.chat) {
                  const createdConversation = {
                    ...response.data.chat,
                    messages: [
                      {
                        ...response.data.chat.messages[0], // Keep all other fields from the API response
                        content: messageData.messageText, // Override only the content with the original text
                      },
                    ],
                  };
                  this.conversationService.fetchConversations();
                  this.setActiveConversation(createdConversation);
                }
              })
            );
          })
        );
      })
    );
  }

  // Here we send a message to a current conversation
  sendMessage(data: CreateMessageDto):
    Observable<{ status: string, data: { message: Message }}> {
    if (!this.activeConversationSource.value) throw new Error('There is no chat.');

    return from(GetAuthData.getAuthData()).pipe(
      switchMap((storedData) => {
        if (!storedData) throw new Error('There is no auth data');

        const messageData: MessageEncryptionData = {
          messageText: data.content,
          senderPublicKeyBase64: null,
          encryptedSessionKey:
            this.activeConversationSource.value?.encrypted_session_base64 ?? null,
          receiverPublicKeyBase64: null,
          senderPrivateKeyBase64: storedData._privateKey,
          senderEmail: storedData._email,
        };

        // ==========
        return from(MessageEncryptDecrypt.encryptMessage(messageData)).pipe(
          switchMap((encryptedMessage) => {
            const { encryptedMessageBase64 } = encryptedMessage;
            // ========== Here we store the original message
            const originalMessage = data.content;
            // ========== Here we associate the encrypted message with the data object
            const requestData = { ...data, content: encryptedMessageBase64 };
            console.log(requestData, 'Hello message data')
            return this.http.post<{ status: string, data: { message: Message }}>(`${this.ENV.apiUrl}/messages`, requestData).pipe(
              map((response) => {
                // ========== Here we return the original message
                // avoiding decryption of the message
                // and returning the message as it was sent
                const sentMessage = { ...response.data.message, content: originalMessage };
                // Update conversation that this message belongs to in the conversations list
                this.conversationService.updateConversationWithNewMessage(sentMessage);
                // Update active conversation messages
                this.setMessagePageScroll();
                return { status: 'success', data: { message: sentMessage } };
              })
            );
          })
        );
      })
    );
  }

  updateMessagesStatusToDeliveredWithPartnerConnection(activeChat: Conversation) {
    if (activeChat && activeChat.messages) {
      if (activeChat && activeChat.messages) {
        // Directly update the status of 'sent' messages to 'delivered'
        activeChat.messages.forEach((message) => {
          if (message.status === 'sent') {
            message.status = 'delivered'; // Update status in place
          }
        });
      }
    }

    // 1 Update conversion in conversations
    this.conversationService.updatedActiveConversationMessagesToDeliveredWithPartnerRejoinRoom({
      ...activeChat,
    });

    return activeChat;
  }

  setMessagePageScroll(): void {
    this.triggerMessagePageScrollSource.next('scroll');
  }
  get getTriggerMessagePageScroll() {
    return this.triggerMessagePageScrollSource.asObservable();
  }
  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null): void {
    this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data);
  }

  setPartnerInRoomStatus(status: PartnerRoomStatus): void {
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

  get getPartnerInfo() {
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
