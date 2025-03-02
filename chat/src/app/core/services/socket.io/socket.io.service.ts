import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { Conversation} from 'src/app/features/active-conversation/models/active-conversation.model';
import { Member } from 'src/app/shared/interfaces/member.interface';

export type JoinRomData = {
  fromUserId: number ;
  toUserId: number;
  chatId: number | null;
  lastMessageSenderId: number | null;
}

export type SendMessageEmitterData = {
  message: Message;
  roomId: string;
  fromUserId: number;
  toUserId: number;
}

export type ConnectionStatus = 'online' | 'offline';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private currentRoomId: string = "";
  private socket: Socket | null = null;
  private userId: number | null = null;
  private ENV = environment;

  // ====== Subject for messages and status ======
  private readMessageSubject = new BehaviorSubject < Message | null > (null) ;
  private deliveredMessageSubject = new BehaviorSubject < Message | null > (null) ;
  private messageDeliveredToReceiverSubject = new BehaviorSubject < Message | null > (null) ;

  // ====== Other behaviorSubjects =======
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject = new BehaviorSubject < Message [] | null> (null)
  private partnerConnectionStatusSubject = new BehaviorSubject <Member | null>(null);
  private userTypingStatusSubject = new BehaviorSubject <boolean> (false)
  private roomIdSource = new BehaviorSubject < string  | null> (null);
  private updateUserConnectionStatusWithDisconnectionSubject = new BehaviorSubject < any > (null);
  private updatedChatCounterSubject = new BehaviorSubject < Conversation | null>  (null)


  constructor( ) { }

  // ==== Connection & initialization ======
  // =======================================
  // ---------------------------------------
  initializeSocket(userId: number) {
    // ===== Current connected user id =======
    this.userId = userId;
    console.log(this.socket)
    // ==== Check for socket connection ===
    if (this.socket  && this.socket.connected) return;

    // ==== Establish socket connection =========
    this.socket = this.establishSocketConnection();

    // ===== Setup socket connection events =====
    this.socket.on('connect', () => {
      console.log("Connected 😍😍",this.socket);
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

    private establishSocketConnection(){
        // ====== Establish connection to socket service ======
        return  io(`${this.ENV.socketUrl}`,  {
          transports: ['websocket', 'polling'],
          withCredentials: true // Ensure credentials are sent with the request
        });
    }

    private setupCommonListeners(): void {
      this.setupPartnerConnectionListeners();
      this.setupMessageListeners();
      this.setupTypingListeners();
      this.setupDisconnectListener();
      this.setupPartnerJoinedRoom();
    }

    private setupPartnerConnectionListeners() {
      // ===== Listen to user connection =======
      this.socket?.on('user-online', ( updatedUser: Member ) => {
        console.log(updatedUser)
        if (updatedUser) {
          this.partnerConnectionStatusSubject.next(updatedUser);
        }}
      );

      // ===== Listen to user disconnection =====
      this.socket?.on('user-offline', (updatedUser: Member ) => {
        if (updatedUser) {
          this.partnerConnectionStatusSubject.next(updatedUser);
          //this.updateUserConnectionStatusWithDisconnectionSubject.next(updatedUser);
        }}
      );

      // ===== Listen to user connection change =====
      this.socket?.on('user_status_changed', result => {
        console.log(result, "heleoeo 💥💥" )
        if (result) {
          //this.updateUserConnectionStatusWithDisconnectionSubject.next(result);
        }}
      );
    }

    private setupMessageListeners() {
      // === Listen to message read ===
      this.socket?.on('message-read', (readMessage: Message) => {
        if (readMessage) {
          this.setReadMessageSource(readMessage);
        }
      });

      // === Listen to message delivery by sender to connected receiver
      this.socket?.on('message-delivered', (deliveredMessage: Message) => {
        if (deliveredMessage) {
          this.setDeliveredMessage(deliveredMessage);
      }});

      // ===== Listen to chat message counter updated ====
      this.socket?.on('updated-chat-counter', (updatedChatCounter: Conversation) => {
          console.log(updatedChatCounter, "Hello from update counter")
          this.updatedChatCounterSubject.next(updatedChatCounter);
      })
      // === Listen to message delivery by receiver
      this.socket?.on('message-delivered-to-receiver', (receivedMessage: Message) => {
        console.log(receivedMessage, "hello from receiver")
        if (receivedMessage) {
          this.messageDeliveredToReceiverSubject.next(receivedMessage)
        }
     })
    }


  private  setupTypingListeners() {
    this.socket?.on('notify-user-typing', status => {
      if (status) {
        this.userTypingStatusSubject.next(true);
      }
    })

    this.socket?.on('notify-user-stop-typing', status => {
      if (status) {
        this.userTypingStatusSubject.next(false);
      }
    })
  }

   // ==== Listen to partner-joined-room =====
  // ==== Listen to partner join room to update messages ====
  private setupPartnerJoinedRoom() {
    this.socket?.on('partner-joined-room', (updatedMessagesToRead: Message []) => {
      console.log(updatedMessagesToRead, "hello join")
        if (updatedMessagesToRead) {
          this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
        }
    })
  }

  private setupDisconnectListener() {
    this.socket?.on('disconnect', (reason) => {
      console.log("Disconnected: ", reason);
      this.socket = null;
    })
  }

  // =============================================
  // Emitters & Room Handling
  // ==================================

  // === Register the current user on the socket server
  private registerUser(userId: number) {
    console.log(this.socket?.connected, "hello 1 ")
    if (this.socket  && userId) {
      console.log("Registering user: ", userId)
      this.socket.emit('registerUser',  userId );
    }
  }

  // == Emits the "join-room" event  join a chat room
  userJoinChatRoom(usersData: JoinRomData) {
    console.log(usersData, "hello from join room")
    // Construct the roomId
    this.currentRoomId = [usersData.fromUserId, usersData.toUserId].sort().join('-');
    this.setConversationRoomId(this.currentRoomId);

    // Trigger join-room event
    this.socket?.emit('join-room', usersData)
  }

  // === Emit the "send-message" event to socket server ===
  sentMessageEmitter(messageEmitterDada: SendMessageEmitterData) {
      // 2) Trigger emitter
      this.socket?.emit('send-message', messageEmitterDada)
  }


  // === Emit user left Chat Room event ===
  userLeftChatRoomEmitter() {
    this.socket?.emit('leave-room', { roomId: this.currentRoomId, userId: this.userId})
  }


  // ==== Emit User typing event =====
  userTyping(toUserId: number) {
    this.getConversationRoomId.subscribe(roomId => {
      if (roomId) {
        this.socket?.emit('user-typing', { roomId,  toUserId, typingStatus: 'typing' } )
      }
    })
  }

  // ====Emits user stop typing event ====
  userStopTyping(toUserId: number){
    this.getConversationRoomId.subscribe(roomId => {
      if (roomId) {
        this.socket?.emit('user-stop-typing', { roomId,  toUserId, typingStatus: 'stop-typing' })
      }
    })
  }

  // ==== Emit user disconnected event =====
  private emitUserDisconnected(userId: number) {
    if (userId && this.socket ) {
        console.log('Emitting user _disconnected for: ', userId);
        this.socket.emit('user_disconnected', { userId })
    }
  }

  //  ===== Manually disconnect when user logout =====
  disconnectUser(userId: number) {
    if (this.socket) {
      console.log("Disconnecting socket for user 💥💥", userId)
      this.emitUserDisconnected(userId);
      this.socket.disconnect();
      this.socket = null;
    }
  }


  // ====================================
  // Observables & Getters
  // ==============================

  get updatedUserDisconnectionGetter(){
    return this.updateUserConnectionStatusWithDisconnectionSubject.asObservable();
  }
  get getConversationRoomId() {
    return this.roomIdSource.asObservable();
  }

  setConversationRoomId(roomId: string | null) {
    this.roomIdSource.next(roomId);
  }

  get getReadMessage() {
    return this.readMessageSubject.asObservable();
  }

  setReadMessageSource(readMessage: Message | null) {
    this.readMessageSubject.next(readMessage);
  }

  get getDeliveredMessage() {
    return this.deliveredMessageSubject.asObservable();
  }
  setDeliveredMessage(message: Message | null) {
      this.deliveredMessageSubject.next(message)
  }

  get getMessageDeliveredToReceiver() {
     return this.messageDeliveredToReceiverSubject.asObservable();
  }

  get getUpdatedMessagesToReadAfterPartnerJoinedRoom() {
    return this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.asObservable();
  }
  setUpdatedMessagesToReadAfterPartnerJoinedRoom(messages: Message [] | null) {
    this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(messages);
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
}
