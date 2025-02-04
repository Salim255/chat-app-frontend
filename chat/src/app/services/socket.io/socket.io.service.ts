import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject} from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { User } from 'src/app/features/active-conversation/models/active-conversation.model';


export type JoinRomData = {
  fromUserId: number ;
  toUserId: number;
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
  private socket!: Socket;
  private userId: any;
  private ENV = environment;

  private readMessageSubject = new BehaviorSubject < Message | null > (null) ;
  private deliveredMessageSubject = new BehaviorSubject < Message | null > (null) ;
  private messageDeliveredToReceiverSubject = new BehaviorSubject < Message | null > (null) ;
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject = new BehaviorSubject < Message [] | null> (null)
  private partnerConnectionStatusSubject = new BehaviorSubject <User | null>(null);
  private userTypingStatusSubject = new BehaviorSubject <boolean> (false)



  private roomIdSource = new BehaviorSubject < string  | null> (null);

  constructor( private authService: AuthService
  ) {

    this.authService.userId.subscribe( data =>{
      this.userId = data;
      if (this.socket?.connected && this.userId) {
        this.registerUser(this.userId);
        this.broadcastingUserOnline();
      }
    });

    // Establish connection
    this.socket = io(`${this.ENV.socketUrl}`,  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });


    // Listen to connect to server event
    this.socket.on('connect', () => {
      if (this.userId) {
        this.registerUser(this.userId);
      }
      // Listen to sever welcome event
      this.socket.on('Welcome', (data) => {
        console.log(data, 'welcome');
      })

      // Listen to partner join room to update messages
      this.partnerJoinedRoom();

      // Listen to partner connection
      this.broadcastingUserOnline();

      // Listen to partner disconnection
      this.listenToPartnerDisconnectionOffline();

      // ========== ====== ========
      this.messageReadListener();
      this.messageDeliveredListener();
    })

    // Listen to reconnect to server event
    this.socket.on('reconnect', () => {
      if (this.userId) {
        this.registerUser(this.userId);
        this.broadcastingUserOnline();
      }
    });

    //=========userStopTypingListener
    this.userStopTypingListener();

    //==========userStartTypingListener
    this.userStartTypingListener();

  }

  // 1
  registerUser(userId: number) {
    this.socket.emit('registerUser',  userId )
  }

  // 2, Listen to user connection
  broadcastingUserOnline() {
     this.socket.on('user-online', ( updatedUser ) => {
        if (updatedUser) {
          this.partnerConnectionStatusSubject.next(updatedUser);
        }
     })
  }

  // 3, Listen to user disconnection
  listenToPartnerDisconnectionOffline() {
    this.socket.on('user-offline', (updatedUser ) => {
      if (updatedUser) {
        this.partnerConnectionStatusSubject.next(updatedUser);
      }
     })
  }

  // 4 Emit the "join-room" event to create/join a chat room
  userJoinChatRoom(usersData: JoinRomData) {
    // Construct the roomId
    this.currentRoomId = [usersData.fromUserId, usersData.toUserId].sort().join('-');
    this.roomIdSource.next(this.currentRoomId);

    // Trigger join-room event
    this.socket.emit('join-room', usersData)
  }

  // 5 emit the "send-message" event
  sentMessageEmitter(messageEmitterDada: SendMessageEmitterData) {
      // 2) Trigger emitter
      this.socket.emit('send-message', messageEmitterDada)
  }

  // 6, Listen to message read
  messageReadListener() {
    this.socket.on('message-read', (readMessage) => {
        if (readMessage) {
          this.readMessageSubject.next(readMessage);
        }
    } )
  }

  // 7, Listen to message delivery by sender to connected receiver
  messageDeliveredListener() {
    this.socket.on('message-delivered', (deliveredMessage) => {
        if (deliveredMessage) {
          this.deliveredMessageSubject.next(deliveredMessage);
        }
    })
  }

  // 8, Listen to message delivery inside receiver client
  updateReceiverMessagesListener() {
   this.socket.on('message-delivered-to-receiver', (receivedMessage) => {
      if (receivedMessage) {
        this.messageDeliveredToReceiverSubject.next(receivedMessage)
      }
   })
  }

  // 9, Emit user left ChatRoom
  userLeftChatRoomEmitter() {
    this.socket.emit('leave-room', { roomId: this.currentRoomId, userId: this.userId})
  }
  // 10, Listen to partner-joined-room
  partnerJoinedRoom() {
    this.socket.on('partner-joined-room', (updatedMessagesToRead) => {
        if (updatedMessagesToRead) {
          this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(updatedMessagesToRead);
        }
    })
 }

  // 11, User typing emitter
  userTyping(toUserId: number) {
    this.getConversationRoomId.subscribe(roomId => {
      if (roomId) {
        this.socket.emit('user-typing', { roomId,  toUserId, typingStatus: 'typing' } )
      }
    })
  }

  // 12, User stop typing emitter
  userStopTyping(toUserId: number){
    this.getConversationRoomId.subscribe(roomId => {
      if (roomId) {
        this.socket.emit('user-stop-typing', { roomId,  toUserId, typingStatus: 'stop-typing' })
      }
    })
  }

  // 13, User stopt typing listener
  userStopTypingListener() {
    this.socket.on('notify-user-stop-typing', status => {
      if (status) {
        this.userTypingStatusSubject.next(false);
      }
    })
  }

  // 14, User start typing listener
  userStartTypingListener() {
    this.socket.on('notify-user-typing', status => {
      console.log(status)
      if (status) {
        this.userTypingStatusSubject.next(true);
      }
    })
  }

  get getConversationRoomId() {
    return this.roomIdSource.asObservable();
  }

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

  get getPartnerConnectionStatusSubject() {
      return this.partnerConnectionStatusSubject.asObservable();
  }

  get getUserTypingStatus() {
    return this.userTypingStatusSubject.asObservable();
  }

}
