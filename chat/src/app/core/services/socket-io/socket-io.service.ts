import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../../../features/messages/model/message.model';
import { SocketNewConversationHandler } from './socket-new-conversation-handler';
import { SocketMessageHandler } from './socket-message-handler';
import { SocketRoomHandler } from './socket-room-handler';
import { SocketUserTypingHandler } from './socket-user-typing-handler';
import { Conversation } from 'src/app/features/conversations/models/conversation.model';

export type JoinRomData = {
  fromUserId: number;
  toUserId: number;
  chatId: number | null;
  lastMessageSenderId: number | null;
};

export type SendMessageEmitterData = {
  message: Message;
  roomId: string;
  fromUserId: number;
  toUserId: number;
};

export enum ConnectionStatus {
  Online = 'online',
  Offline = 'offline',
}

@Injectable({ providedIn: 'root' })
export class SocketIoService {
  private socket: Socket | null = null;
  private userId: number | null = null;
  private ENV = environment;

  // ====== Other behaviorSubjects =======
  private currentRoomId: string = '';
  private roomIdSource = new BehaviorSubject<string | null>(null);
  private updateUserConnectionStatusWithDisconnectionSubject = new BehaviorSubject<any>(null);

  constructor(
    private socketMessageHandler: SocketMessageHandler,
    private socketRoomHandler: SocketRoomHandler,
    private socketUserTypingHandler: SocketUserTypingHandler,
    private socketNewConversationHandler: SocketNewConversationHandler
  ) {}

  // ==== Connection & initialization ======
  // =======================================
  // ---------------------------------------
  initializeSocket(userId: number): void {
    // ===== Current connected user id =======
    this.userId = userId;

    // ==== Check for socket connection ===
    if (this.socket && this.socket.connected) return;

    // ==== Establish socket connection =========
    this.socket = this.establishSocketConnection();

    // ===== Setup socket connection events =====
    this.socket.on('connect', () => {
      console.log('Connected 😍😍', this.socket);
      // ===========================
      if (this.userId) {
        this.registerUser(this.userId);
        // this.broadcastingUserOnline();
      }
      // ============================

      // =========================
      this.setupCommonListeners();
      // =========================
    });

    // ===== Listen to reconnect to server event ====
    this.socket.on('reconnect', () => {
      if (this.userId) {
        this.registerUser(this.userId);
        // this.broadcastingUserOnline();
      }
    });
  }

  private establishSocketConnection() {
    // ====== Establish connection to socket service ======
    return io(`${this.ENV.socketUrl}`, {
      transports: ['websocket', 'polling'],
      withCredentials: true, // Ensure credentials are sent with the request
    });
  }

  private setupCommonListeners(): void {
    this.setupPartnerConnectionListeners();
    this.setupDisconnectListener();

    if (this.socket) {
      this.socketMessageHandler.handleMessageEvents(this.socket); // Delegate message event handling
      this.socketRoomHandler.handleRoomEvent(this.socket);
      this.socketNewConversationHandler.handleIncomingNewConversationEvent(this.socket);
    }
  }

  private setupPartnerConnectionListeners() {
    // ===== Listen to user connection change =====
    this.socket?.on('user_status_changed', (result) => {
      console.log(result, 'heleoeo 💥💥');
      if (result) {
        this.updateUserConnectionStatusWithDisconnectionSubject.next(result);
      }
    });
  }

  private setupDisconnectListener() {
    this.socket?.on('disconnect', (reason) => {
      console.log('Disconnected: ', reason);
      this.socket = null;
    });
  }

  // =============================================
  // Emitters & Room Handling
  // ==================================
  // === Register the current user on the socket server
  private registerUser(userId: number) {
    console.log(this.socket?.connected, 'hello 1 ');
    if (this.socket && userId) {
      console.log('Registering user: ', userId);
      this.socket.emit('register-user', userId);
    }
  }

  // ================================================
  // ========== Handle new conversation emitter =====
  createdConversationEmitter(conversation: Conversation): void {
    console.log(conversation, 'Hello from socket service');
    if (!this.socket) return;
    this.socketNewConversationHandler.handleNewConversationEmitter(this.socket, conversation);
  }

  // ================================================

  // == Emits the "join-room" event  join a chat room
  userJoinChatRoom(usersData: JoinRomData): void {
    // Construct the roomId
    this.currentRoomId = [usersData.fromUserId, usersData.toUserId].sort().join('-');
    this.setConversationRoomId(this.currentRoomId);
    this.socketRoomHandler.handleJoinRoomEmit(this.socket, usersData);
  }

  // === Emit the "send-message" event to socket server ===
  sentMessageEmitter(messageEmitterDada: SendMessageEmitterData): void {
    this.socketMessageHandler.sentMessageEmitter(this.socket, messageEmitterDada);
  }

  // === Emit user left Chat Room event ===
  userLeftChatRoomEmitter(): void {
    if (!this.socket || !this.userId) return;
    this.socketRoomHandler.handleLeaveRoomEmit(this.socket, this.currentRoomId, this.userId);
  }

  // ==== Emit User typing event =====
  userTyping(toUserId: number): void {
    this.getConversationRoomId.subscribe((roomId) => {
      if (roomId) {
        this.socketUserTypingHandler.handleTypingEmitters(this.socket, {
          roomId,
          toUserId,
          typingStatus: 'typing',
        });
      }
    });
  }

  // ====Emits user stop typing event ====
  userStopTyping(toUserId: number): void {
    this.getConversationRoomId.subscribe((roomId) => {
      if (roomId) {
        this.socketUserTypingHandler.handleTypingListeners(this.socket, {
          roomId,
          toUserId,
          typingStatus: 'stop-typing',
        });
      }
    });
  }

  // ==== Emit user disconnected event =====
  private emitUserDisconnected(userId: number) {
    if (userId && this.socket) {
      console.log('Emitting user _disconnected for: ', userId);
      this.socket.emit('user_disconnected', { userId });
    }
  }

  //  ===== Manually disconnect when user logout =====
  disconnectUser(userId: number): void {
    if (this.socket) {
      console.log('Disconnecting socket for user 💥💥', userId);
      this.emitUserDisconnected(userId);
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // ====================================
  // Observables & Getters
  // ==============================
  get updatedUserDisconnectionGetter(): Observable<any> {
    return this.updateUserConnectionStatusWithDisconnectionSubject.asObservable();
  }

  setConversationRoomId(roomId: string | null): void {
    this.roomIdSource.next(roomId);
  }
  get getConversationRoomId(): Observable<string | null> {
    return this.roomIdSource.asObservable();
  }
}
