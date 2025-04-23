import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketCoreService } from './socket-core.service';
import { SocketRoomService } from './socket-room.service';
import { BehaviorSubject, Observable } from 'rxjs';

export type TypingData = {
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
  private userTypingStatusSubject = new BehaviorSubject<boolean>(false);
  constructor(
    private socketRoomService: SocketRoomService,
    private socketCoreService: SocketCoreService,
   ) {
    this.initializeTypingListener();
  }

  private initializeTypingListener(){
    this.socket = this.socketCoreService.getSocket();
    this.notifyTyping();
  }
  userTyping(toUserId: number):void {
    this.socket = this.socketCoreService.getSocket();
    const roomString = this.socketRoomService.getRoom;
    if (!roomString) return;
    const typingDto: TypingData  =
    { roomId: roomString, toUserId, typingStatus: TypingStatus.Typing }
    this.socket?.emit('user-typing', typingDto);
  }

  userStopTyping( toUserId: number): void {
    this.socket = this.socketCoreService.getSocket();
    const roomString = this.socketRoomService.getRoom;
    if (!roomString) return;
    const stopTypingDto: TypingData  =
    { roomId: roomString, toUserId, typingStatus: TypingStatus.StopTyping }
    console.log('Hello from stop  typing', roomString)
    this.socket?.emit('user-stop-typing', stopTypingDto)
  }

  notifyTyping(): void {
    this.socket?.on('notify-user-typing', (data: TypingData) => {
      if (data.typingStatus) {
        this.userTypingStatusSubject.next(data.typingStatus === TypingStatus.Typing);
        console.log('Hello from data typing', data,this.userTypingStatusSubject.value )
      }
    });

    this.socket?.on('notify-user-stop-typing', (data: TypingData) => {
      if (data.typingStatus) {
        console.log('Hello from data stop typing', data)
        this.userTypingStatusSubject.next(data.typingStatus === TypingStatus.StopTyping);
      }
    });
  }

  get getUserTypingStatus():Observable<boolean> {
    return this.userTypingStatusSubject.asObservable();
  }
}
