import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketCoreService } from './socket-core.service';
import { SocketRoomService } from './socket-room.service';
import { BehaviorSubject } from 'rxjs';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

export type TypingPayload = {
  chatId: number;
  roomId: string;
  toUserId: number;
  typingStatus: TypingStatus;

};

export enum TypingStatus  {
  Typing = 'typing',
  StopTyping = 'stop-typing',
}

@Injectable({
  providedIn: 'root',
})
export class SocketTypingService {
  private socket: Socket | null = null;
  private userTypingStatusSubject = new BehaviorSubject< TypingPayload | null>(null);
  getUserTypingStatus$ = this.userTypingStatusSubject.asObservable();
  isTyping: boolean = false;

  constructor(
    private socketRoomService: SocketRoomService,
    private socketCoreService: SocketCoreService,
    private activeConversationService: ActiveConversationService,
   ) {}

 initializeTypingListener(): void{
    this.socket = this.socketCoreService.getSocket();
    this.notifyTyping();
  }

  userTyping(toUserId: number):void {

    const typingPayload: TypingPayload | null =
    this.buildTypingNotification(toUserId, TypingStatus.Typing);
    if (!typingPayload) return;
    this.socket?.emit('user-typing', typingPayload);
    this.isTyping = true;
  }

  userStopTyping( toUserId: number): void {
   const typingPayload: TypingPayload | null =
     this.buildTypingNotification(toUserId, TypingStatus.StopTyping);
   if (!typingPayload) return;
   this.socket?.emit('user-stop-typing', typingPayload);
  }

  notifyTyping(): void {
    this.socket?.on('notify-user-typing', (data: TypingPayload) => {
      if (data.typingStatus) {
        this.userTypingStatusSubject.next(data);
      }
    });

    this.socket?.on('notify-user-stop-typing', (data: TypingPayload) => {
      if (data.typingStatus) {
        this.userTypingStatusSubject
        .next(data);
      }
    });
  }

  buildTypingNotification(
    toUserId: number,
    typingStatus: TypingStatus,
  ): TypingPayload | null  {

    this.socket = this.socketCoreService.getSocket();
    const roomString = this.socketRoomService.getRoom;
    const chatId = this.getActiveConversationId();

    if (!roomString || !chatId) return null;
    const typingPayload: TypingPayload =
    {
      chatId: chatId,
      roomId: roomString,
      toUserId,
      typingStatus: typingStatus
    }
    return typingPayload;
  }

  getActiveConversationId(): number | null{
    const chatId = this.activeConversationService.getActiveConversationValue?.id;
    return chatId ?? null;
  }
}
