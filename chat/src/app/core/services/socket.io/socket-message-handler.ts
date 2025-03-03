import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';

@Injectable(
  {
    providedIn: 'root'
  }
)

export class SocketMessageHandler {
  private readMessageSubject = new BehaviorSubject<Message | null>(null);
  private deliveredMessageSubject = new BehaviorSubject<Message | null>(null);
  private messageDeliveredToReceiverSubject = new BehaviorSubject<Message | null>(null);
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject = new BehaviorSubject<Message[] | null>(null);
  private partnerConnectionStatusSubject = new BehaviorSubject<Member | null>(null);
  private userTypingStatusSubject = new BehaviorSubject<boolean>(false);
  private updatedChatCounterSubject = new BehaviorSubject<Conversation | null>(null);

   // Message Subjects Getters
   get getReadMessage() {
    return this.readMessageSubject.asObservable();
  }

  get getDeliveredMessage() {
    return this.deliveredMessageSubject.asObservable();
  }

  get getMessageDeliveredToReceiver() {
    return this.messageDeliveredToReceiverSubject.asObservable();
  }

  get getUpdatedMessagesToReadAfterPartnerJoinedRoom() {
    return this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.asObservable();
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

  setUpdatedMessagesToReadAfterPartnerJoinedRoom(messages: Message[] | null) {
    this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(messages);
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

  // Event Listeners for Messages and Status
  handleMessageEvents(socket: any) {
    socket.on('message-read', (readMessage: Message) => {
      if (readMessage) {
        this.setReadMessageSource(readMessage);
      }
    });

    socket.on('message-delivered', (deliveredMessage: Message) => {
      if (deliveredMessage) {
        this.setDeliveredMessage(deliveredMessage);
      }
    });

    socket.on('updated-chat-counter', (updatedChatCounter: Conversation) => {
      this.setUpdatedChatCounter(updatedChatCounter);
    });

    socket.on('message-delivered-to-receiver', (receivedMessage: Message) => {

      if (receivedMessage) {
        this.messageDeliveredToReceiverSubject.next(receivedMessage);
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

    socket.on('partner-joined-room', (updatedMessagesToRead: Message[]) => {
      if (updatedMessagesToRead) {
        this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
      }
    });
  }
}
