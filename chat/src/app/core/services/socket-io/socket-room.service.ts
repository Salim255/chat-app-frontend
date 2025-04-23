import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Message } from '../../../features/messages/model/message.model';
import { JoinRomData } from './socket-io.service';
import {
  ActiveConversationService,
  PartnerRoomStatus,
} from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketCoreService } from './socket-core.service';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketRoomService {
  private roomIdSource = new BehaviorSubject<string | null>(null);
  private socket: Socket | null = null;
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject =
    new BehaviorSubject< Message[] | null>(null);

  constructor(
    private readonly socketCoreService:  SocketCoreService,
    private activeConversationService: ActiveConversationService,
  ) {
    this.initializeRoomListeners();
  }

  private initializeRoomListeners(){
    this.socket = this.socketCoreService.getSocket();
    this.partnerJoinRoom();
    this.partnerLeftRoom();
  }

  initiateRoom(usersData: JoinRomData): void {
    const currentRoomId = [usersData.fromUserId, usersData.toUserId].sort().join('-');
    console.log('rooom: ',currentRoomId, 'Hello' , this.socket)
    this.setConversationRoomId(currentRoomId);
    this.emitJoinRoom(usersData);
  }
  private partnerJoinRoom():void{
    this.socket?.on('partner-joined-room', (updatedMessagesToRead: Message[]) => {
      console.log(updatedMessagesToRead, 'Hello from joinig room')
      this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.IN_ROOM);
      if (updatedMessagesToRead && updatedMessagesToRead.length > 0) {
        // Get the active conversation
        this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
      }
    });
  }

  private partnerLeftRoom(): void{
    this.socket?.on('partner-left-room', (data: any) => {
      this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.CONNECTED);
    });
  }

  setUpdatedMessagesToReadAfterPartnerJoinedRoom(messages: Message[] | null):void {
    this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(messages);
  }

  get getUpdatedMessagesToReadAfterPartnerJoinedRoom():Observable<Message [] | null> {
    return this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.asObservable();
  }

  emitJoinRoom(usersData: JoinRomData):void {
    this.socket = this.socketCoreService.getSocket();
    console.log('Join room', usersData)
    // Trigger join-room event
    this.socket?.emit('join-room', usersData);
  }

  emitLeaveRoom( userId: number):void {
    this.socket = this.socketCoreService.getSocket();
    const roomId = this.roomIdSource.value;
    this.socket?.emit('leave-room', { roomId, userId });
  }

  get getRoom(): string | null {
    return this.roomIdSource.value;
  }

  setConversationRoomId(roomId: string | null): void {
    this.roomIdSource.next(roomId);
  }
}
