import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketCoreService } from './socket-core.service';
import { SocketRoomService } from './socket-room.service';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/features/messages/model/message.model';


export type SendMessageEmitterData = {
  message: Message;
  fromUserId: number;
  toUserId: number;
};

@Injectable({
  providedIn: 'root',
})
export class SocketMessageService {
  private socket: Socket | null = null;
  constructor(
    private socketRoomService: SocketRoomService,
    private socketCoreService: SocketCoreService,
   ) {
    this.initializeMessageListener();
  }

  private initializeMessageListener(){
    this.socket = this.socketCoreService.getSocket();
  }

  sentMessageEmitter( messageDada: SendMessageEmitterData): void {
    const roomId = this.socketRoomService.getRoom;
    if (!roomId) return;
    this.socket?.emit('send-message', { ...messageDada, roomId });
  }
}
