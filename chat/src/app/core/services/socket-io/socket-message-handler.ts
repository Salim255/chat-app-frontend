import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { SendMessageEmitterData } from "./socket-io.service";
import { ConversationService } from "src/app/features/conversations/services/conversations.service";
import { WorkerService } from "../../workers/worker.service";
import { ReceivedMessage } from "../../workers/decrypt.worker";
import { GetAuthData } from "src/app/shared/utils/get-auth-data";
import { MessageDecryptionData, MessageEncryptDecrypt } from "../encryption/message-encrypt-decrypt-";


@Injectable(
  {
    providedIn: 'root'
  }
)

export class SocketMessageHandler {
  private readMessageSubject = new BehaviorSubject<Message | null>(null);
  private deliveredMessageSubject = new BehaviorSubject<Message | null>(null);
  private messageDeliveredToReceiverSubject = new BehaviorSubject<Message | null>(null);
  private partnerConnectionStatusSubject = new BehaviorSubject<Member | null>(null);
  private userTypingStatusSubject = new BehaviorSubject<boolean>(false);
  private updatedChatCounterSubject = new BehaviorSubject<Conversation | null>(null);

  constructor(
    private conversationService: ConversationService,

  ) {

  }
   // Message Subjects Getters
   get getReadMessage() {
    return this.readMessageSubject.asObservable();
  }

  get getDeliveredMessage() {
    return this.deliveredMessageSubject.asObservable();
  }

  // Here we are returning the observable of the messageDeliveredToReceiverSubject
  get getMessageDeliveredToReceiver() {
    return this.messageDeliveredToReceiverSubject.asObservable();
  }


  get getPartnerConnectionStatus() {
    return this.partnerConnectionStatusSubject.asObservable();
  }

  get getUserTypingStatus() {
    return this.userTypingStatusSubject.asObservable();
  }

  get getUpdatedChatCounter() {
    return this.updatedChatCounterSubject.asObservable();
  }



  // Message Handlers
  setReadMessageSource(readMessage: Message | null) {
    this.readMessageSubject.next(readMessage);
  }

  setDeliveredMessage(message: Message | null) {
    this.deliveredMessageSubject.next(message);
  }

  setPartnerConnectionStatus(updatedUser: Member | null) {
    this.partnerConnectionStatusSubject.next(updatedUser);
  }

  setUserTypingStatus(status: boolean) {
    this.userTypingStatusSubject.next(status);
  }

  setUpdatedChatCounter(updatedChatCounter: Conversation | null) {
    this.updatedChatCounterSubject.next(updatedChatCounter);
  }

  setReceivedMessage(message: Message | null) {
    this.messageDeliveredToReceiverSubject.next(message);
  }

  // Event Listeners for Messages and Status
  handleMessageEvents(socket: any) {
    socket.on('message-read', (readMessage: Message) => {
      if (readMessage) {
        this.setReadMessageSource(readMessage);
      }
    });

    socket.on('message-delivered', (deliveredMessage: Message) => {
      console.log('deliveredMessage', deliveredMessage);
      if (deliveredMessage) {
        this.setDeliveredMessage(deliveredMessage);
      }
    });

    socket.on('updated-chat-counter', (updatedChatCounter: Conversation) => {
      this.setUpdatedChatCounter(updatedChatCounter);
    });

    // To server by the receiver when the message is delivered to the receiver
    socket.on('message-delivered-to-receiver', async (receivedMessage: ReceivedMessage ) => {
     try {
        if(!receivedMessage) return;

        const { _privateKey: privateKey,  _email: email } = await GetAuthData.getAuthData();

        const decryptionData: MessageDecryptionData = {
          encryptedMessageBase64: receivedMessage.content,
          encryptedSessionKeyBase64: receivedMessage.encrypted_session_base64,
          receiverPrivateKeyBase64: privateKey,
          receiverEmail: email
        };

        const decryptedContent = await MessageEncryptDecrypt.decryptMessage(decryptionData);
        const {encrypted_session_base64, ...rest} = receivedMessage;
        const decryptedMessage = {...rest, content: decryptedContent};
        this.conversationService.updateConversationWithNewMessage(decryptedMessage);

     } catch (error) {
        console.error("Error processing received message:", error);
     }

    });


    socket.on('user-online', (updatedUser: Member) => {
      if (updatedUser) {
        this.setPartnerConnectionStatus(updatedUser);
      }
    });

    socket.on('user-offline', (updatedUser: Member) => {
      if (updatedUser) {
        this.setPartnerConnectionStatus(updatedUser);
      }
    });

    socket.on('notify-user-typing', (status: boolean) => {
      if (status) {
        this.setUserTypingStatus(true);
      }
    });

    socket.on('notify-user-stop-typing', (status: boolean) => {
      if (status) {
        this.setUserTypingStatus(false);
      }
    });
  }

  sentMessageEmitter(socket: any, messageEmitterDada: SendMessageEmitterData ) {
     // 2) Trigger emitter
     socket?.emit('send-message', messageEmitterDada)
  }
}
