import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, Observable, of, pipe, switchMap, tap } from "rxjs";
import { Conversation } from "../models/active-conversation.model";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { Message } from "../interfaces/message.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CreateMessageData } from "../pages/active-conversation/active-conversation.page";
import { ConversationService } from "../../conversations/services/conversations.service";
import { CreateChatInfo } from "../pages/active-conversation/active-conversation.page";
import { ModalController } from "@ionic/angular";
import { ActiveConversationPage } from "../pages/active-conversation/active-conversation.page";
import { Preferences } from "@capacitor/preferences";
import { MessageEncryptDecrypt, MessageEncryptionData } from "src/app/core/services/encryption/message-encrypt-decrypt-";
import { DecryptConversationsObserver } from "./decryption-observer";
import { WorkerService } from "src/app/core/workers/worker.service";

@Injectable({
  providedIn: 'root'
})

export class ActiveConversationService {
  private ENV = environment;
  private partnerInfoSource = new BehaviorSubject < Partner | null > (null);
  private activeConversationSource = new BehaviorSubject < Conversation | null > (null);

  receiverPublicKey: string | null = null;

  private worker: Worker | null = null;

  constructor(
    private http: HttpClient,
    private conversationService: ConversationService,
    private  modalController:  ModalController,
    private workerService: WorkerService
  ) {
    this.worker = this.workerService.getWorker();
    this.setPartnerInfo(null);
    this.setActiveConversation(null);
  }


  async openChatModal() {
      const modal = await this.modalController.create({
        component: ActiveConversationPage ,
      })
      await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  openConversation(partnerInfo: Partner, conversation: Conversation | null): void {
    if (!partnerInfo || !partnerInfo.partner_id) return
    this.setPartnerInfo(partnerInfo);
    this.setActiveConversation(conversation);
    this.openChatModal();
  }

  // A function that create a new conversation
  createConversation (data: CreateChatInfo) {
    return from(Preferences.get({ key: 'authData' })).pipe(
      switchMap((storedData) => {
        if (!storedData || !storedData.value)  {
          throw new Error("Something went wrong.");
        }
        const parsedData = JSON.parse(storedData.value) as {
            _privateKey: string,
            _publicKey: string,
            _email: string
        }

        const messageData : MessageEncryptionData = {
          messageText: data.content,
          senderPublicKeyBase64: parsedData._publicKey,
          encryptedSessionKey: null,
          receiverPublicKeyBase64: this.partnerInfoSource.value?.public_key ?? null ,
          senderPrivateKeyBase64: parsedData._privateKey,
          senderEmail: parsedData._email
        };


        return from( MessageEncryptDecrypt.encryptMessage(messageData)).pipe(
          switchMap((encryptedData) => {
            const { encryptedMessageBase64, ...rest } = encryptedData;
            data.content = encryptedMessageBase64;

            return this.http.post<any>(`${this.ENV.apiUrl}/chats`, {...data, ...rest }).pipe(
              tap((response) => {
              if (response.data) {
                console.log(response.data)
                this.setActiveConversation(response.data);
              }
            }));
          })
        );
      })
    );
  }

  // Function that fetch conversation by partner ID
  fetchChatByPartnerID (partnerId: number): Observable <Conversation [] | null> {
        return this.http.get<{ data: Conversation }>(`${this.ENV.apiUrl}/chats/users/${partnerId}`)
        .pipe(
          map(response => response.data),
          switchMap(conversations => {
              if (conversations && this.worker) {

                const data = [conversations]
                return DecryptConversationsObserver.decryptConversation( data, this.worker)
              } else {
                return of(null);
              }
          }),
          tap(conversations => {
            if (conversations && conversations?.length> 0) {
              this.setActiveConversation(conversations[0])
            }
           else {
            this.setActiveConversation(null);
           }
          })
        );
  }


  // Here we set the active conversation
  setActiveConversation(conversation: Conversation | null) {
    if (!conversation?.id) {
      this.activeConversationSource.next(null);
    } else {
      const builtActiveChat = {...conversation }; // Immutable copy
      this.activeConversationSource.next(builtActiveChat);
    }
  }

  // Here we send a message to a current conversation
  sendMessage(data: CreateMessageData) {
    return from (Preferences.get({key: 'authData'})).pipe(
      switchMap((storedData) => {
        if (!storedData || !storedData.value)  {
          throw new Error("Something went wrong.");
        }

        const parsedData = JSON.parse(storedData.value) as {
          _privateKey: string,
          _publicKey: string,
          _email: string
        }

        const messageData : MessageEncryptionData = {
          messageText: data.content,
          senderPublicKeyBase64: null,
          encryptedSessionKey:
            this.activeConversationSource.value?.encrypted_session_base64
            ?? null,
          receiverPublicKeyBase64: null ,
          senderPrivateKeyBase64: parsedData._privateKey,
          senderEmail: parsedData._email
        };

        // ==========
        return from (MessageEncryptDecrypt.encryptMessage(messageData)).pipe(
          switchMap((encryptedMessage) => {
            const { encryptedMessageBase64 } = encryptedMessage;

            // ========== Here we store the original message
            const originalMessage = data.content;
            // ========== Here we associate the encrypted message with the data object
            data.content = encryptedMessageBase64;

            return this.http.post<any>(`${this.ENV.apiUrl}/messages`, data)
            .pipe(
              map(response => {
                // ========== Here we return the original message
                // avoiding decryption of the message
                // and returning the message as it was sent
                const sentMessage = { ...response.data, content: originalMessage };
                // Update conversation that this message belongs to in the conversations list
                this.conversationService.updateConversationWithNewMessage(sentMessage);
                // Update active conversation messages
                return sentMessage;
              }))
          })
        )
      })
    )
  }

  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null) {
    this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data)
  }


  get getPartnerInfo (){
    return this.partnerInfoSource.asObservable();
  }

  get getActiveConversation () {
    return this.activeConversationSource.asObservable()
  }

}
