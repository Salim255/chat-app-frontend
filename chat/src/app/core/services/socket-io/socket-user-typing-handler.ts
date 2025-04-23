import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';

export type TypingData = {
  roomId: string;
  toUserId: number;
  typingStatus: 'typing' | 'stop-typing';
};

@Injectable({
  providedIn: 'root',
})
export class SocketUserTypingHandler {
  constructor() {}

  handleTypingListeners(socket: Socket, data: TypingData):void {
    socket?.emit('user-stop-typing', data);
  }

  handleTypingEmitters(socket: Socket, data: TypingData): void {
    socket?.emit('user-typing', data);
  }
}
