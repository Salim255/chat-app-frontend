import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable} from 'rxjs';
import { ConversationService } from '../conversation/conversation.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {

  private socket!: Socket;
  userId: any;
  private receivedMessageEventSource = new BehaviorSubject< any > (null) ;
  private comingTypingSource = new BehaviorSubject < any > (null) ;
  constructor(private conversationService: ConversationService, private authService: AuthService) {

    this.authService.userId.subscribe( data =>{
      this.userId = data;
      if (this.userId) {
        this.userConnected(this.userId)
      }
    });

    // Establish connection
    this.socket = io('http://localhost:4003',  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');

      this.socket.on('Welcome', (data) => {
        console.log(data);
      })

    //
    this.onMessageSent();

    //
    this.onNewMessage()

    // Listen to coming typing event
    this.onTypingListener();

    })
  }

  get getComingTypingEvent () {
    return this.comingTypingSource.asObservable();
 }

  get getComingMessage () {
    return this.receivedMessageEventSource.asObservable();
  }

  onTyping(toUserId: number, status: boolean){
    this.socket.emit('user_typing', { toUserId, status })
  }
  sendMessage(chatId: string, fromUserId: string, toUserId: string, message: string) {
    this.socket.emit('send_message', { chatId, fromUserId, toUserId, message });
  }

  onMessageSent() {
    this.socket.on('message_sent', (data) => {
        console.log(data, "Hello Data");
    });
  }

  userConnected(userId: number) {
    this.socket.emit('user_connected', userId);
  }

  onTypingListener() {
    this.socket.on('typing_message', (data) => {
      console.log(data);
      this.comingTypingSource.next(data.status);
    })
  }
  onNewMessage() {
    this.socket.on('new_message', (data) => {
       // fetch chats
       let chatsObs: Observable <any> ;
       chatsObs = this.conversationService.fetchConversations();
       chatsObs.subscribe()
    })
  }
}
