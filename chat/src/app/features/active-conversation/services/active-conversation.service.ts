import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Conversation } from '../models/active-conversation.model';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateMessageData } from '../pages/active-conversation/active-conversation.page';
import { ConversationService } from '../../conversations/services/conversations.service';
import { CreateChatInfo } from '../pages/active-conversation/active-conversation.page';
import { ModalController } from '@ionic/angular';
import { ActiveConversationPage } from '../pages/active-conversation/active-conversation.page';
import {
  MessageEncryptDecrypt,
  MessageEncryptionData,
} from 'src/app/core/services/encryption/message-encrypt-decrypt-';
import { DecryptConversationsObserver } from './decryption-observer';
import { WorkerService } from 'src/app/core/workers/worker.service';
import { GetAuthData } from 'src/app/shared/utils/get-auth-data';
import { Message } from '../interfaces/message.interface';

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
  private activeConversationMessageMap: Map<string, Message[]> = new Map(); // don't remove it🔥🔥🔥
  private triggerMessagePageScrollSource = new BehaviorSubject<string>('scroll');

  constructor(
    private http: HttpClient,
    private conversationService: ConversationService,
    private modalController: ModalController,
    private workerService: WorkerService
  ) {
    this.worker = this.workerService.getWorker();
    this.setPartnerInfo(null);
    this.setActiveConversation(null);
  }

  openConversation(partnerInfo: Partner, conversation: Conversation | null): void {
    console.log(conversation);
    /*  this.setPartnerInfo(partnerInfo);
     this.setActiveConversation(fetchedConversation);
     this.openChatModal(); */
    if (!partnerInfo || !partnerInfo.partner_id) return;
    if (partnerInfo.connection_status === 'online') {
      this.setPartnerInRoomStatus(PartnerRoomStatus.CONNECTED);
    }
    this.setPartnerInfo(partnerInfo);
    this.setActiveConversation(conversation);

    this.openChatModal();
    /*  this.fetchChatByPartnerID(partnerInfo.partner_id).subscribe({
       next: (response)=> {
         if(response) {
           const fetchedConversation = response[0];
          this.setActiveConversation(fetchedConversation);
         }
       },
       error: (err) => {
         err
       }

     }) */

    //
    // this.openChatModal();
  }

  // Function that fetch conversation by partner ID
  fetchChatByPartnerID(partnerId: number): Observable<Conversation[] | null> {
    return this.http
      .get<{ data: Conversation }>(`${this.ENV.apiUrl}/chats/users/${partnerId}`)
      .pipe(
        map((response) => response.data),
        switchMap((conversation) => {
          if (conversation && this.worker) {
            const currentConversation = this.activeConversationSource.value;
            const existingMessages = new Set(
              currentConversation?.messages?.map((msg) => msg.id) || []
            );
            // Filter out messages that are already in the current conversation
            const newMessages = conversation?.messages?.filter(
              (msg) => !existingMessages.has(msg.id)
            );

            if (newMessages && newMessages?.length > 0) {
              return DecryptConversationsObserver.decryptConversation(
                [{ ...conversation, messages: newMessages }],
                this.worker
              ).pipe(
                map((decryptedConversation) => {
                  // Merge decrypted messages back into the conversation
                  return decryptedConversation.map((decryptedConv) => ({
                    ...decryptedConv,
                    messages: [
                      ...(currentConversation?.messages || []),
                      ...(decryptedConv?.messages || []),
                    ],
                  }));
                })
              );
            } else {
              return of(null);
            }
          } else {
            return of(null);
          }
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
  createConversation(data: CreateChatInfo) {
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

            return this.http.post<any>(`${this.ENV.apiUrl}/chats`, { ...data, ...rest }).pipe(
              tap((response) => {
                if (response?.data) {
                  const createdConversation = {
                    ...response.data,
                    messages: [
                      {
                        ...response.data.messages[0], // Keep all other fields from the API response
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
  sendMessage(data: CreateMessageData) {
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
            return this.http.post<any>(`${this.ENV.apiUrl}/messages`, requestData).pipe(
              map((response) => {
                // ========== Here we return the original message
                // avoiding decryption of the message
                // and returning the message as it was sent
                const sentMessage = { ...response.data, content: originalMessage };
                // Update conversation that this message belongs to in the conversations list
                this.conversationService.updateConversationWithNewMessage(sentMessage);
                // Update active conversation messages
                this.setMessagePageScroll();
                return sentMessage;
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

  setMessagePageScroll() {
    this.triggerMessagePageScrollSource.next('scroll');
  }
  get getTriggerMessagePageScroll() {
    return this.triggerMessagePageScrollSource.asObservable();
  }
  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null) {
    this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data);
  }

  setPartnerInRoomStatus(status: PartnerRoomStatus) {
    this.partnerRoomStatusSource.next(status);
  }

  // Here we set the active conversation
  setActiveConversation(conversation: Conversation | null) {
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

  get getActiveConversation() {
    return this.activeConversationSource.asObservable();
  }

  async openChatModal() {
    const modal = await this.modalController.create({
      component: ActiveConversationPage,
    });
    await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
