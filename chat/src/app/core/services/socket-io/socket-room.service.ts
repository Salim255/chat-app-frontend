import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../../features/messages/model/message.model';
import { JoinRomData } from './socket-io.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketCoreService } from './socket-core.service';
import { Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { MessageService } from 'src/app/features/messages/services/message.service';

export enum PartnerConnectionStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  InRoom = 'in-room',
}

@Injectable({
  providedIn: 'root',
})
export class SocketRoomService {
  private roomIdSource = new BehaviorSubject<string | null>(null);
  private socket: Socket | null = null;
  private userId: number | null = null;
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject =
    new BehaviorSubject< Message[] | null>(null);

  constructor(
    private readonly socketCoreService:  SocketCoreService,
    private activeConversationService: ActiveConversationService,
    private readonly authService: AuthService,
    private messageService: MessageService

  ) {
    this.authService.userId.subscribe(userId => this.userId = userId);
  }

  initializeRoomListeners(): void{
    this.socket = this.socketCoreService.getSocket();
    this.partnerJoinRoom();
    this.partnerLeftRoom();
    this.partnerGoesOffline();
    this.partnerGoesOnline();
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
      this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.InRoom);
      if (updatedMessagesToRead && updatedMessagesToRead.length > 0) {
        // Get the active conversation
        this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
      }
    });
  }

  private partnerLeftRoom():void{
    this.socket?.on('partner-left-room', (data: any) => {
      console.log('left room')
      this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.ONLINE);
    });
  }

  private partnerGoesOffline():void {
    this.socket?.on('user-offline', (data: any) => {
      console.log('Hello from user-offline',)
      this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.OFFLINE);
    });
  }

  private partnerGoesOnline():void {
    this.socket?.on('user-online', (data: {userId: number, status: string}) => {
      console.log('partner going onine', data)
      const currentPartnerId = this.activeConversationService.partnerInfoSource.value?.partner_id;
      if (currentPartnerId === data.userId) {
        console.log('formuserID: ',2 , 'ToUserId: ', data.userId )
       /*  this.messageService.updateActiveChatMessageToDelivered(currentPartnerId).subscribe(messages => {
          console.log(messages);
        }); */
        this.activeConversationService.fetchActiveConversation().subscribe();
        //this.activeConversationService.
        this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.ONLINE);
      }
    })
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

  emitLeaveRoom():void {
    this.socket = this.socketCoreService.getSocket();
    const roomId = this.roomIdSource.value;
    this.socket?.emit('leave-room', { roomId, userId: this.userId });
  }

  get getRoom(): string | null {
    return this.roomIdSource.value;
  }

  setConversationRoomId(roomId: string | null): void {
    this.roomIdSource.next(roomId);
  }
}
