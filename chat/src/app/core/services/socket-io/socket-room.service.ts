import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { SocketCoreService } from './socket-core.service';
import { Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { Conversation } from 'src/app/features/conversations/models/conversation.model';

export enum PartnerConnectionStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  InRoom = 'in-room',
}

export type JoinRomData = {
  fromUserId: number;
  toUserId: number;
  chatId: number | null;
};


@Injectable({
  providedIn: 'root',
})
export class SocketRoomService {
  private roomIdSource = new BehaviorSubject<string | null>(null);
  private socket: Socket | null = null;
  private userId: number | null = null;

  constructor(
    private readonly socketCoreService:  SocketCoreService,
    private activeConversationService: ActiveConversationService,
    private readonly authService: AuthService,

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
    this.setConversationRoomId(currentRoomId);
    this.emitJoinRoom(usersData);
  }

  private partnerJoinRoom():void{
    this.socket?.on(
      'partner-joined-room',
       (data: JoinRomData) => {
      this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.InRoom);
      if (!data.chatId) return;
       // Get the active conversation
      this.activeConversationService.updateMessagesToReadWithPartnerJoinRoom(data.chatId).subscribe();

    });
  }

  private partnerLeftRoom():void{
    this.socket?.on('partner-left-room', (data: JoinRomData) => {
      const currentPartnerId = this.activeConversationService.partnerInfoSource.value?.partner_id;
      if (currentPartnerId === data.toUserId) {
        this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.ONLINE);
      }
    });
  }

  private partnerGoesOffline():void {
    this.socket?.on('user-offline', (data: { userId: number, status: string }) => {
      const currentPartnerId = this.activeConversationService.partnerInfoSource.value?.partner_id;
      if (currentPartnerId === data.userId) {
        this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.OFFLINE);
      }
    });
  }

  private partnerGoesOnline():void {
    this.socket?.on('user-online', (data: {userId: number, status: string}) => {
      const currentPartnerId = this.activeConversationService.partnerInfoSource.value?.partner_id;
      if (currentPartnerId === data.userId) {
        this.activeConversationService.fetchActiveConversation().subscribe();
        this.activeConversationService.setPartnerInRoomStatus(PartnerConnectionStatus.ONLINE);
      }
    })
  }

  emitJoinRoom(usersData: JoinRomData):void {
    this.socket = this.socketCoreService.getSocket();
    this.socket?.emit('join-room', usersData);
  }

 emitLeaveRoom():void {
    this.socket = this.socketCoreService.getSocket();
    const fromUserId = this.activeConversationService.partnerInfoSource.value?.partner_id;
    let chatId!: number;
    this.activeConversationService.getActiveConversation
    .pipe(take(1)).subscribe((chat: Conversation | null) => {
      if (!chat) return
      chatId = chat.id;
    });

    if (
        !this.activeConversationService.partnerInfoSource?.value
        || !fromUserId
        || !chatId
        || !this.userId
      ) return

    const data: JoinRomData =
      { fromUserId, toUserId: this.userId, chatId: chatId}
    this.socket?.emit('leave-room',  data );
  }

  get getRoom(): string | null {
    return this.roomIdSource.value;
  }

  setConversationRoomId(roomId: string | null): void {
    this.roomIdSource.next(roomId);
  }
}
