import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject} from 'rxjs';
import { ConversationService } from '../../features/conversations/services/conversations.service';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';


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

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private currentRoomId: string = "";
  private socket!: Socket;
  private userId: any;
  private ENV = environment;
  private receivedMessageEventSource = new BehaviorSubject< any > (null) ;
  private comingTypingSource = new BehaviorSubject < any > (null) ;
  private readMessageSubject = new BehaviorSubject< Message | null > (null) ;
  private   deliveredMessageSubject = new BehaviorSubject< Message | null > (null) ;
  private messageDeliveredToReceiverSubject = new BehaviorSubject< Message | null > (null) ;



  private roomIdSource = new BehaviorSubject < string  | null> (null);

  constructor(private conversationService: ConversationService, private authService: AuthService,
    private activeConversationService: ActiveConversationService
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
      console.log('Connected to server 💥💥');
      if (this.userId) {
        this.registerUser(this.userId);

        this.broadcastingUserOnline();
      }
      // Listen to sever welcome event
      this.socket.on('Welcome', (data) => {
        console.log(data, 'welcome');
      })
    })
    // Listen to reconnect to server event
    this.socket.on('reconnect', () => {
      console.log('Reconnected to server 💥💥');
      if (this.userId) {
        this.registerUser(this.userId);
        this.broadcastingUserOnline();
      }
    });

  }

  // 1
  registerUser(userId: number) {
    this.socket.emit('registerUser',  userId )
  }

  // 2
  broadcastingUserOnline() {
     this.socket.on('user-online', (userId ) => {
      console.log(userId)
     })
  }

  // 3 Emit the "join-room" event to create/join a chat room
  userJoinChatRoom(usersData: JoinRomData) {
    // Construct the roomId
    this.currentRoomId = [usersData.fromUserId, usersData.toUserId].sort().join('-');
    this.roomIdSource.next(this.currentRoomId);
    console.log(`Joined room: ${this.currentRoomId}`);
    // Trigger join-room event
    this.socket.emit('join-room', usersData)
  }

  // 4 emit the "send-message" event
  sentMessageEmitter(messageEmitterDada: SendMessageEmitterData) {
      console.log(messageEmitterDada)
      // 2) Trigger emitter
      this.socket.emit('send-message', messageEmitterDada)
  }

  // 5, Listen to message read
  messageReadListener() {
    this.socket.on('message-read', (readMessage) => {
        if (readMessage) {
          this.readMessageSubject.next(readMessage);
        }
    } )
  }

  // 6, Listen to message delivery by sender to connected receiver
  messageDeliveredListener() {
    this.socket.on('message-delivered', (deliveredMessage) => {
      console.log(deliveredMessage)
        if (deliveredMessage) {
          this.deliveredMessageSubject.next(deliveredMessage);
        }
    })
  }

  // 7, Listen to message delivery inside receiver client
  updateReceiverMessagesListener() {
   this.socket.on('message-delivered-to-receiver', (receivedMessage) => {
      console.log(receivedMessage)
      if (receivedMessage) {
        this.messageDeliveredToReceiverSubject.next(receivedMessage)
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

}
